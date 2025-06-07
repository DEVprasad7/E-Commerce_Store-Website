from config import db

class Cart(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_type = db.Column(db.String(100), nullable=False)
    item_name = db.Column(db.String(200), nullable=False)
    item_company = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "itemType": self.item_type,
            "itemName": self.item_name,
            "itemCompany": self.item_company,
            "quantity": self.quantity,
            "price": self.price,
        }
    

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('cart.id'), nullable=False)
    cart = db.relationship('Cart', backref=db.backref('orders', lazy=True))
    order_date = db.Column(db.DateTime, nullable=False)
    total_amount = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "cartId": self.cart_id,
            "orderDate": self.order_date.isoformat(),
            "totalAmount": self.total_amount,
        }