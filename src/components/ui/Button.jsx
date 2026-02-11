const Button = ({ text, type = "button" }) => {
  return (
    <button
      type={type}
      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition" >
      {text}
    </button>
  );
};

export default Button;
