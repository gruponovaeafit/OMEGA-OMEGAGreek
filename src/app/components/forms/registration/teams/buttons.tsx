import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  isPrimary?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  color?: "pink" | "purple" | "blue" | "default";
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  isPrimary = true,
  type = "button",
  disabled = false,
  className = "",
  color = "default",
}) => {
  const getColorClasses = () => {
    if (!isPrimary) return "bg-gray-700 hover:bg-gray-600 text-white";

    switch (color) {
      case "pink":
        return "bg-pink-500 hover:bg-pink-600 text-white";
      case "purple":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      case "blue":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-pink-500 hover:bg-pink-600 text-white";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
        ${getColorClasses()}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      {text}
    </button>
  );
};

export const RegistrationOptionButton: React.FC<{
  text: string;
  imageDescription: string;
  onClick: () => void;
  isPrimary?: boolean;
  className?: string;
}> = ({
  text,
  imageDescription,
  onClick,
  isPrimary = true,
  className = "",
}) => {
  return (
    <div
      className={`w-full p-4 cursor-pointer mb-6 ${className}`}
      onClick={onClick}
    >
      <div
        className={`p-6 ${isPrimary ? "bg-pink-500" : "bg-purple-600"} text-white text-center rounded-md`}
      >
        <div className="h-32 flex items-center justify-center mb-4 bg-pink-400 rounded-md">
          <span className="text-sm">{imageDescription}</span>
        </div>
        <p className="text-lg font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Button;
