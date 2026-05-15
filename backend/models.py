"""
Pydantic models for MongoDB documents — no Firebase, no SQLAlchemy.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId


# Helper for MongoDB ObjectId
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")


class UserDoc(BaseModel):
    email: str
    name: str
    hashed_password: Optional[str] = None  # stored but never returned via API
    is_shop_owner: bool = False


class ShopDoc(BaseModel):
    owner_uid: str  # MongoDB user _id as string
    name: str
    address: str
    latitude: float
    longitude: float
    description: Optional[str] = None


class ProductDoc(BaseModel):
    shop_id: str  # Reference to Shop _id
    name: str
    original_price: float
    discount_price: float
    quantity: int
    expiry_date: datetime
    front_image_url: str
    expiry_image_url: str
    voice_note_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
