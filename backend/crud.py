from datetime import datetime, timezone

from sqlalchemy.orm import Session, joinedload

import models
import schemas

def get_user_by_firebase_uid(db: Session, firebase_uid: str):
    return db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        firebase_uid=user.firebase_uid,
        email=user.email,
        name=user.name,
        is_shop_owner=user.is_shop_owner
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_shop(db: Session, shop_id: int):
    return db.query(models.Shop).filter(models.Shop.id == shop_id).first()

def get_shop_by_owner(db: Session, owner_id: int):
    return db.query(models.Shop).filter(models.Shop.owner_id == owner_id).first()

def create_shop(db: Session, shop: schemas.ShopCreate, owner_id: int):
    db_shop = models.Shop(**shop.model_dump(), owner_id=owner_id)
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop

def update_shop(db: Session, shop_id: int, shop_update: schemas.ShopCreate):
    db_shop = get_shop(db, shop_id)
    if db_shop:
        for key, value in shop_update.model_dump().items():
            setattr(db_shop, key, value)
        db.commit()
        db.refresh(db_shop)
    return db_shop

def _utc_now_naive() -> datetime:
    """Match naive UTC datetimes stored on Product.expiry_date."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def get_products(db: Session, skip: int = 0, limit: int = 100, *, hide_expired: bool = True):
    q = (
        db.query(models.Product)
        .options(joinedload(models.Product.shop))
        .filter(models.Product.is_active.is_(True))
    )
    if hide_expired:
        q = q.filter(models.Product.expiry_date > _utc_now_naive())
    return q.offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate, shop_id: int):
    db_product = models.Product(**product.model_dump(), shop_id=shop_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product
