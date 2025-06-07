from config import db
import uuid

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_session_id = db.Column(db.String(36), nullable=False, default=lambda: str(uuid.uuid4()))  # Removed unique=True
    item_type = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(200), nullable=False)
    item_company = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    total_item_price = db.Column(db.Float, nullable=False, default=0.0)
    total_cart_price = db.Column(db.Float, nullable=False, default=0.0)

    def calculate_total_item_price(self):
        self.total_item_price = float(self.quantity * self.price)
        return self.total_item_price

    @staticmethod
    def update_cart_total(cart_session_id):
        cart_items = Cart.query.filter_by(cart_session_id=cart_session_id).all()
        total = sum(item.total_item_price for item in cart_items)
        for cart_item in cart_items:
            cart_item.total_cart_price = total
        db.session.commit()

    def to_json(self):
        return {
            "id": self.id,
            "cartSessionId": self.cart_session_id,
            "itemType": self.item_type,
            "itemName": self.item_name,
            "itemCompany": self.item_company,
            "quantity": self.quantity,
            "price": self.price,
            "totalItemPrice": self.total_item_price,
            "totalCartPrice": self.total_cart_price,
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_session_id = db.Column(db.String(36), db.ForeignKey('cart.cart_session_id'), nullable=False)
    cart = db.relationship('Cart', backref=db.backref('orders', lazy=True), foreign_keys=[cart_session_id])
    order_date = db.Column(db.DateTime, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "cartSessionId": self.cart_session_id,
            "orderDate": self.order_date.isoformat(),
            "totalAmount": self.total_amount,
        }