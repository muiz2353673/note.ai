import React, { useState, useEffect } from 'react';
import { FaPlay, FaStop, FaDatabase, FaUsers, FaChartLine } from 'react-icons/fa';

// Interface for demo mode state
interface DemoModeState {
  isActive: boolean;
  sampleDataLoaded: boolean;
  demoUserCount: number;
  demoNotesCount: number;
  demoUsageStats: {
    summaries: number;
    flashcards: number;
    citations: number;
  };
}

// Sample data for demo mode
const sampleNotes = [
  {
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions based on that data. Key concepts include supervised learning, unsupervised learning, and reinforcement learning. Supervised learning involves training a model on labeled data, while unsupervised learning finds hidden patterns in unlabeled data. Reinforcement learning uses rewards and penalties to teach an agent how to behave in an environment.",
    tags: ["machine-learning", "ai", "computer-science"],
    isBookmarked: true
  },
  {
    title: "The French Revolution: Causes and Effects",
    subject: "History",
    content: "The French Revolution (1789-1799) was a period of radical social and political upheaval in France that had a lasting impact on French and world history. The revolution was caused by social inequality, financial crisis, and Enlightenment ideas. The Third Estate, representing 98% of the population, was heavily taxed while the nobility and clergy enjoyed privileges. The revolution led to the abolition of the monarchy, establishment of a republic, and eventually the rise of Napoleon Bonaparte. Key events included the Storming of the Bastille, the Reign of Terror, and the Declaration of the Rights of Man and Citizen.",
    tags: ["history", "french-revolution", "european-history"],
    isBookmarked: false
  },
  {
    title: "Organic Chemistry: Carbon Compounds",
    subject: "Chemistry",
    content: "Organic chemistry is the study of carbon-containing compounds and their reactions. Carbon's unique ability to form four covalent bonds allows it to create complex molecules. Key concepts include functional groups, isomerism, and reaction mechanisms. Common functional groups include alcohols, aldehydes, ketones, carboxylic acids, and amines. Isomerism occurs when compounds have the same molecular formula but different structures. Understanding organic chemistry is crucial for fields like medicine, biochemistry, and materials science.",
    tags: ["chemistry", "organic-chemistry", "carbon-compounds"],
    isBookmarked: true
  },
  {
    title: "Shakespeare's Hamlet: Character Analysis",
    subject: "Literature",
    content: "Hamlet, the titular character of Shakespeare's tragedy, is one of literature's most complex protagonists. His internal conflict between action and inaction drives the play's plot. Hamlet's famous soliloquy 'To be or not to be' reflects his philosophical nature and indecision. Key themes include revenge, madness, mortality, and the nature of existence. Other important characters include Ophelia, Gertrude, Claudius, and Polonius. The play explores the consequences of revenge and the complexity of human nature.",
    tags: ["literature", "shakespeare", "hamlet", "drama"],
    isBookmarked: false
  },
  {
    title: "Microeconomics: Supply and Demand",
    subject: "Economics",
    content: "Supply and demand are fundamental concepts in microeconomics that determine market prices and quantities. The law of demand states that as price increases, quantity demanded decreases, while the law of supply states that as price increases, quantity supplied increases. Market equilibrium occurs where supply equals demand. Factors that shift demand curves include income, preferences, prices of related goods, and expectations. Factors that shift supply curves include production costs, technology, and number of sellers.",
    tags: ["economics", "microeconomics", "supply-demand"],
    isBookmarked: true
  }
];

const DemoMode: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoModeState>({
    isActive: false,
    sampleDataLoaded: false,
    demoUserCount: 1250,
    demoNotesCount: 0,
    demoUsageStats: {
      summaries: 0,
      flashcards: 0,
      citations: 0
    }
  });

  const [showDemoPanel, setShowDemoPanel] = useState(false);

  // Load demo state from localStorage on component mount
  useEffect(() => {
    const savedDemoState = localStorage.getItem('demoModeState');
    if (savedDemoState) {
      setDemoState(JSON.parse(savedDemoState));
    }
  }, []);

  // Save demo state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('demoModeState', JSON.stringify(demoState));
  }, [demoState]);

  // Toggle demo mode
  const toggleDemoMode = () => {
    setDemoState(prev => ({
      ...prev,
      isActive: !prev.isActive
    }));
  };

  // Load sample data
  const loadSampleData = () => {
    // Simulate loading sample notes
    setDemoState(prev => ({
      ...prev,
      sampleDataLoaded: true,
      demoNotesCount: sampleNotes.length,
      demoUsageStats: {
        summaries: Math.floor(Math.random() * 50) + 20,
        flashcards: Math.floor(Math.random() * 30) + 15,
        citations: Math.floor(Math.random() * 100) + 50
      }
    }));

    // Store sample notes in localStorage for demo purposes
    localStorage.setItem('demoNotes', JSON.stringify(sampleNotes));
    
    // Show success message
    alert('Sample data loaded successfully! You can now explore the demo notes.');
  };

  // Clear demo data
  const clearDemoData = () => {
    setDemoState(prev => ({
      ...prev,
      sampleDataLoaded: false,
      demoNotesCount: 0,
      demoUsageStats: {
        summaries: 0,
        flashcards: 0,
        citations: 0
      }
    }));
    
    localStorage.removeItem('demoNotes');
    alert('Demo data cleared successfully!');
  };

  // Generate demo analytics
  const generateDemoAnalytics = () => {
    const newStats = {
      summaries: Math.floor(Math.random() * 100) + 50,
      flashcards: Math.floor(Math.random() * 60) + 30,
      citations: Math.floor(Math.random() * 200) + 100
    };
    
    setDemoState(prev => ({
      ...prev,
      demoUsageStats: newStats
    }));
    
    alert('Demo analytics updated!');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Demo Mode Toggle Button */}
      <button
        onClick={() => setShowDemoPanel(!showDemoPanel)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
          demoState.isActive 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
        }`}
      >
        <FaPlay className="w-4 h-4" />
        <span className="font-medium">Demo Mode</span>
        {demoState.isActive && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Demo Panel */}
      {showDemoPanel && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Demo Controls</h3>
            <button
              onClick={() => setShowDemoPanel(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Demo Mode Toggle */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={demoState.isActive}
                onChange={toggleDemoMode}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable Demo Mode
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Switch between demo and production modes
            </p>
          </div>

          {/* Sample Data Controls */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FaDatabase className="w-3 h-3" />
              Sample Data
            </h4>
            <div className="space-y-2">
              <button
                onClick={loadSampleData}
                disabled={demoState.sampleDataLoaded}
                className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Load Sample Notes
              </button>
              {demoState.sampleDataLoaded && (
                <button
                  onClick={clearDemoData}
                  className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Clear Sample Data
                </button>
              )}
            </div>
          </div>

          {/* Demo Analytics */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FaChartLine className="w-3 h-3" />
              Demo Analytics
            </h4>
            <div className="bg-gray-50 rounded p-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Total Users:</span>
                <span className="font-medium">{demoState.demoUserCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Sample Notes:</span>
                <span className="font-medium">{demoState.demoNotesCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>AI Summaries:</span>
                <span className="font-medium">{demoState.demoUsageStats.summaries}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Flashcards:</span>
                <span className="font-medium">{demoState.demoUsageStats.flashcards}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Citations:</span>
                <span className="font-medium">{demoState.demoUsageStats.citations}</span>
              </div>
            </div>
            <button
              onClick={generateDemoAnalytics}
              className="w-full mt-2 px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              Generate New Stats
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <FaUsers className="w-3 h-3" />
              Demo Credentials
            </h4>
            <div className="bg-gray-50 rounded p-3 space-y-2">
              <div className="text-xs">
                <span className="font-medium">Email:</span> demo@noted.ai
              </div>
              <div className="text-xs">
                <span className="font-medium">Password:</span> demo123
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              demoState.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                demoState.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
              {demoState.isActive ? 'Demo Mode Active' : 'Production Mode'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoMode;
