from flask import request, jsonify
from config import app, db
from models import Cart, Order
from datetime import datetime

# Global error handler
@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({"message": str(error)}), 500

@app.route("/cart", methods=["GET"])
def get_cart_items():
    try:
        items = Cart.query.all()
        json_items = list(map(lambda x: x.to_json(), items))
        return jsonify({"items": json_items})
    except Exception as e:
        return jsonify({"message": f"Error fetching cart items: {str(e)}"}), 500

@app.route("/add_to_cart", methods=["POST"])
def add_to_cart():
    try:
        item_type = request.json.get("item_type")
        item_name = request.json.get("item_name")
        item_company = request.json.get("item_company")
        quantity = request.json.get("quantity")
        price = request.json.get("price")

        # Input validation
        if not all([item_type, item_name, item_company, quantity, price]):
            return jsonify({"message": "All fields are required"}), 400
        
        if not isinstance(quantity, int) or quantity <= 0:
            return jsonify({"message": "Invalid quantity"}), 400
        
        if not isinstance(price, (int, float)) or price <= 0:
            return jsonify({"message": "Invalid price"}), 400

        new_item = Cart(
            item_type=item_type,
            item_name=item_name,
            item_company=item_company,
            quantity=quantity,
            price=price
        )
        new_item.calculate_total_item_price()
        db.session.add(new_item)
        db.session.commit()
        
        Cart.update_cart_total()
        return jsonify({"message": "Items added to cart!", "item": new_item.to_json()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding to cart: {str(e)}"}), 400

@app.route("/update_cart/<int:item_id>", methods=["PATCH"])
def update_cart(item_id):
    try:
        item = Cart.query.get(item_id)
        if not item:
            return jsonify({"message": "Item not found"}), 404

        data = request.json
        item.quantity = data.get("quantity", item.quantity)

        if not isinstance(item.quantity, int) or item.quantity <= 0:
            return jsonify({"message": "Invalid quantity"}), 400
            
        item.calculate_total_item_price()
        db.session.commit()
        
        Cart.update_cart_total()
        return jsonify({"message": "Cart updated", "item": item.to_json()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating cart: {str(e)}"}), 400

@app.route("/remove_from_cart/<int:item_id>", methods=["DELETE"])
def remove_from_cart(item_id):
    try:
        item = Cart.query.get(item_id)
        if not item:
            return jsonify({"message": "Item not found"}), 404

        db.session.delete(item)
        db.session.commit()
        
        Cart.update_cart_total()
        return jsonify({"message": "Item removed from cart"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error removing from cart: {str(e)}"}), 400

@app.route("/orders", methods=["GET"])
def get_all_orders():
    try:
        orders = Order.query.all()
        return jsonify({"orders": [order.to_json() for order in orders]})
    except Exception as e:
        return jsonify({"message": f"Error fetching orders: {str(e)}"}), 500

@app.route("/get_order/<int:order_id>", methods=["GET"])
def get_order(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({"message": "Order not found"}), 404
        return jsonify({"order": order.to_json()})
    except Exception as e:
        return jsonify({"message": f"Error fetching order: {str(e)}"}), 500

@app.route("/create_order", methods=["POST"])
def create_order():
    try:
        cart_id = request.json.get("cart_id")
        total_amount = request.json.get("total_amount")

        if not cart_id or not total_amount:
            return jsonify({"message": "Cart ID and total amount are required"}), 400

        # Verify cart exists
        cart = Cart.query.get(cart_id)
        if not cart:
            return jsonify({"message": "Cart not found"}), 404

        if not isinstance(total_amount, (int, float)) or total_amount <= 0:
            return jsonify({"message": "Invalid total amount"}), 400

        new_order = Order(
            cart_id=cart_id,
            order_date=datetime.now(),
            total_amount=total_amount
        )
        db.session.add(new_order)
        db.session.commit()
        
        return jsonify({
            "message": "Order successful!",
            "order": new_order.to_json()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating order: {str(e)}"}), 400

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)