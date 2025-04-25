import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";

export default function Send() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 background_email relative">
      <Header />

      <div className="absolute top-20 flex flex-col items-center">
        <img src="/Onsite_send.svg" alt="" />
      </div>
      <div className="mt-52">
        <img src="/APOLO_2.svg" alt="Apolo confirmación" className="w-60" />
      </div>

      <Footer />
    </div>
  );
}
