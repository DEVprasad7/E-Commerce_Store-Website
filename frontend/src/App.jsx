import { useState, useEffect } from "react";
import Favourites from "./Favourites/Fav";
import Navigation from "./Navigation/Nav";
import Products from "./Products/Products";
import products from "./db/data";
import Recommended from "./Recommended/Recommended";
import Sidebar from "./Sidebar/Sidebar";
import Card from "./components/Card";
import "./index.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFavourites, setShowFavourites] = useState(false);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setFavourites(Object.values(storedFavorites));
  }, [showFavourites]);

  // ----------- Input Filter -----------
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredItems = products.filter((product) =>
    product.title.toLowerCase().startsWith(query.toLowerCase())
  );

  // ----------- Radio Filtering -----------
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // ------------ Button Filtering -----------
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    // Filtering Input Items
    if (query) {
      filteredProducts = filteredItems;
    }

    // Applying selected filter
    if (selected) {
      filteredProducts = filteredProducts.filter(
        ({ category, color, company, newPrice, title }) =>
          category === selected ||
          color === selected ||
          company === selected ||
          newPrice === selected ||
          title === selected
      );
    }

    return filteredProducts.map(
      ({ img, title, star, reviews, prevPrice, newPrice }) => (
        <Card
          key={Math.random()}
          img={img}
          title={title}
          star={star}
          reviews={reviews}
          prevPrice={prevPrice}
          newPrice={newPrice}
        />
      )
    );
  }

  const result = filteredData(products, selectedCategory, query);

  const toggleFavourites = () => {
    setShowFavourites(!showFavourites);
  };

  return (
    <>
      {!showFavourites && <Sidebar handleChange={handleChange} />}
      <Navigation
        query={query}
        handleInputChange={handleInputChange}
        onFavClick={toggleFavourites}
      />
      {showFavourites ? (
        <Favourites favourites={favourites} />
      ) : (
        <>
          <Recommended handleClick={handleClick} />
          <Products result={result} />
        </>
      )}
    </>
  );
}

export default App;
