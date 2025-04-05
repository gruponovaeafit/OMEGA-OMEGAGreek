interface TextConfirmationProps {
    text: string;
}


export const TextConfirmation: React.FC<TextConfirmationProps> = ({ text }) => {
    return (
        <div>
            <h1 className="text-4xl font-bold">{text}</h1> 
        </div>
    );
}

export const TextButton: React.FC<TextConfirmationProps> = ({ text }) => {
    return (
        <div>
            <h1>{text}</h1> 
        </div>
    );
}

