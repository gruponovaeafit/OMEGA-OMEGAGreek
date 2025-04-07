"use client";
import { ButtonConfirmationIndividual } from "../components/forms/confirmation/individual/buttons";
import { TextButton } from "../components/forms/confirmation/individual/text";

export default function Confirmation() {
  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-4">
      <ButtonConfirmationIndividual
        text={<TextButton text="Confirmación Individual" />}
        onClick={() =>
          (window.location.href =
            "/confirmation/confirmationIndividual/confirmation1")
        }
      />
      <ButtonConfirmationIndividual
        text={<TextButton text="Confirmación Grupal" />}
        onClick={() =>
          (window.location.href =
            "/confirmation/confirmationGroup/confirmation1")
        }
      />
    </div>
  );
}
