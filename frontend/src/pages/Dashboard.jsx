import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalFocusTime: 0,
    totalDistractedTime: 0,
    focusPercentage: 0,
    totalSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    fetch("http://localhost:5000/api/session/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 10, color = "text-blue-400" }) => {
    const radius = (size - strokeWidth) / 2;
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
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${color} transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
          <p className="text-gray-400">Your productivity insights at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <div className="glass p-6 rounded-2xl border-2 border-green-500/30 hover:border-green-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">✓</div>
              <div className="text-green-400 text-sm font-medium">Focused</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Total Focus Time</p>
            <p className="text-3xl font-bold text-green-400">
              {formatTime(stats.totalFocusTime)}
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">⚠</div>
              <div className="text-yellow-400 text-sm font-medium">Distracted</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Total Distracted Time</p>
            <p className="text-3xl font-bold text-yellow-400">
              {formatTime(stats.totalDistractedTime)}
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border-2 border-blue-500/30 hover:border-blue-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">📊</div>
              <div className="text-blue-400 text-sm font-medium">Sessions</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Total Sessions</p>
            <p className="text-3xl font-bold text-blue-400">
              {stats.totalSessions || 0}
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border-2 border-purple-500/30 hover:border-purple-500/50 transition-all hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">🎯</div>
              <div className="text-purple-400 text-sm font-medium">Focus Rate</div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Average Focus %</p>
            <p className="text-3xl font-bold text-purple-400">
              {Math.round(stats.focusPercentage)}%
            </p>
          </div>
        </div>

        {/* Focus Percentage Circle */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="glass p-8 rounded-2xl border-2 border-gray-700 flex flex-col items-center justify-center animate-fade-in">
            <h3 className="text-xl font-semibold mb-6 text-gray-300">Focus Performance</h3>
            <CircularProgress 
              percentage={stats.focusPercentage || 0} 
              size={200}
              color={stats.focusPercentage >= 70 ? "text-green-400" : stats.focusPercentage >= 50 ? "text-yellow-400" : "text-red-400"}
            />
            <p className="mt-6 text-gray-400 text-center">
              {stats.focusPercentage >= 70 
                ? "🎉 Excellent focus! Keep it up!" 
                : stats.focusPercentage >= 50 
                ? "👍 Good progress, you're getting there!" 
                : "💪 Let's improve together!"}
            </p>
          </div>

          <div className="glass p-8 rounded-2xl border-2 border-gray-700 animate-fade-in">
            <h3 className="text-xl font-semibold mb-6">Weekly Overview</h3>
            <div className="space-y-4">
              {/* Simple bar chart representation */}
              {[80, 65, 70, 75, 85, 90, 88].map((value, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        value >= 70 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                        value >= 50 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                        "bg-gradient-to-r from-red-500 to-rose-500"
                      }`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-8 rounded-2xl border-2 border-gray-700 animate-slide-up">
          <h3 className="text-xl font-semibold mb-6">Recent Sessions</h3>
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📝</div>
            <p>No recent sessions yet</p>
            <p className="text-sm mt-2">Start a focus session to see your activity here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
