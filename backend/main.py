from contextlib import asynccontextmanager
from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud, models, schemas
from database import engine, get_db, get_settings, verify_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    if settings.validate_on_startup:
        verify_connection()
    models.Base.metadata.create_all(bind=engine)
    yield
    engine.dispose()


app = FastAPI(title="FreshSave API", lifespan=lifespan)

# Setup CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Add your production frontend URL here when deploying
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to FreshSave API"}

from auth import verify_firebase_token, get_current_user, get_current_shop_owner

@app.post("/users/", response_model=schemas.User)
def create_user(user_data: schemas.UserBase, db: Session = Depends(get_db), decoded_token: dict = Depends(verify_firebase_token)):
    firebase_uid = decoded_token.get("uid")
    db_user = crud.get_user_by_firebase_uid(db, firebase_uid=firebase_uid)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    
    # Create the user using the UID from the verified token
    user_create = schemas.UserCreate(
        firebase_uid=firebase_uid,
        **user_data.model_dump()
    )
    return crud.create_user(db=db, user=user_create)

@app.get("/users/me", response_model=schemas.User)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/users/{firebase_uid}", response_model=schemas.User)
def read_user(firebase_uid: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_firebase_uid(db, firebase_uid=firebase_uid)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/shops/", response_model=schemas.Shop)
def create_shop(shop: schemas.ShopCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_shop_owner)):
    existing_shop = crud.get_shop_by_owner(db, owner_id=current_user.id)
    if existing_shop:
        raise HTTPException(status_code=400, detail="User already has a shop")
    return crud.create_shop(db=db, shop=shop, owner_id=current_user.id)

@app.get("/shops/{shop_id}", response_model=schemas.Shop)
def read_shop(shop_id: int, db: Session = Depends(get_db)):
    db_shop = crud.get_shop(db, shop_id=shop_id)
    if db_shop is None:
        raise HTTPException(status_code=404, detail="Shop not found")
    return db_shop

@app.put("/shops/{shop_id}", response_model=schemas.Shop)
def update_shop(shop_id: int, shop: schemas.ShopCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_shop_owner)):
    db_shop = crud.get_shop(db, shop_id=shop_id)
    if db_shop is None:
        raise HTTPException(status_code=404, detail="Shop not found")
    if db_shop.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this shop")
    return crud.update_shop(db=db, shop_id=shop_id, shop_update=shop)

@app.get("/products/", response_model=List[schemas.ProductWithShop])
def read_products(
    skip: int = 0,
    limit: int = 100,
    hide_expired: bool = True,
    db: Session = Depends(get_db),
):
    products = crud.get_products(db, skip=skip, limit=limit, hide_expired=hide_expired)
    return products

@app.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_shop_owner)):
    db_shop = crud.get_shop_by_owner(db, owner_id=current_user.id)
    if not db_shop:
        raise HTTPException(status_code=400, detail="Shop owner has no shop created yet")
    return crud.create_product(db=db, product=product, shop_id=db_shop.id)
