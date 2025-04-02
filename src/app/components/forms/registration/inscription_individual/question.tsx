import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  color?: 'purple' | 'blue' | 'default';
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
  color = 'default'
}) => {
  const getColorClasses = () => {
    switch(color) {
      case 'purple':
        return 'bg-purple-600 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-white text-gray-800';
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${getColorClasses()}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  color?: 'amber' | 'blue' | 'default';
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  required = false,
  error,
  className = '',
  color = 'default'
}) => {
  const getColorClasses = () => {
    switch(color) {
      case 'amber':
        return 'bg-amber-600 text-white';
      case 'blue':
        return 'bg-blue-300 text-gray-800';
      default:
        return 'bg-white text-gray-800';
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${getColorClasses()}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface DateFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
  error?: string;
  className?: string;
}

export const DateField: React.FC<DateFieldProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  className = ''
}) => {
  const [showCalendar, setShowCalendar] = React.useState(false);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateSelect = (date: string) => {
    onChange(date);
    setShowCalendar(false);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={toggleCalendar}
          className="w-full px-3 py-2 bg-indigo-800 text-white border border-gray-700 rounded-md text-left"
        >
          {value || 'Calendario'}
        </button>
        
        {showCalendar && (
          <div className="absolute z-50 mt-1 w-full bg-gray-800 rounded-md shadow-lg p-2">
            {/* Simulación simple de calendario */}
            <div className="grid grid-cols-7 gap-1">
              {[...Array(31)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDateSelect(`${i + 1}/05/2023`)}
                  className="p-2 hover:bg-gray-700 rounded-md text-sm"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface CheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  required = false,
  error
}) => {
  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          onChange={onChange}
          required={required}
          className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
        />
        <label htmlFor={name} className="ml-2 block text-sm text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

interface RoleCardProps {
  id: string;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  color?: 'red' | 'pink' | 'default';
}

export const RoleCard: React.FC<RoleCardProps> = ({
  id,
  title,
  description,
  isSelected,
  onClick,
  color = 'default'
}) => {
  const getColorClasses = () => {
    switch(color) {
      case 'red':
        return 'bg-red-500';
      case 'pink':
        return 'bg-pink-500';
      default:
        return 'bg-pink-500';
    }
  };

  return (
    <div className="flex space-x-4 mb-4">
      <div 
        className={`w-16 h-16 ${getColorClasses()} flex items-center justify-center cursor-pointer`}
        onClick={onClick}
      >
        <span className="text-xs text-white">img rol</span>
      </div>
      
      <div 
        className={`flex-grow p-3 bg-gray-200 cursor-pointer ${
          isSelected ? `border-2 border-${color === 'red' ? 'red' : 'pink'}-500` : ''
        }`}
        onClick={onClick}
      >
        <h3 className="text-black font-medium">{title}</h3>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </div>
  );
};

export default {
  InputField,
  SelectField,
  DateField,
  Checkbox,
  RoleCard
};