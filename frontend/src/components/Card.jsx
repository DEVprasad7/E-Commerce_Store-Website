import { IoMdHeartEmpty } from "react-icons/io";
import Button from "./Button";
import toast from "react-hot-toast";

const Card = ({ img, title, star, reviews, prevPrice, newPrice }) => {
  const addToCart = () => {
    toast.success("Product added to cart!", {
      duration: 2000,
    });
  };

  return (
    <>
      <section className="card">
        <img src={img} alt={title} className="card-img" />
        <div className="card-details">
          <h3 className="card-title">{title}</h3>
          <section className="card-reviews">
            {star} {star} {star} {star}
            <span className="total-reviews">{reviews}</span>
          </section>
          <section className="card-price">
            <div className="price">
              <del>{prevPrice}</del> {newPrice}
            </div>
            <div className="bag">
              <IoMdHeartEmpty className="bag-icon" />
            </div>
            <div className="add-to-cart">
              <Button
                className="cart-btn"
                onClickHandler={addToCart}
                value="Add to Cart"
                title="🛒 Add to Cart"
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default Card;
