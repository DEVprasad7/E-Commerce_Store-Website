import Button from "../components/Button";
import "./Recommended.css";

const Recommended = ({ handleClick }) => {
  return (
    <>
      <div>
        <h2 className="recommended-title">Recommended</h2>
        <div className="recommended-flex">
          <Button onClickHandler={handleClick} value="" title="All Products" />
          <Button onClickHandler={handleClick} value="Laptops" title="Laptops" />
          <Button onClickHandler={handleClick} value="Mobiles" title="Mobiles" />
          <Button onClickHandler={handleClick} value="Headphones" title="Headphones" />
          <Button onClickHandler={handleClick} value="Others" title="Others" />
        </div>
      </div>
    </>
  );
};

export default Recommended;
