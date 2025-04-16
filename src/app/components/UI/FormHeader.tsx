interface FormHeaderProps {
  title: string;
  note?: string;
}

export default function FormHeader({ title, note }: FormHeaderProps) {
  return (
    <>
      <div className="relative border rounded-2xl mt-5 px-6 py-1 w-[90%] ml-auto">
        <img
          src="/color-rullette.svg"
          alt=""
          className="absolute left-[-42px] top-1/2 -translate-y-1/2 opacity-90 object-contain pointer-events-none"
        />
        <h1 className="text-xl font-bold relative z-10 text-center text-2xl">
          {title}
        </h1>
      </div>
      {note && (
        <span className="mt-5 text-xs text-gray-300 block text-center">
          {note}
        </span>
      )}
    </>
  );
}
