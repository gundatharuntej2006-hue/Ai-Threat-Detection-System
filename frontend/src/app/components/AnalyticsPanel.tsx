import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { ThreatResponse } from '../../api/threatApi';

interface AnalyticsPanelProps {
  threatProbability: number;
  result: ThreatResponse | null;
}

const FEATURE_IMPORTANCE = [
  { name: 'dst_bytes',   value: 18 },
  { name: 'src_bytes',   value: 15 },
  { name: 'count',       value: 12 },
  { name: 'srv_count',   value: 10 },
  { name: 'dst_host',    value: 9  },
  { name: 'flag',        value: 8  },
  { name: 'rerror_rate', value: 7  },
  { name: 'service',     value: 6  },
];

export function AnalyticsPanel({ threatProbability, result }: AnalyticsPanelProps) {
  const probs = result?.probabilities;

  const pieData = probs
    ? [
        { name: 'HIGH',   value: probs.HIGH   ?? 0 },
        { name: 'MEDIUM', value: probs.MEDIUM  ?? 0 },
        { name: 'LOW',    value: probs.LOW     ?? 0 },
      ]
    : [
        { name: 'Threat', value: threatProbability },
        { name: 'Safe',   value: 100 - threatProbability },
      ];

  const PIE_COLORS = probs ? ['#ef4444', '#eab308', '#10b981'] : ['#ef4444', '#10b981'];
  const confidence = result ? result.confidence : Math.min(95, threatProbability + 20);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Probability pie */}
      <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4">
        <h3 className="text-cyan-400 text-xs mb-3 font-mono tracking-wider">
          {probs ? 'CLASS PROBABILITIES' : 'THREAT PROBABILITY'}
        </h3>
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
              {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #06b6d4', fontSize: 11 }}
              formatter={(v: number) => [`${v.toFixed(1)}%`]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-1">
          {probs ? (
            <div className="flex justify-center gap-3 text-xs font-mono">
              <span className="text-red-400">H: {probs.HIGH?.toFixed(1)}%</span>
              <span className="text-yellow-400">M: {probs.MEDIUM?.toFixed(1)}%</span>
              <span className="text-green-400">L: {probs.LOW?.toFixed(1)}%</span>
            </div>
          ) : (
            <div>
              <span className="text-2xl font-bold text-red-400">{threatProbability}%</span>
              <span className="text-gray-400 text-xs ml-2">RISK</span>
            </div>
          )}
        </div>
      </div>

      {/* Feature importance bar */}
      <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4">
        <h3 className="text-cyan-400 text-xs mb-3 font-mono tracking-wider">FEATURE IMPORTANCE</h3>
        <ResponsiveContainer width="100%" height={170}>
          <BarChart data={FEATURE_IMPORTANCE} layout="vertical">
            <XAxis type="number" stroke="#06b6d4" fontSize={9} />
            <YAxis dataKey="name" type="category" stroke="#06b6d4" fontSize={9} width={70} />
            <Tooltip
              contentStyle={{ backgroundColor: '#000', border: '1px solid #06b6d4', fontSize: 11 }}
              labelStyle={{ color: '#06b6d4' }}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confidence bar */}
      <div className="bg-black/50 border border-cyan-500/30 rounded-lg p-4 lg:col-span-2">
        <h3 className="text-cyan-400 text-xs mb-3 font-mono tracking-wider">DETECTION CONFIDENCE</h3>
        <div className="relative h-7 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-1000 rounded-full"
            style={{ width: `${confidence}%` }}
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400 font-mono">
          <span>0%</span>
          <span className="text-cyan-400 font-bold">{confidence.toFixed(1)}% CONFIDENCE</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
