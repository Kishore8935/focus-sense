export default function FocusStatus({ status }) {
  const statusMap = {
    focused: {
      label: "Focused",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      borderColor: "border-green-500",
      icon: "✓",
      pulse: "animate-pulse"
    },
    distracted: {
      label: "Distracted",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-500",
      icon: "⚠",
      pulse: ""
    },
    away: {
      label: "Away",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      borderColor: "border-red-500",
      icon: "✕",
      pulse: ""
    }
  };

  const current = statusMap[status];

  return (
    <div className={`mb-6 p-6 rounded-2xl border-2 ${current.bgColor} ${current.borderColor} transition-all duration-300`}>
      <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">Current Status</p>
      <div className="flex items-center space-x-3">
        <div className={`text-3xl ${current.color} ${current.pulse}`}>
          {current.icon}
        </div>
        <p className={`text-3xl font-bold ${current.color}`}>
          {current.label}
        </p>
      </div>
    </div>
  );
}
