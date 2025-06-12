const Button = ({ onClickHandler, value, title, className = "" }) => {
  return (
    <button
      onClick={onClickHandler}
      value={value}
      className={`btns ${className}`}
    >
      {title}
    </button>
  );
};

export default Button;
