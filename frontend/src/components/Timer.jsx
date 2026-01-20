export default function Timer({ focused, distracted, away }) {
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const total = focused + distracted + away;
  const focusPercentage = total > 0 ? Math.round((focused / total) * 100) : 0;

  const CircularProgress = ({ percentage, color, size = 80 }) => {
    const radius = size / 2 - 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${color} transition-all duration-500`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${color}`}>{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Focus Percentage Circle */}
      <div className="flex justify-center">
        <CircularProgress 
          percentage={focusPercentage} 
          color="text-green-400"
          size={120}
        />
      </div>

      {/* Time breakdown */}
      <div className="space-y-4">
        <div className="glass p-4 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Focused Time</p>
            <span className="text-green-400 text-2xl">✓</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{formatTime(focused)}</p>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-400 rounded-full transition-all duration-500"
              style={{ width: `${total > 0 ? (focused / total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Distracted Time</p>
            <span className="text-yellow-400 text-2xl">⚠</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{formatTime(distracted)}</p>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${total > 0 ? (distracted / total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Away Time</p>
            <span className="text-red-400 text-2xl">✕</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{formatTime(away)}</p>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-400 rounded-full transition-all duration-500"
              style={{ width: `${total > 0 ? (away / total) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Total Time */}
      <div className="glass p-4 rounded-xl text-center">
        <p className="text-gray-400 text-sm mb-1">Total Session Time</p>
        <p className="text-xl font-bold text-white">{formatTime(total)}</p>
      </div>
    </div>
  );
}
