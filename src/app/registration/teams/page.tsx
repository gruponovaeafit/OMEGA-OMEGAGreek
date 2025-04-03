import { TextConfirmationTeamRegistration } from "@/app/components/forms/registration/teams/text"; 

export default function RegistrationTeam() {
    return (
        <div className="background_home min-h-screen flex flex-col items-center py-4">
            <TextConfirmationTeamRegistration text="Registro Colectivo" />
        </div>
    )
}