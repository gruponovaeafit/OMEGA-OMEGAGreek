export const Header = () => {
  return (
    <header className="relative w-full flex justify-center items-center">
      <img
        src="https://novaeafit2.blob.core.windows.net/omega-2025/LOGO-OMEGA.svg"
        alt="Logo Omega"
        width={100}
        height={100}
        className="object-contain z-10 relative top-2" // Baja el logo 2 píxeles
      />
    </header>
  );
};
