// Import React and useState hook for component state management
import React, { useState } from "react";
// Import Heroicons for UI icons
import {
  LightBulbIcon,
  DocumentTextIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
// Import AI API service for making AI feature requests
import { aiAPI } from "../services/api";
// Import toast for user notifications
import { toast } from "react-hot-toast";

// AIFeatures component that provides AI-powered academic tools
const AIFeatures: React.FC = () => {
  const [activeTab, setActiveTab] = useState("summarize");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const features = [
    {
      id: "summarize",
      name: "Note Summarization",
      description: "Transform lengthy notes into concise summaries",
      icon: DocumentTextIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "flashcards",
      name: "Flashcard Generation",
      description: "Create study flashcards from your notes",
      icon: BookOpenIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      id: "assignment",
      name: "Assignment Help",
      description: "Get guidance on essays and research papers",
      icon: AcademicCapIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setResult("");

    try {
      let data: any;

      switch (activeTab) {
        case "summarize":
          data = await aiAPI.summarize({
            content,
            style: "concise",
          });
          if (data?.data?.summary) {
            setResult(data.data.summary);
            toast.success(
              data.data.isFallback
                ? "Summary generated (fallback mode)"
                : "Summary generated successfully!"
            );
          } else {
            throw new Error("Invalid response format");
          }
          break;

        case "flashcards":
          data = await aiAPI.generateFlashcards({
            content,
            count: 5,
            difficulty: "medium",
          });
          if (data?.data?.flashcards) {
            setResult(JSON.stringify(data.data.flashcards, null, 2));
            toast.success(
              data.data.isFallback
                ? "Flashcards generated (fallback mode)"
                : "Flashcards generated successfully!"
            );
          } else {
            throw new Error("Invalid response format");
          }
          break;

        case "assignment":
          data = await aiAPI.assignment({
            topic: content,
            requirements: "Please provide general guidance for this topic",
            type: "essay",
          });
          if (data?.data?.assignmentHelp) {
            setResult(data.data.assignmentHelp);
            toast.success(
              data.data.isFallback
                ? "Assignment help generated (fallback mode)"
                : "Assignment help generated successfully!"
            );
          } else {
            throw new Error("Invalid response format");
          }
          break;

        default:
          throw new Error("Invalid feature");
      }
    } catch (error: any) {
      console.error("AI Feature Error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to process request";
      setResult(`Error: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
     
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Features</h1>
        <p className="text-gray-600">
          Leverage AI to enhance your academic productivity
        </p>
      </div>

     
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === feature.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <feature.icon className="w-5 h-5 mr-2" />
                  {feature.name}
                </div>
              </button>
            ))}
          </nav>
        </div>

       
        {activeTab === "summarize" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Note Summarization
                </h3>
                <p className="text-sm text-gray-600">
                  Transform lengthy notes into concise, organized summaries
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Notes
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Paste your notes here..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-700">Summary Style:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>Concise</option>
                    <option>Detailed</option>
                    <option>Bullet Points</option>
                    <option>Study Guide</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Generate Summary
                    </div>
                  )}
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AI Summary
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Generated with GPT-4</span>
                    <button className="text-primary-600 hover:text-primary-500 text-sm">
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-900 whitespace-pre-wrap">{result}</p>
                </div>
              </div>
            )}
          </div>
        )}

       
        {activeTab === "flashcards" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <BookOpenIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Flashcard Generation
                </h3>
                <p className="text-sm text-gray-600">
                  Create study flashcards from your notes
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Notes
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Paste your notes here to generate flashcards..."
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="text-sm text-gray-700">Difficulty:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                  <label className="text-sm text-gray-700">Count:</label>
                  <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                    <option>3</option>
                    <option>5</option>
                    <option>10</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Generate Flashcards
                    </div>
                  )}
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generated Flashcards
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Generated with AI</span>
                    <button className="text-primary-600 hover:text-primary-500 text-sm">
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {result && result.includes("question") ? (
                      JSON.parse(result).map((card: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded border"
                        >
                          <div className="font-medium text-gray-900 mb-1">
                            Q: {card.question}
                          </div>
                          <div className="text-gray-700">
                            A: {card.answer}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {result}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

       
        {activeTab === "assignment" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <AcademicCapIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Assignment Help
                </h3>
                <p className="text-sm text-gray-600">
                  Get guidance on essays and research papers
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Topic
                  </label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Climate Change Impact on Agriculture"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Essay</option>
                    <option>Research Paper</option>
                    <option>Presentation</option>
                    <option>Report</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Describe your assignment requirements, word count, specific guidelines..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="spinner mr-2"></div>
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Get Assignment Help
                    </div>
                  )}
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Guidance
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Generated with AI</span>
                    <button className="text-primary-600 hover:text-primary-500 text-sm">
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-gray-900 whitespace-pre-wrap">{result}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

     
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <LightBulbIcon className="w-6 h-6 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-blue-900">AI Feature Usage</h3>
            <p className="text-sm text-blue-700 mt-1">
              You have used 2 out of 5 AI summaries this month. Upgrade to Premium for unlimited access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures;
