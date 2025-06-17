import { AiOutlineShoppingCart } from "react-icons/ai";
import "./Order.css";

const Orders = ({ orders = [] }) => {
  return (
    <div className="orders-container">
      {orders.length === 0 ? (
        <div className="no-orders">
          <AiOutlineShoppingCart className="cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Start adding products to your cart and they will show up here!</p>
          <button
            className="start-shopping-btn"
            onClick={() => (window.location.href = "/")}
          >
            Explore
          </button>
        </div>
      ) : (
        <div className="orders-flex">
          {orders.map((product, index) => (
            <div key={index} className="order-card">
              <img src={product.img} alt={product.title} />
              <div className="order-details">
                <h3>{product.title}</h3>
                <div className="order-price">
                  <p className="price">{product.newPrice}</p>
                  <p className="quantity">Quantity: {product.quantity || 1}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
