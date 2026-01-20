import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function Summary() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("sessionId");

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`http://localhost:5000/api/session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-400">Loading session summary...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-xl mb-4">Session not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const total =
    session.focusedTime +
    session.distractedTime +
    session.awayTime;

  const format = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    return `${m}m ${sec}s`;
  };

  const focusPercentage = session.focusPercentage || 0;

  const CircularProgress = ({ percentage, size = 180, strokeWidth = 12, color = "text-blue-400" }) => {
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
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-4xl font-bold ${color}`}>{Math.round(percentage)}%</span>
          <span className="text-sm text-gray-400 mt-1">Focus</span>
        </div>
      </div>
    );
  };

  const getPerformanceMessage = () => {
    if (focusPercentage >= 80) return { emoji: "🎉", message: "Outstanding focus! You're a productivity champion!", color: "text-green-400" };
    if (focusPercentage >= 60) return { emoji: "🌟", message: "Great job! You stayed focused throughout the session!", color: "text-green-400" };
    if (focusPercentage >= 40) return { emoji: "👍", message: "Good effort! There's room for improvement.", color: "text-yellow-400" };
    return { emoji: "💪", message: "Every session counts! Keep practicing to improve your focus.", color: "text-blue-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center animate-fade-in">
          <h2 className="text-4xl font-bold mb-2 gradient-text">Session Summary</h2>
          <p className="text-gray-400">Review your focus session performance</p>
        </div>

        {/* Performance Message */}
        <div className={`glass p-6 rounded-2xl border-2 mb-8 text-center animate-slide-down ${performance.color.replace('text-', 'border-')}/30`}>
          <div className="text-6xl mb-4">{performance.emoji}</div>
          <p className={`text-xl font-semibold ${performance.color}`}>{performance.message}</p>
        </div>

        {/* Main Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Focus Circle */}
          <div className="glass p-8 rounded-2xl border-2 border-gray-700 flex flex-col items-center justify-center animate-fade-in">
            <h3 className="text-xl font-semibold mb-6 text-gray-300">Focus Performance</h3>
            <CircularProgress 
              percentage={focusPercentage}
              size={220}
              color={focusPercentage >= 70 ? "text-green-400" : focusPercentage >= 50 ? "text-yellow-400" : "text-red-400"}
            />
          </div>

          {/* Time Breakdown */}
          <div className="glass p-8 rounded-2xl border-2 border-gray-700 space-y-6 animate-slide-up">
            <h3 className="text-xl font-semibold mb-6">Time Breakdown</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Total Time</span>
                  <span className="text-white font-semibold text-lg">{format(total)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-600 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Focused Time</span>
                  </span>
                  <span className="text-green-400 font-semibold text-lg">{format(session.focusedTime)}</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${total > 0 ? (session.focusedTime / total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <span className="text-yellow-400">⚠</span>
                    <span>Distracted Time</span>
                  </span>
                  <span className="text-yellow-400 font-semibold text-lg">{format(session.distractedTime)}</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${total > 0 ? (session.distractedTime / total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400 flex items-center space-x-2">
                    <span className="text-red-400">✕</span>
                    <span>Away Time</span>
                  </span>
                  <span className="text-red-400 font-semibold text-lg">{format(session.awayTime)}</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full transition-all duration-1000"
                    style={{ width: `${total > 0 ? (session.awayTime / total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <button
            onClick={() => navigate("/")}
            className="glass px-8 py-4 rounded-xl font-semibold border-2 border-gray-700 hover:border-blue-500 transition-all hover:scale-105"
          >
            🏠 Back to Home
          </button>
          <button
            onClick={() => navigate("/session")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
          >
            ▶ Start New Session
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="glass px-8 py-4 rounded-xl font-semibold border-2 border-gray-700 hover:border-purple-500 transition-all hover:scale-105"
          >
            📊 View Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
