import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/session/start", {
        method: "POST"
      });
      const data = await res.json();
      navigate(`/session?sessionId=${data._id}`);
    } catch (e) {
      // fallback: still navigate to /session so user can start there
      navigate(`/session`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative z-10 text-center px-4 animate-fade-in">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-5xl">F</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text animate-slide-down">
          FocusSense
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto animate-slide-up">
          Track your focus with AI-powered attention detection
        </p>
        
        <p className="text-gray-400 mb-12 text-center max-w-lg mx-auto leading-relaxed">
          A privacy-first productivity app that uses advanced webcam analysis to monitor 
          your focus and help you stay on track. All processing happens locally.
        </p>

        {/* Feature highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto animate-fade-in">
          <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-sm text-gray-400">Monitor your focus state in real-time</p>
          </div>
          <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold mb-2">Privacy First</h3>
            <p className="text-sm text-gray-400">All processing happens on your device</p>
          </div>
          <div className="glass p-6 rounded-2xl hover:scale-105 transition-transform">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Detailed Insights</h3>
            <p className="text-sm text-gray-400">Track your productivity over time</p>
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading}
          className="group relative bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className="relative z-10 flex items-center space-x-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span>Start Focus Session</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </div>
  );
}
