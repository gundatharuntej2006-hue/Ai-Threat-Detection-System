export function RadarSweep() {
  return (
    <div className="relative w-48 h-48">
      <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30"></div>
      <div className="absolute inset-4 rounded-full border border-cyan-500/20"></div>
      <div className="absolute inset-8 rounded-full border border-cyan-500/20"></div>
      <div className="absolute inset-12 rounded-full border border-cyan-500/20"></div>

      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 animate-[spin_4s_linear_infinite] origin-center">
          <div
            className="absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-400/0 via-cyan-400/50 to-cyan-400"
            style={{ transform: 'translate(-50%, -50%) rotate(0deg)', transformOrigin: '0% 50%' }}
          ></div>
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full animate-pulse"></div>

      <div className="absolute top-1/4 left-2/3 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
      <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  );
}
