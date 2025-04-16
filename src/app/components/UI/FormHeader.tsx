interface FormHeaderProps {
  title: string;
}

export default function FormHeader({ title }: FormHeaderProps) {
  return (
    <div className="relative border rounded-2xl px-6 py-1 w-[90%] ml-auto">
      <img
        src="/color-rullette.svg"
        alt=""
        className="absolute left-[-42px] top-1/2 -translate-y-1/2 opacity-90 object-contain pointer-events-none"
      />
      <h1 className="text-xl font-bold relative z-10 text-center text-2xl">{title}</h1>
    </div>
  );
}
