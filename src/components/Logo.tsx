const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-fade-in"
      >
        <path
          d="M8 24L16 8L24 24L32 8L40 24"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 28L18 14L26 28L34 14L42 28"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 32L20 20L28 32L36 20L44 32"
          stroke="url(#gradient3)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="gradient1" x1="8" y1="8" x2="40" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(210, 90%, 50%)" />
            <stop offset="1" stopColor="hsl(180, 95%, 50%)" />
          </linearGradient>
          <linearGradient id="gradient2" x1="10" y1="14" x2="42" y2="28" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(190, 85%, 45%)" />
            <stop offset="1" stopColor="hsl(200, 90%, 55%)" />
          </linearGradient>
          <linearGradient id="gradient3" x1="12" y1="20" x2="44" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(320, 85%, 60%)" />
            <stop offset="1" stopColor="hsl(280, 90%, 65%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">AORTIC CODE</h1>
        <p className="text-sm text-muted-foreground">Calculadora de Pròtesis EVAR</p>
      </div>
    </div>
  );
};

export default Logo;
