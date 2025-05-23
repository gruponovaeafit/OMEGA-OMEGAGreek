import React, { useState, useRef, useEffect } from "react";

// Props base para cualquier pregunta
interface QuestionProps {
  question: string;
  className?: string;
}

interface DateNativeQuestionProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Componente base para preguntas
export const Question: React.FC<
  QuestionProps & { children: React.ReactNode }
> = ({ question, children, className = "" }) => {
  return (
    <div
      className={`mb-6 flex flex-col gap-1 w-full max-w-xs items-center ${className}`}
    >
      <h3 className="text-white font-bold text-base text-center">{question}</h3>
      <div className="w-full">{children}</div>
    </div>
  );
};

// Pregunta Sí/No
export const YesNoQuestion: React.FC<
  QuestionProps & {
    value: boolean | null;
    name: string;
    onChange: (value: boolean) => void;
  }
> = ({ question, value, name, onChange, className = "" }) => {
  return (
    <Question question={question} className={className}>
      <div className="flex justify-center space-x-6">
        <button
          type="button"
          name={name}
          onClick={() => onChange(true)}
          className={`w-20 h-10 rounded-full font-semibold transition-colors text-white
            ${
              value === true
                ? "bg-pink-600"
                : "bg-white/20 border border-white hover:bg-white/30"
            }`}
        >
          Sí
        </button>
        <button
          type="button"
          name={name}
          onClick={() => onChange(false)}
          className={`w-20 h-10 rounded-full font-semibold transition-colors text-white
            ${
              value === false
                ? "bg-pink-600"
                : "bg-white/20 border border-white hover:bg-white/30"
            }`}
        >
          No
        </button>
      </div>
    </Question>
  );
};

// Selección múltiple tipo grid
export const MultipleChoiceQuestion: React.FC<
  QuestionProps & {
    options: string[];
    value: string;
    onChange: (value: string) => void;
  }
> = ({ question, options, value, onChange, className = "" }) => {
  return (
    <Question question={question} className={className}>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`p-3 rounded-xl font-medium text-white text-center text-sm transition-all
              ${
                value === option
                  ? "bg-pink-600"
                  : "bg-white/20 border border-white hover:bg-white/30"
              }`}
            onClick={() => onChange(option)}
            style={{
              backgroundImage:
                value === option
                  ? undefined
                  : "linear-gradient(to right, #3B2F8C 0%, #9A2C2C 48%, #84A23C 100%)",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </Question>
  );
};

// Campo de texto
export const TextQuestion: React.FC<
  QuestionProps & {
    value: string;
    name: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
  }
> = ({ question, value, name, onChange, placeholder = "", className = "" }) => {
  return (
    <Question question={question} className={className}>
      <input
        type="{type}"
        value={value ?? ""}
        name={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 px-4 text-center text-base font-light text-white rounded-xl placeholder-white placeholder-opacity-25 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3B2F8C 0%, #9A2C2C 48%, #84A23C 100%)",
        }}
      />
    </Question>
  );
};

// Campo de fecha
export const DateNativeQuestion: React.FC<DateNativeQuestionProps> = ({
  question,
  value,
  onChange,
  className = "",
}) => {
  return (
    <Question question={question} className={className}>
      <div className="relative w-full">
        <input
          type="date"
          value={value}
          name="birth_date"
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 text-center text-base font-light text-white rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 appearance-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #3B2F8C, #9A2C2C, #84A23C)",
          }}
        />
        <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white opacity-70">
          📅
        </div>
      </div>
    </Question>
  );
};

// Custom Select dropdown que se comporta visualmente como un input
export const Select: React.FC<{
  value: string;
  name: string;
  onChange: (value: string) => void;
  options: string[];
}> = ({ value, onChange, options, name }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="w-full h-12 px-4 text-base font-light text-white rounded-xl flex items-center justify-center cursor-pointer"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3B2F8C 0%, #9A2C2C 48%, #84A23C 100%)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        onClick={() => setOpen(!open)}
      >
        <input
          className="w-full text-center truncate bg-transparent border-none outline-none"
          value={value}
          name={name}
          type="text"
          readOnly
          onChange={() => {}}
        />
      </div>

      {open && (
        <div className="absolute top-full mt-1 w-full bg-white/30 backdrop-blur-md rounded-xl shadow-lg z-10">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="px-4 py-2 text-white hover:bg-white/40 cursor-pointer text-sm text-center"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Checkbox
export const Checkbox: React.FC<{
  checked: boolean;
  name: string;
  onChange: (checked: boolean) => void;
  label: React.ReactNode; // 👈 cambio aquí
}> = ({ checked, name, onChange, label }) => {
  return (
    <div className="w-full flex justify-center mt-4">
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => onChange(!checked)}
          className="w-5 h-5 rounded-sm border-2 border-white flex items-center justify-center"
          style={{
            backgroundImage: checked
              ? "linear-gradient(to bottom, #4102F9, #FF1D1D)"
              : "transparent",
          }}
        >
          {checked && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
        </div>

        <span
          className="text-white px-3 py-1 text-sm font-light rounded-md"
          style={{
            backgroundImage:
              "linear-gradient(to right, #3B2F8C, #9A2C2C, #84A23C)",
          }}
        >
          <span className="font-semibold">{label}</span>
        </span>
      </label>
    </div>
  );
};
