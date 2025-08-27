import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaBrain, FaGraduationCap, FaBookmark, FaClock, FaStar, FaTrendingUp } from 'react-icons/fa';

// Interface for analytics data
interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalNotes: number;
  aiFeaturesUsed: number;
  averageSessionTime: number;
  userSatisfaction: number;
  growthRate: number;
  topSubjects: Array<{ name: string; count: number; percentage: number }>;
  featureUsage: Array<{ name: string; count: number; trend: 'up' | 'down' | 'stable' }>;
  recentActivity: Array<{ action: string; user: string; time: string; type: 'note' | 'ai' | 'subscription' }>;
}

const DemoAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 1250,
    activeUsers: 847,
    totalNotes: 3420,
    aiFeaturesUsed: 15680,
    averageSessionTime: 23,
    userSatisfaction: 4.7,
    growthRate: 12.5,
    topSubjects: [
      { name: 'Computer Science', count: 456, percentage: 23 },
      { name: 'Mathematics', count: 389, percentage: 19 },
      { name: 'History', count: 312, percentage: 15 },
      { name: 'Literature', count: 298, percentage: 14 },
      { name: 'Chemistry', count: 245, percentage: 12 }
    ],
    featureUsage: [
      { name: 'AI Summaries', count: 8234, trend: 'up' },
      { name: 'Flashcards', count: 4567, trend: 'up' },
      { name: 'Citations', count: 2879, trend: 'stable' },
      { name: 'Assignment Help', count: 1234, trend: 'down' }
    ],
    recentActivity: [
      { action: 'Created note', user: 'Sarah M.', time: '2 min ago', type: 'note' },
      { action: 'Generated flashcards', user: 'Mike R.', time: '5 min ago', type: 'ai' },
      { action: 'Upgraded to Premium', user: 'Emma L.', time: '8 min ago', type: 'subscription' },
      { action: 'Summarized notes', user: 'David K.', time: '12 min ago', type: 'ai' },
      { action: 'Bookmarked note', user: 'Lisa P.', time: '15 min ago', type: 'note' }
    ]
  });

  const [isVisible, setIsVisible] = useState(false);

  // Generate new analytics data
  const generateNewAnalytics = () => {
    const newAnalytics = {
      ...analytics,
      totalUsers: analytics.totalUsers + Math.floor(Math.random() * 50) + 10,
      activeUsers: Math.floor(Math.random() * 200) + 700,
      totalNotes: analytics.totalNotes + Math.floor(Math.random() * 100) + 20,
      aiFeaturesUsed: analytics.aiFeaturesUsed + Math.floor(Math.random() * 500) + 100,
      averageSessionTime: Math.floor(Math.random() * 10) + 18,
      userSatisfaction: Math.round((Math.random() * 0.6 + 4.2) * 10) / 10,
      growthRate: Math.round((Math.random() * 20 + 5) * 10) / 10
    };
    
    setAnalytics(newAnalytics);
  };

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Get trend icon and color
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <FaTrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <FaTrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
      default:
        return <FaTrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

  // Get activity icon
  const getActivityIcon = (type: 'note' | 'ai' | 'subscription') => {
    switch (type) {
      case 'note':
        return <FaBookmark className="w-4 h-4 text-blue-500" />;
      case 'ai':
        return <FaBrain className="w-4 h-4 text-purple-500" />;
      case 'subscription':
        return <FaStar className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={toggleVisibility}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300"
      >
        <FaChartLine className="w-4 h-4" />
        <span className="font-medium">Analytics</span>
      </button>

      {/* Analytics Panel */}
      {isVisible && (
        <div className="absolute bottom-16 left-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Demo Analytics</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={generateNewAnalytics}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh
              </button>
              <button
                onClick={toggleVisibility}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaUsers className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-blue-700">Total Users</span>
              </div>
              <div className="text-lg font-bold text-blue-900">{analytics.totalUsers.toLocaleString()}</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaGraduationCap className="w-4 h-4 text-green-500" />
                <span className="text-xs font-medium text-green-700">Active Users</span>
              </div>
              <div className="text-lg font-bold text-green-900">{analytics.activeUsers.toLocaleString()}</div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaBrain className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-medium text-purple-700">AI Features</span>
              </div>
              <div className="text-lg font-bold text-purple-900">{analytics.aiFeaturesUsed.toLocaleString()}</div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FaClock className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-700">Avg Session</span>
              </div>
              <div className="text-lg font-bold text-yellow-900">{analytics.averageSessionTime}m</div>
            </div>
          </div>

          {/* Growth and Satisfaction */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-gray-700">Growth Rate</div>
              <div className="text-lg font-bold text-green-600">+{analytics.growthRate}%</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Satisfaction</div>
              <div className="flex items-center gap-1">
                <div className="text-lg font-bold text-yellow-600">{analytics.userSatisfaction}</div>
                <FaStar className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Feature Usage */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Feature Usage</h4>
            <div className="space-y-2">
              {analytics.featureUsage.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">{feature.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{feature.count.toLocaleString()}</span>
                    {getTrendIcon(feature.trend)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {analytics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-700">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.user} • {activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Notice */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700">
              <strong>Demo Mode:</strong> This data is simulated for demonstration purposes. 
              Real analytics would show actual user activity and engagement metrics.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoAnalytics;
