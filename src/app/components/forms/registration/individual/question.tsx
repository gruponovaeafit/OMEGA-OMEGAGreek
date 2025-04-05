import React from 'react';

interface QuestionProps {
  question: string;
  className?: string;
}

// Componente base para preguntas
export const Question: React.FC<QuestionProps & { children: React.ReactNode }> = ({
  question,
  children,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h3 className="text-white font-medium mb-3">{question}</h3>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
};

// Pregunta de tipo Sí/No
export const YesNoQuestion: React.FC<QuestionProps & {
  value: boolean | null;
  onChange: (value: boolean) => void;
}> = ({
  question,
  value,
  onChange,
  className = ''
}) => {
  return (
    <Question question={question} className={className}>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`w-12 h-12 rounded-full font-medium transition-colors
            ${value === true 
              ? 'bg-pink-500 text-white' 
              : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`w-12 h-12 rounded-full font-medium transition-colors
            ${value === false 
              ? 'bg-pink-500 text-white' 
              : 'bg-gray-700 text-white hover:bg-gray-600'}`}
        >
          No
        </button>
      </div>
    </Question>
  );
};

// Pregunta de selección múltiple
export const MultipleChoiceQuestion: React.FC<QuestionProps & {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}> = ({
  question,
  options,
  value,
  onChange,
  className = ''
}) => {
  return (
    <Question question={question} className={className}>
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`p-2 rounded-md text-center text-sm
              ${value === option ? 'bg-pink-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </Question>
  );
};

// Pregunta de texto libre
export const TextQuestion: React.FC<QuestionProps & {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({
  question,
  value,
  onChange,
  placeholder = '',
  className = ''
}) => {
  return (
    <Question question={question} className={className}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
    </Question>
  );
};

export default {
  Question,
  YesNoQuestion,
  MultipleChoiceQuestion,
  TextQuestion
};