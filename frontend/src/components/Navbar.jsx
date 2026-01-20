import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="font-bold text-xl gradient-text">FocusSense</h1>
        </Link>
        <div className="flex space-x-6 items-center">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/dashboard') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/privacy" 
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive('/privacy') 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Privacy
          </Link>
        </div>
      </div>
    </nav>
  );
}
