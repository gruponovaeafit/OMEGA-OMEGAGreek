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

// Componente para participantes múltiples
export const ParticipantEmailField: React.FC<{
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  index: number;
  error?: string;
  required?: boolean;
  optional?: boolean;
}> = ({
  label,
  value,
  onChange,
  index,
  error,
  required = false,
  optional = false
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>} {optional && <span className="text-gray-400">(opcional)</span>}
      </label>
      <input
        type="email"
        name={`participant-${index}`}
        value={value}
        onChange={onChange}
        placeholder="correo@institucion.edu.co"
        required={required}
        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-blue-500 text-white"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export const TextAreaField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}> = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
  rows = 4
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-700 text-white"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default {
  InputField,
  SelectField,
  ParticipantEmailField,
  TextAreaField
};