import React from "react";

interface TextProps {
  title: string;
  subtitle?: string;
  isHighlighted?: boolean;
  className?: string;
  align?: "left" | "center" | "right";
  textColor?: string;
  bgColor?: string;
}

const Text: React.FC<TextProps> = ({
  title,
  subtitle,
  isHighlighted = false,
  className = "",
  align = "center",
  textColor = "text-white",
  bgColor = "",
}) => {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "right"
        ? "text-right"
        : "text-left";

  return (
    <div
      className={`p-4 ${alignClass} ${bgColor} ${className} ${isHighlighted ? "bg-gray-800 rounded-lg" : ""}`}
    >
      <h2 className={`text-xl font-semibold mb-2 ${textColor}`}>{title}</h2>
      {subtitle && (
        <p
          className={`text-sm ${isHighlighted ? "text-gray-300" : "text-gray-600"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export const InfoBox: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-gray-200 p-4 rounded-md mb-6 ${className}`}>
      {title && (
        <h2 className="text-black text-center font-medium mb-2">{title}</h2>
      )}
      <div className="text-gray-700 text-sm">{children}</div>
    </div>
  );
};

export const teamsuccessMessage: React.FC<{
  title?: string;
  className?: string;
}> = ({
  title = "¡Tu respuesta ha sido enviada con éxito!",
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-300 p-8 rounded-md flex items-center justify-center ${className}`}
    >
      <h2 className="text-black text-center font-medium text-xl">{title}</h2>
    </div>
  );
};

export default Text;
