import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaPlay, FaLightbulb, FaGraduationCap, FaBrain, FaCreditCard } from 'react-icons/fa';

// Interface for tour step
interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: React.ReactNode;
}

// Tour steps configuration
const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Noted.AI!',
    description: 'Your AI-powered academic assistant. Let me show you around the key features that will transform your study experience.',
    target: 'body',
    position: 'top',
    icon: <FaGraduationCap className="w-5 h-5" />
  },
  {
    id: 'dashboard',
    title: 'Dashboard Overview',
    description: 'Your personalized dashboard shows your study progress, recent notes, and quick access to all features. Track your learning journey here.',
    target: '.dashboard-content',
    position: 'bottom',
    icon: <FaPlay className="w-5 h-5" />
  },
  {
    id: 'notes',
    title: 'Smart Note Management',
    description: 'Create, organize, and search through your notes with intelligent tagging and categorization. Your notes are automatically organized by subject.',
    target: '.notes-section',
    position: 'right',
    icon: <FaLightbulb className="w-5 h-5" />
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Features',
    description: 'Transform your notes with AI summarization, generate study flashcards, and create perfect citations. Let AI enhance your learning.',
    target: '.ai-features',
    position: 'left',
    icon: <FaBrain className="w-5 h-5" />
  },
  {
    id: 'subscription',
    title: 'Premium Features',
    description: 'Upgrade to unlock unlimited AI features, advanced analytics, and priority support. Choose the plan that fits your study needs.',
    target: '.subscription-section',
    position: 'top',
    icon: <FaCreditCard className="w-5 h-5" />
  }
];

const DemoTour: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTour, setShowTour] = useState(false);

  // Check if user has seen the tour before
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenDemoTour');
    if (!hasSeenTour) {
      setShowTour(true);
    }
  }, []);

  // Start the tour
  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    localStorage.setItem('hasSeenDemoTour', 'true');
  };

  // End the tour
  const endTour = () => {
    setIsActive(false);
    setShowTour(false);
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Skip tour
  const skipTour = () => {
    endTour();
  };

  // Get current step
  const currentTourStep = tourSteps[currentStep];

  // Calculate progress percentage
  const progressPercentage = ((currentStep + 1) / tourSteps.length) * 100;

  if (!showTour && !isActive) {
    return (
      <button
        onClick={startTour}
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
      >
        <FaPlay className="w-4 h-4" />
        <span className="font-medium">Take Tour</span>
      </button>
    );
  }

  if (!isActive) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={endTour}></div>

      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                {currentTourStep.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {currentTourStep.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
              </div>
            </div>
            <button
              onClick={endTour}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed mb-6">
              {currentTourStep.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={skipTour}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <span>Finish</span>
                      <FaTimes className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <FaChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="bg-gray-50 p-4 rounded-b-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Tips:</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {currentStep === 0 && (
                <>
                  <p>• Use the sidebar to navigate between features</p>
                  <p>• Your notes are automatically saved</p>
                  <p>• AI features work best with detailed content</p>
                </>
              )}
              {currentStep === 1 && (
                <>
                  <p>• View your study statistics and progress</p>
                  <p>• Quick access to recent notes and features</p>
                  <p>• Monitor your AI feature usage</p>
                </>
              )}
              {currentStep === 2 && (
                <>
                  <p>• Add tags to organize your notes</p>
                  <p>• Use the search function to find notes quickly</p>
                  <p>• Bookmark important notes for easy access</p>
                </>
              )}
              {currentStep === 3 && (
                <>
                  <p>• AI summaries work with any text length</p>
                  <p>• Generate flashcards from your notes</p>
                  <p>• Create citations in multiple formats</p>
                </>
              )}
              {currentStep === 4 && (
                <>
                  <p>• Free plan includes 5 AI summaries</p>
                  <p>• Student Premium unlocks unlimited features</p>
                  <p>• University plans for institutions</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoTour;
