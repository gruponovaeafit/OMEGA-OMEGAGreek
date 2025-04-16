"use client";

import { IconName } from "@/app/types/IconName.type";
import Icon from "./Icon";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  isDisabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary";
  iconName?: IconName;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  isDisabled = false,
  className = "",
  variant = "primary",
  iconName = "chevron-right",
}) => {
  const getColorClasses = () => {
    switch (variant) {
      case "primary":
        return `bg-primary-button hover:brightness-110 active:brightness-95 focus:ring-2 
                focus:ring-offset-2 focus:ring-primary-button/50 text-white`;
      case "secondary":
        return `bg-secondary-button hover:brightness-110 active:brightness-95 focus:ring-2 
                focus:ring-offset-2 focus:ring-primary-button/50 text-white`;
      default:
        return `bg-primary-button hover:brightness-110 active:brightness-95 focus:ring-2 
                focus:ring-offset-2 focus:ring-primary-button/50 text-white`;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-base font-bold transition-all duration-200
        ${getColorClasses()}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      <Icon name={iconName} />
      {label}
    </button>
  );
};
