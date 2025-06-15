import { useState, useEffect } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import Button from "./Button";
import toast from "react-hot-toast";

const Card = ({ img, title, star, reviews, prevPrice, newPrice }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setIsFavorite(!!favorites[title]);
  }, [title]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    const newFavorites = {
      ...favorites,
      [title]: !isFavorite
        ? { img, title, star, reviews, prevPrice, newPrice }
        : undefined,
    };

    // Remove undefined values (removed favorites)
    if (!newFavorites[title]) {
      delete newFavorites[title];
    }

    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);

   if (!isFavorite) {
      toast("Added to favourites!", {
        icon:'😍',
        duration: 2000,
      });
    } else {
      toast("Removed from favourites!", {
        icon:'🥺',
        duration: 2000,
      });
    }
  };

  const addToCart = () => {
    toast.success("Product added to cart!", {
      duration: 2000,
    });
  };

  return (
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
            {isFavorite ? (
              <IoMdHeart
                className="bag-icon favorite"
                onClick={toggleFavorite}
              />
            ) : (
              <IoMdHeartEmpty className="bag-icon" onClick={toggleFavorite} />
            )}
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
  );
};

export default Card;
