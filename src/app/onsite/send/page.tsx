import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";


export default function Send() {
  return(
    <div className="background_email flex flex-col items-center justify-center gap-6 px-4 min-h-screen">
      <Header />
        <img src="/Onsite_send.svg" alt="" />
        <img src="/APOLO_2.svg" alt="" />
        
      <Footer />
    </div>
  )
}