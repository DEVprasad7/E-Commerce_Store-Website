import { IoMdHeartEmpty } from "react-icons/io";
import "./Fav.css";

const Favourites = ({ favourites = [] }) => {
  return (
    <div className="favourites-container">
      {favourites.length === 0 ? (
        <div className="no-favourites">
          <IoMdHeartEmpty className="heart-icon" />
          <h2>Nothing to show</h2>
          <p>Start adding products you love to your favourites!</p>
        </div>
      ) : (
        <div className="favourites-flex">
          {favourites.map((product) => (
            <div key={product.id} className="favourite-card">
              <img src={product.img} alt={product.title} />
              <div className="favourite-details">
                <h3>{product.title}</h3>
                <p className="price">{product.newPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
