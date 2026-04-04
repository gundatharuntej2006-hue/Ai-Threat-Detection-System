import { ThreatResponse } from '../../api/threatApi';

interface ThreatLevelDisplayProps {
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  result: ThreatResponse | null;
}

export function ThreatLevelDisplay({ level, result }: ThreatLevelDisplayProps) {
  const cfg = {
    LOW:    { border: 'border-green-500',  glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',   text: 'text-green-400',  bg: 'bg-green-500/10',  label: 'ALL CLEAR', icon: '✓' },
    MEDIUM: { border: 'border-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',   text: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'MONITOR',   icon: '◈' },
    HIGH:   { border: 'border-red-500 animate-pulse', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse', text: 'text-red-400 animate-pulse', bg: 'bg-red-500/20', label: 'ALERT', icon: '⚠' },
  }[level];

  return (
    <div className={`relative border-4 ${cfg.border} ${cfg.glow} ${cfg.bg} rounded-lg p-8 w-full`}>
      {level === 'HIGH' && (
        <div className="absolute -top-4 -right-4 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg animate-pulse">
          <span className="text-xl">🚨</span>
          <span className="font-bold text-white font-mono text-sm">ALERT</span>
        </div>
      )}
      <div className="text-center">
        <div className="text-xs tracking-widest text-gray-400 mb-2 font-mono">THREAT LEVEL</div>
        <div className={`text-6xl font-bold tracking-wider ${cfg.text} font-mono`}>{level}</div>
        <div className={`text-sm mt-2 font-mono tracking-widest ${cfg.text} opacity-70`}>{cfg.label}</div>

        {/* Confidence bar */}
        {result && (
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-1 font-mono">CONFIDENCE: {result.confidence.toFixed(1)}%</div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${level === 'HIGH' ? 'bg-red-500' : level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        )}

        {/* Level indicators */}
        <div className="mt-4 flex justify-center gap-2">
          <div className={`w-16 h-2 rounded-full ${level === 'LOW' ? 'bg-green-500' : 'bg-gray-700'}`} />
          <div className={`w-16 h-2 rounded-full ${level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-gray-700'}`} />
          <div className={`w-16 h-2 rounded-full ${level === 'HIGH' ? 'bg-red-500 animate-pulse' : 'bg-gray-700'}`} />
        </div>
      </div>
    </div>
  );
}
