import React, { useState } from "react";
import {
  BookOpenIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  isCorrect?: boolean;
}

const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      question: "What is the derivative of x²?",
      answer: "2x",
      subject: "Mathematics",
      difficulty: "easy",
    },
    {
      id: "2",
      question: "What is the uncertainty principle?",
      answer:
        "The more precisely the position of a particle is determined, the less precisely its momentum can be known, and vice versa.",
      subject: "Physics",
      difficulty: "medium",
    },
    {
      id: "3",
      question: "What is a nucleophile?",
      answer:
        "A chemical species that donates an electron pair to form a chemical bond in reaction.",
      subject: "Chemistry",
      difficulty: "medium",
    },
  ]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [generating, setGenerating] = useState(false);

  const currentCard = flashcards[currentCardIndex];

  const generateFlashcards = async () => {
    setGenerating(true);
    try {
      // TODO: Replace with actual AI API call
      // const response = await api.post('/ai/flashcards', { notes: selectedNotes });

      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newFlashcards: Flashcard[] = [
        {
          id: Date.now().toString(),
          question: "What is the fundamental theorem of calculus?",
          answer:
            "It states that differentiation and integration are inverse operations.",
          subject: "Mathematics",
          difficulty: "hard",
        },
        {
          id: (Date.now() + 1).toString(),
          question: "Define wave-particle duality",
          answer:
            "The property of matter and light to exhibit both wave-like and particle-like characteristics.",
          subject: "Physics",
          difficulty: "medium",
        },
      ];

      setFlashcards((prev) => [...prev, ...newFlashcards]);
      toast.success("Generated 2 new flashcards!");
    } catch (error) {
      toast.error("Failed to generate flashcards");
    } finally {
      setGenerating(false);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const markAsCorrect = () => {
    setFlashcards((prev) =>
      prev.map((card, index) =>
        index === currentCardIndex ? { ...card, isCorrect: true } : card
      )
    );
    nextCard();
  };

  const markAsIncorrect = () => {
    setFlashcards((prev) =>
      prev.map((card, index) =>
        index === currentCardIndex ? { ...card, isCorrect: false } : card
      )
    );
    nextCard();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (studyMode) {
    return (
      <div className="space-y-6">
        {/* Study Mode Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setStudyMode(false)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Study Mode</h1>
              <p className="text-gray-600">
                Card {currentCardIndex + 1} of {flashcards.length}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="w-4 h-4 mr-1" />
              Progress:{" "}
              {Math.round(((currentCardIndex + 1) / flashcards.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto">
          <div className="card p-8 text-center">
            <div className="mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                  currentCard.difficulty
                )}`}
              >
                {currentCard.difficulty}
              </span>
              <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {currentCard.subject}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {currentCard.question}
              </h2>

              {showAnswer && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Answer:
                  </h3>
                  <p className="text-gray-700">{currentCard.answer}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="btn-primary px-8 py-3"
                >
                  Show Answer
                </button>
              ) : (
                <>
                  <button
                    onClick={markAsIncorrect}
                    className="btn-secondary px-8 py-3"
                  >
                    Incorrect
                  </button>
                  <button
                    onClick={markAsCorrect}
                    className="btn-primary px-8 py-3"
                  >
                    Correct
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={previousCard}
              disabled={currentCardIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </button>
            <button
              onClick={nextCard}
              disabled={currentCardIndex === flashcards.length - 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Next
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
          <p className="text-gray-600">
            Study mode with AI-generated flashcards
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={generateFlashcards}
            disabled={generating}
            className="btn-secondary inline-flex items-center disabled:opacity-50"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {generating ? "Generating..." : "Generate from Notes"}
          </button>
          <button
            onClick={() => setStudyMode(true)}
            disabled={flashcards.length === 0}
            className="btn-primary inline-flex items-center disabled:opacity-50"
          >
            <BookOpenIcon className="w-5 h-5 mr-2" />
            Start Studying
          </button>
        </div>
      </div>

      {/* Flashcard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {flashcards.length}
          </div>
          <div className="text-gray-600">Total Cards</div>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {flashcards.filter((card) => card.isCorrect === true).length}
          </div>
          <div className="text-gray-600">Correct</div>
        </div>
        <div className="card text-center p-6">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {flashcards.filter((card) => card.isCorrect === false).length}
          </div>
          <div className="text-gray-600">Incorrect</div>
        </div>
      </div>

      {/* Flashcard List */}
      {flashcards.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Flashcards
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card, index) => (
              <div key={card.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        card.difficulty
                      )}`}
                    >
                      {card.difficulty}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {card.subject}
                    </span>
                  </div>
                  {card.isCorrect !== undefined && (
                    <CheckCircleIcon
                      className={`w-5 h-5 ${
                        card.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    />
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {card.question}
                </h4>
                <p className="text-gray-600 text-sm">{card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No flashcards yet
          </h3>
          <p className="text-gray-600 mb-6">
            Generate flashcards from your notes to start studying.
          </p>
          <button
            onClick={generateFlashcards}
            disabled={generating}
            className="btn-primary inline-flex items-center disabled:opacity-50"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            {generating ? "Generating..." : "Generate Your First Flashcards"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
