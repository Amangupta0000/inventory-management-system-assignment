from sqlalchemy.orm import Session
from fastapi import HTTPException
from models.order import Order
from models.product import Product
from models.customer import Customer
from schemas.order import OrderCreate


def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).offset(skip).limit(limit).all()


def get_order(db: Session, order_id: int):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


def create_order(db: Session, order: OrderCreate):
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    # Validate product exists
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # BUSINESS RULE: Check sufficient stock
    if product.stock < order.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock. Available: {product.stock}, Requested: {order.quantity}"
        )

    # Calculate total price
    total_price = float(product.price) * order.quantity

    # Create order
    db_order = Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_price=total_price,
        status="pending"
    )
    db.add(db_order)

    # AUTO DECREMENT stock
    product.stock -= order.quantity

    db.commit()
    db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int):
    order = get_order(db, order_id)
    # Restore stock when order is cancelled
    from models.product import Product
    product = db.query(Product).filter(Product.id == order.product_id).first()
    if product:
        product.stock += order.quantity
    db.delete(order)
    db.commit()
    return {"message": "Order cancelled and stock restored"}
