
const Button = ({ text, onClick }) => {
    return (
      <button
        type="button"
        style={{
          margin: 10px,
        }}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };
  
  export default Button;
  