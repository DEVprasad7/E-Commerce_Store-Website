import { FiHeart } from "react-icons/fi";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import "./Nav.css";

const Nav = ({ handleInputChange, query, onFavClick }) => {
  const { openSignIn } = useClerk();

  return (
    <nav>
      <div className="nav-container">
        <input
          className="search-input"
          type="text"
          onChange={handleInputChange}
          value={query}
          placeholder="Enter your search."
        />
      </div>
      <div className="profile-container">
        <FiHeart className="nav-icons" onClick={onFavClick} />
        <AiOutlineShoppingCart className="nav-icons" />
        <SignedIn>
          <div className="user-button-container">
            <UserButton
              appearance={{
                elements: { userButtonAvatarBox: "user-button" },
              }}
            />
          </div>
        </SignedIn>
        <SignedOut>
          <AiOutlineUser
            className="nav-icons signin-icon"
            onClick={() => openSignIn()}
          />
        </SignedOut>
      </div>
    </nav>
  );
};

export default Nav;
