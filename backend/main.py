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
        cart_session_id = request.json.get("cart_session_id")

        if not all([item_type, item_name, item_company, quantity, price]):
            return jsonify({"message": "All fields are required"}), 400

        new_item = Cart(
            cart_session_id=cart_session_id,
            item_type=item_type,
            item_name=item_name,
            item_company=item_company,
            quantity=quantity,
            price=price
        )
        new_item.calculate_total_item_price()
        db.session.add(new_item)
        db.session.commit()
        
        Cart.update_cart_total(new_item.cart_session_id)
        return jsonify({
            "message": "Items added to cart!", 
            "item": new_item.to_json(),
            "cartSessionId": new_item.cart_session_id
        }), 201

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
        
        Cart.update_cart_total(item.cart_session_id)
        return jsonify({
            "message": "Cart updated", 
            "item": item.to_json()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error updating cart: {str(e)}"}), 400

@app.route("/remove_from_cart/<int:item_id>", methods=["DELETE"])
def remove_from_cart(item_id):
    try:
        item = Cart.query.get(item_id)
        if not item:
            return jsonify({"message": "Item not found"}), 404

        # Store the cart_session_id before deleting the item
        cart_session_id = item.cart_session_id
        
        db.session.delete(item)
        db.session.commit()
        
        # Update cart total for remaining items in the same cart session
        remaining_items = Cart.query.filter_by(cart_session_id=cart_session_id).all()
        if remaining_items:
            Cart.update_cart_total(cart_session_id)
        
        return jsonify({
            "message": "Item removed from cart",
            "cartSessionId": cart_session_id
        }), 200

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
        cart_session_id = request.json.get("cart_session_id")

        if not cart_session_id:
            return jsonify({"message": "Cart session ID is required"}), 400

        cart_items = Cart.query.filter_by(cart_session_id=cart_session_id).all()
        if not cart_items:
            return jsonify({"message": "Cart not found"}), 404

        total_amount = cart_items[0].total_cart_price

        new_order = Order(
            cart_session_id=cart_session_id,
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