import { useState, useEffect } from 'react';

interface TerminalLogProps {
  threatLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  lastPrediction?: { threat: string; confidence: number } | null;
}

const BASE_MESSAGES = [
  '> Initializing surveillance protocols...',
  '> Scanning sector ALPHA-7... CLEAR',
  '> Sensor array: ONLINE',
  '> Cross-referencing threat database...',
  '> Biometric scan: AUTHORIZED',
  '> Perimeter breach check: NEGATIVE',
  '> Satellite uplink: ESTABLISHED',
  '> Neural network analysis: ACTIVE',
  '> Motion sensor grid: OPERATIONAL',
  '> Data stream analysis: CONTINUOUS',
  '> Predictive model: CALIBRATING',
  '> Encryption level: MAXIMUM',
];

const THREAT_MESSAGES: Record<string, string[]> = {
  HIGH: [
    '> ⚠ CRITICAL: HIGH THREAT DETECTED',
    '> Initiating emergency protocols...',
    '> Alerting response team...',
    '> Locking down affected sectors...',
    '> Threat classification: HOSTILE',
  ],
  MEDIUM: [
    '> WARNING: Anomalous activity detected',
    '> Flagging connection for review...',
    '> Threat classification: SUSPICIOUS',
    '> Monitoring elevated...',
  ],
  LOW: [
    '> Connection analyzed: NORMAL',
    '> Threat assessment: SAFE',
    '> All parameters within range',
    '> System status: SECURE',
  ],
};

export function TerminalLog({ threatLevel, lastPrediction }: TerminalLogProps) {
  const [logs, setLogs] = useState<{ msg: string; type: 'normal' | 'warning' | 'danger' | 'success' }[]>([]);

  // Auto background logs
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = BASE_MESSAGES[Math.floor(Math.random() * BASE_MESSAGES.length)];
      setLogs(prev => [...prev, { msg, type: 'normal' }].slice(-10));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Inject threat-specific logs on prediction
  useEffect(() => {
    if (!threatLevel || !lastPrediction) return;
    const msgs = THREAT_MESSAGES[threatLevel] ?? [];
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        const type = threatLevel === 'HIGH' ? 'danger' : threatLevel === 'MEDIUM' ? 'warning' : 'success';
        setLogs(prev => [...prev, { msg, type }].slice(-10));
      }, i * 300);
    });
    // Confidence line
    setTimeout(() => {
      setLogs(prev => [
        ...prev,
        { msg: `> Model confidence: ${lastPrediction.confidence.toFixed(1)}%`, type: 'normal' }
      ].slice(-10));
    }, msgs.length * 300 + 300);
  }, [lastPrediction, threatLevel]);

  const colorMap = {
    normal:  'text-green-400',
    warning: 'text-yellow-400',
    danger:  'text-red-400',
    success: 'text-green-300',
  };

  return (
    <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 h-64 overflow-hidden font-mono text-xs">
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={`${colorMap[log.type]} animate-[fadeIn_0.3s_ease-in]`}>
            {log.msg}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center">
        <span className="text-cyan-400">&gt;</span>
        <span className="ml-2 w-2 h-4 bg-cyan-400 animate-pulse inline-block" />
      </div>
    </div>
  );
}
