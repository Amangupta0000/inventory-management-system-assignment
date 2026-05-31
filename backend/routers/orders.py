from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas.order import OrderCreate, OrderOut
import crud.order as order_crud

router = APIRouter(prefix="/api/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderOut])
def list_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return order_crud.get_orders(db, skip, limit)


@router.post("/", response_model=OrderOut, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    return order_crud.create_order(db, order)


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return order_crud.get_order(db, order_id)


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    return order_crud.delete_order(db, order_id)
