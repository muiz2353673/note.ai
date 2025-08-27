import React from "react";
import { toggleDevMode, isDevMode } from "../utils/devMode";

const DevToggle: React.FC = () => {
  // Only show this component in development environment
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const devModeActive = isDevMode();

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={toggleDevMode}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-300 text-xs font-medium ${
          devModeActive
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-500 text-white hover:bg-gray-600"
        }`}
        title="Toggle Developer Mode (Demo Features)"
      >
        <span>{devModeActive ? "🔧" : "⚙️"}</span>
        <span>Dev Mode</span>
        <span
          className={`w-2 h-2 rounded-full ${
            devModeActive ? "bg-green-300" : "bg-gray-300"
          }`}
        ></span>
      </button>
    </div>
  );
};

export default DevToggle;
