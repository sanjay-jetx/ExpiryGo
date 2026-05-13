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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to FreshSave API"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_firebase_uid(db, firebase_uid=user.firebase_uid)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/{firebase_uid}", response_model=schemas.User)
def read_user(firebase_uid: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_firebase_uid(db, firebase_uid=firebase_uid)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.post("/shops/", response_model=schemas.Shop)
def create_shop(shop: schemas.ShopCreate, owner_firebase_uid: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_firebase_uid(db, firebase_uid=owner_firebase_uid)
    if not db_user:
        raise HTTPException(status_code=404, detail="Owner not found")
    return crud.create_shop(db=db, shop=shop, owner_id=db_user.id)

@app.get("/products/", response_model=List[schemas.ProductWithShop])
def read_products(
    skip: int = 0,
    limit: int = 100,
    hide_expired: bool = True,
    db: Session = Depends(get_db),
):
    """
    List active products with shop details.
    When hide_expired=true (default), products past expiry_date are omitted.
    """
    products = crud.get_products(db, skip=skip, limit=limit, hide_expired=hide_expired)
    return products

@app.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, shop_id: int, db: Session = Depends(get_db)):
    db_shop = crud.get_shop(db, shop_id=shop_id)
    if not db_shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return crud.create_product(db=db, product=product, shop_id=shop_id)
