interface TextHomeProps {
  text: string;
}

const TextHome: React.FC<TextHomeProps> = ({ text }) => {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
};
export default TextHome;
