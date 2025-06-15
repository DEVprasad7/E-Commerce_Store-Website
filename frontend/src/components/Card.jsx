import { useState, useEffect } from "react";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Button from "./Button";
import toast from "react-hot-toast";

const Card = ({ img, title, star, reviews, prevPrice, newPrice }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setIsFavorite(!!favorites[title]);

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItem = cart.find((item) => item.title === title);
    setIsInCart(!!cartItem);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
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
        icon: "😍",
        duration: 2000,
        style: {
          borderRadius: "20px",
        },
      });
    } else {
      toast("Removed from favourites!", {
        icon: "🥺",
        duration: 2000,
        style: {
          borderRadius: "20px",
        },
      });
    }
  };

  const updateCart = (newQuantity) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = cart.findIndex((item) => item.title === title);

    // Remove item if quantity is 0
    if (newQuantity === 0) {
      if (itemIndex >= 0) {
        cart.splice(itemIndex, 1);
        setIsInCart(false);
        setQuantity(1); // Reset quantity
        toast.success("Removed from cart!");
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      return;
    }

    // Update or add item
    if (itemIndex >= 0) {
      cart[itemIndex].quantity = newQuantity;
    } else {
      cart.push({
        img,
        title,
        star,
        reviews,
        prevPrice,
        newPrice,
        quantity: newQuantity,
      });
      setIsInCart(true);
      toast.success("Added to cart!");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setQuantity(newQuantity);
  };

  const addToCart = () => updateCart(1);
  const removeFromCart = () => updateCart(0);
  const incrementQuantity = () => updateCart(quantity + 1);
  const decrementQuantity = () => updateCart(Math.max(1, quantity - 1));

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
            {isInCart ? (
              <div className="quantity-controls">
                <Button
                  className="quantity-btn"
                  onClickHandler={decrementQuantity}
                  title={<AiOutlineMinus />}
                />
                <span className="quantity-display">{quantity}</span>
                <Button
                  className="quantity-btn"
                  onClickHandler={incrementQuantity}
                  title={<AiOutlinePlus />}
                />
                <Button
                  className="remove-btn"
                  onClickHandler={removeFromCart}
                  title="Remove"
                />
              </div>
            ) : (
              <Button
                className="cart-btn"
                onClickHandler={addToCart}
                title="🛒 Add to Cart"
              />
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Card;
