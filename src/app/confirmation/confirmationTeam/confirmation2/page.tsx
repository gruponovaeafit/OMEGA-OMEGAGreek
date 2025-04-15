import { TextConfirmation } from "@/app/components/forms/confirmation/individual/text";

const Confimation3 = () => {
    return (
        <div className="background_email">
            <div className="flex justify-center items-center h-screen">
                <div className="w-40 h-40 bg-blue-500 flex justify-center items-center">
                    <TextConfirmation
                        text="Hola"
                    />
                </div>
            </div>
        </div>
    );
};

export default Confimation3;