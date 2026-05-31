from pydantic import BaseModel, field_validator
from decimal import Decimal
from datetime import datetime
from typing import Optional
from schemas.product import ProductOut
from schemas.customer import CustomerOut


class OrderCreate(BaseModel):
    customer_id: int
    product_id: int
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be at least 1")
        return v


class OrderOut(BaseModel):
    id: int
    customer_id: int
    product_id: int
    quantity: int
    total_price: Decimal
    status: str
    created_at: datetime
    customer: Optional[CustomerOut] = None
    product: Optional[ProductOut] = None

    model_config = {"from_attributes": True}
