import { useState } from 'react';
import { MatrixRain } from './components/MatrixRain';
import { RadarSweep } from './components/RadarSweep';
import { TerminalLog } from './components/TerminalLog';
import { ThreatLevelDisplay } from './components/ThreatLevelDisplay';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { ModelComparison } from './components/ModelComparison';
import { ControlPanel } from './components/ControlPanel';
import { ThreatInput, ThreatResponse } from '../api/threatApi';
import { useThreatPredict } from '../hooks/useThreatPredict';

type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export default function App() {
  const [threatLevel, setThreatLevel]           = useState<ThreatLevel>('LOW');
  const [threatProbability, setThreatProbability] = useState(15);
  const { result, loading, error, predict }     = useThreatPredict();

  const handlePredict = async (data: ThreatInput) => {
    await predict(data);
  };

  // Sync local state from API result
  if (result && result.threat !== threatLevel) {
    setThreatLevel(result.threat);
    setThreatProbability(result.confidence);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-auto">
      <MatrixRain />

      <div className="relative z-10 p-4 lg:p-6">
        {/* Header */}
        <header className="border-b-2 border-cyan-500/50 pb-4 mb-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 tracking-wider font-mono">
                AI THREAT RISK PREDICTION SYSTEM
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-mono">DEFENSE MONITORING PROTOCOL v4.2 — NSL-KDD / RANDOM FOREST ENGINE</p>
            </div>
            <div className="flex items-center gap-3 bg-green-500/20 border border-green-500 rounded-lg px-6 py-3 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 font-bold font-mono text-sm">SYSTEM ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-red-400 font-mono text-sm flex items-center gap-2">
            <span>⚠</span>
            <span>{error} — Make sure Flask backend is running on port 5000</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Control Panel */}
          <div className="lg:col-span-3">
            <ControlPanel onPredict={handlePredict} loading={loading} />
          </div>

          {/* Center */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex justify-center">
              <ThreatLevelDisplay level={threatLevel} result={result} />
            </div>
            <AnalyticsPanel threatProbability={threatProbability} result={result} />
            <ModelComparison />
          </div>

          {/* Right: Radar + Terminal */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-cyan-400 text-xs mb-4 font-mono tracking-wider">RADAR SURVEILLANCE</h3>
              <div className="flex justify-center"><RadarSweep /></div>
            </div>
            <div>
              <h3 className="text-cyan-400 text-xs mb-2 font-mono tracking-wider">LIVE MONITORING</h3>
              <TerminalLog threatLevel={threatLevel} lastPrediction={result} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 bg-black/50 border border-cyan-500/30 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div><span className="text-gray-400">Model: </span><span className="text-cyan-400 font-bold">RANDOM FOREST</span></div>
            <div><span className="text-gray-400">Accuracy: </span><span className="text-green-400 font-bold">99%+</span></div>
            <div><span className="text-gray-400">Dataset: </span><span className="text-cyan-400 font-bold">NSL-KDD</span></div>
            <div><span className="text-gray-400">Status: </span><span className="text-green-400 font-bold">{loading ? 'SCANNING...' : 'READY'}</span></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
