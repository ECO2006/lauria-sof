export default function Header({ photoCount }: { photoCount: number }) {
  return (
    <header className="relative flex h-[46vh] min-h-[320px] w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/sfondo.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-950" />

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-7xl">
          Laurea Sofia
        </h1>
        <p className="mt-3 text-lg font-medium text-blue-100 sm:text-xl">
          12 Ottobre 2026
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-400" />
          <span>
            <strong>{photoCount}</strong> {photoCount === 1 ? "foto caricata" : "foto caricate"}
          </span>
        </div>
      </div>
    </header>
  );
}
