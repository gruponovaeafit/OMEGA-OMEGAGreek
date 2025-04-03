import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  isPrimary?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  color?: 'red' | 'pink' | 'purple' | 'default';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  isPrimary = true, 
  type = 'button',
  disabled = false,
  className = '',
  color = 'default'
}) => {
  
  const getColorClasses = () => {
    if (!isPrimary) return 'bg-gray-700 hover:bg-gray-600 text-white';
    
    switch(color) {
      case 'red':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'pink':
        return 'bg-pink-500 hover:bg-pink-600 text-white';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      default:
        return 'bg-pink-500 hover:bg-pink-600 text-white';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors
        ${getColorClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
    >
      {text}
    </button>
  );
};

export const ButtonGroup: React.FC<{
  options: { text: string; value: string }[];
  selectedValue?: string;
  onChange: (value: string) => void;
  color?: 'red' | 'pink' | 'purple' | 'default';
}> = ({ options, selectedValue, onChange, color = 'default' }) => {
  
  const getButtonColorClasses = (isSelected: boolean) => {
    if (!isSelected) return 'bg-gray-700 text-white';
    
    switch(color) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'pink':
        return 'bg-pink-500 text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-pink-500 text-white';
    }
  };
  
  return (
    <div className="flex space-x-4 justify-center my-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-8 py-3 rounded-md text-sm font-medium transition-colors
            ${getButtonColorClasses(selectedValue === option.value)}`}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

export default Button;