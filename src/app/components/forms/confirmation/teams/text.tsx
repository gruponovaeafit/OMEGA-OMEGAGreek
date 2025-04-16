interface TextConfirmationProps {
  text: string;
}

const TextConfirmation: React.FC<TextConfirmationProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <h1 className="text-2xl font-bold text-gray-900">{text}</h1>
    </div>
  );
};
export default TextConfirmation;
