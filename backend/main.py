"""
FreshSave API — MongoDB + JWT auth (no Firebase).
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime

import schemas
from database import get_db, client as db_client
from auth import get_current_user_uid, get_password_hash, verify_password, create_access_token
from bson import ObjectId

app = FastAPI(title="FreshSave MongoDB API")

# Setup CORS — allow all origins during development to avoid CORS issues
ALLOWED_ORIGINS = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# STARTUP & HEALTH
# =========================

@app.on_event("startup")
async def startup_db_check():
    """Verify MongoDB is reachable when the server starts."""
    try:
        info = await db_client.server_info()
        print(f"[STARTUP] MongoDB connected OK - version {info.get('version', '?')}")
    except Exception as e:
        print(f"[STARTUP] WARNING: MongoDB not reachable: {e}")
        print(f"[STARTUP] The server will start, but DB operations will fail until MongoDB is available.")

@app.get("/health")
async def health_check():
    """Quick health check endpoint."""
    try:
        db = await get_db()
        await db.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "degraded", "database": str(e)}

# =========================
# AUTH: REGISTER & LOGIN
# =========================

@app.post("/auth/register", response_model=schemas.AuthResponse)
async def register(req: schemas.RegisterRequest, db=Depends(get_db)):
    """Register a new user with email + password. Returns JWT."""
    # 1. Validation: Check if email already exists
    existing = await db.users.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # 2. Hash Password
    hashed_pwd = get_password_hash(req.password)
    
    # 3. Create user doc
    user_doc = {
        "email": req.email,
        "name": req.name,
        "hashed_password": hashed_pwd,
        "is_shop_owner": req.is_shop_owner,
        "created_at": datetime.utcnow(),
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # 4. Create JWT
    token = create_access_token({"sub": user_id, "email": req.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": req.email,
            "name": req.name,
            "is_shop_owner": req.is_shop_owner,
        },
    }
@app.post("/auth/login", response_model=schemas.AuthResponse)
async def login(req: schemas.LoginRequest, db=Depends(get_db)):
    """Login with email + password. Returns JWT."""
    user = await db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "email": user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user["name"],
            "is_shop_owner": user.get("is_shop_owner", False),
        },
    }


# =========================
# USERS
# =========================

@app.get("/users/me")
async def read_current_user(db=Depends(get_db), uid: str = Depends(get_current_user_uid)):
    """Get the currently authenticated user's profile."""
    user = await db.users.find_one({"_id": ObjectId(uid)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "is_shop_owner": user.get("is_shop_owner", False),
    }


# =========================
# SHOPS
# =========================

@app.post("/shops/")
async def create_shop(shop: schemas.ShopBase, db=Depends(get_db), uid: str = Depends(get_current_user_uid)):
    # Check if user is shop owner
    user = await db.users.find_one({"_id": ObjectId(uid)})
    if not user or not user.get("is_shop_owner"):
        raise HTTPException(status_code=403, detail="Not authorized as shop owner")

    existing_shop = await db.shops.find_one({"owner_uid": uid})
    if existing_shop:
        raise HTTPException(status_code=400, detail="User already has a shop")

    new_shop = shop.model_dump()
    new_shop["owner_uid"] = uid
    result = await db.shops.insert_one(new_shop)
    new_shop["id"] = str(result.inserted_id)
    return new_shop


@app.get("/shops/me")
async def read_my_shop(db=Depends(get_db), uid: str = Depends(get_current_user_uid)):
    """Get the shop owned by the currently authenticated user."""
    shop = await db.shops.find_one({"owner_uid": uid})
    if not shop:
        raise HTTPException(status_code=404, detail="No shop found for this user")
    shop["id"] = str(shop["_id"])
    return shop


@app.get("/shops/{shop_id}")
async def read_shop(shop_id: str, db=Depends(get_db)):
    shop = await db.shops.find_one({"_id": ObjectId(shop_id)})
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    shop["id"] = str(shop["_id"])
    return shop


# =========================
# PRODUCTS
# =========================

@app.get("/products/")
async def read_products(
    shop_id: Optional[str] = None,
    hide_expired: bool = True,
    db=Depends(get_db),
):
    query = {}
    if shop_id:
        query["shop_id"] = shop_id
    if hide_expired:
        query["expiry_date"] = {"$gt": datetime.utcnow()}

    cursor = db.products.find(query).sort("expiry_date", 1)
    products = await cursor.to_list(length=100)

    for p in products:
        p["id"] = str(p["_id"])
        # Fetch shop details for each product (simple join)
        try:
            shop = await db.shops.find_one({"_id": ObjectId(p["shop_id"])})
            if shop:
                p["shop"] = {
                    "id": str(shop["_id"]),
                    "name": shop["name"],
                    "address": shop["address"],
                }
        except Exception:
            pass

    return products


@app.post("/products/")
async def create_product(product: schemas.ProductCreate, db=Depends(get_db), uid: str = Depends(get_current_user_uid)):
    shop = await db.shops.find_one({"owner_uid": uid})
    if not shop:
        raise HTTPException(status_code=400, detail="No shop found for this owner")

    new_product = product.model_dump()
    new_product["shop_id"] = str(shop["_id"])
    new_product["created_at"] = datetime.utcnow()

    result = await db.products.insert_one(new_product)
    new_product["id"] = str(result.inserted_id)
    return new_product


@app.delete("/products/{product_id}")
async def delete_product(product_id: str, db=Depends(get_db), uid: str = Depends(get_current_user_uid)):
    shop = await db.shops.find_one({"owner_uid": uid})
    if not shop:
        raise HTTPException(status_code=400, detail="Not a shop owner")

    result = await db.products.delete_one({
        "_id": ObjectId(product_id),
        "shop_id": str(shop["_id"]),
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")
    return {"message": "Product deleted"}
