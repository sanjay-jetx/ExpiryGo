from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    original_price: float
    discount_price: float
    quantity: int
    expiry_date: datetime
    front_image_url: str
    expiry_image_url: str
    voice_note_url: Optional[str] = None
    is_active: bool = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    shop_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ShopSummary(BaseModel):
    """Subset of shop fields for product cards and listings."""

    id: int
    name: str
    address: str
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)


class ProductWithShop(Product):
    """Product as returned from list endpoints, including shop context."""

    shop: ShopSummary | None = None

    model_config = ConfigDict(from_attributes=True)


class ShopBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    description: str

class ShopCreate(ShopBase):
    pass

class Shop(ShopBase):
    id: int
    owner_id: int
    products: List[Product] = []

    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: str
    name: str
    is_shop_owner: bool = False

class UserCreate(UserBase):
    firebase_uid: str

class User(UserBase):
    id: int
    firebase_uid: str
    shop: Optional[Shop] = None

    model_config = ConfigDict(from_attributes=True)
