import { useState } from "react";
import Button from "../components/Button";
import "./Recommended.css";

const Recommended = ({ handleClick }) => {
  const [activeButton, setActiveButton] = useState("All Products");

  const handleButtonClick = (value, title) => {
    setActiveButton(title);
    handleClick({ target: { value } });
  };

  return (
    <>
      <div>
        <h2 className="recommended-title">Recommended</h2>
        <div className="recommended-flex">
          <Button
            onClickHandler={() => handleButtonClick("", "All Products")}
            value=""
            title="All Products"
            className={activeButton === "All Products" ? "active" : ""}
          />
          <Button
            onClickHandler={() => handleButtonClick("Laptops", "Laptops")}
            value="Laptops"
            title="Laptops"
            className={activeButton === "Laptops" ? "active" : ""}
          />
          <Button
            onClickHandler={() => handleButtonClick("Mobiles", "Mobiles")}
            value="Mobiles"
            title="Mobiles"
            className={activeButton === "Mobiles" ? "active" : ""}
          />
          <Button
            onClickHandler={() => handleButtonClick("Headphones", "Headphones")}
            value="Headphones"
            title="Headphones"
            className={activeButton === "Headphones" ? "active" : ""}
          />
          <Button
            onClickHandler={() => handleButtonClick("Others", "Others")}
            value="Others"
            title="Others"
            className={activeButton === "Others" ? "active" : ""}
          />
        </div>
      </div>
    </>
  );
};

export default Recommended;
