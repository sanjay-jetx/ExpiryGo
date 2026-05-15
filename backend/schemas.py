"""
Pydantic schemas for request/response validation — no Firebase references.
"""

from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


# =========================
# AUTH
# =========================

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    is_shop_owner: bool = False


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# =========================
# PRODUCTS
# =========================

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
    id: str
    shop_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ShopSummary(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float

    model_config = ConfigDict(from_attributes=True)


class ProductWithShop(Product):
    shop: Optional[ShopSummary] = None
    model_config = ConfigDict(from_attributes=True)


# =========================
# SHOPS
# =========================

class ShopBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    description: Optional[str] = None


class ShopCreate(ShopBase):
    pass


class Shop(ShopBase):
    id: str
    owner_uid: str
    products: List[Product] = []

    model_config = ConfigDict(from_attributes=True)


# =========================
# USERS
# =========================

class UserBase(BaseModel):
    email: str
    name: str
    is_shop_owner: bool = False


class User(UserBase):
    id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
