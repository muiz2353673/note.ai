import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";

const Notes: React.FC = () => {
  const [notes] = useState([
    {
      id: "1",
      title: "Calculus Fundamentals",
      content: "Introduction to limits, derivatives, and integrals...",
      subject: "Mathematics",
      tags: ["calculus", "derivatives", "limits"],
      isBookmarked: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-20T14:45:00Z",
    },
    {
      id: "2",
      title: "Quantum Physics Notes",
      content: "Wave-particle duality and the uncertainty principle...",
      subject: "Physics",
      tags: ["quantum", "physics", "wave-particle"],
      isBookmarked: false,
      createdAt: "2024-01-18T09:15:00Z",
      updatedAt: "2024-01-19T16:20:00Z",
    },
    {
      id: "3",
      title: "Organic Chemistry Reactions",
      content: "Common organic reactions and mechanisms...",
      subject: "Chemistry",
      tags: ["organic", "reactions", "mechanisms"],
      isBookmarked: true,
      createdAt: "2024-01-12T11:00:00Z",
      updatedAt: "2024-01-17T13:30:00Z",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = [
    "All",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
  ];

  // Filter notes based on search term and selected subject
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesSubject =
      selectedSubject === "All" || note.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          <p className="text-gray-600">
            Manage and organize your academic notes
          </p>
        </div>
        <Link
          to="/notes/new"
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Note
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {note.title}
                  </h3>
                  <button
                    className={`p-1 rounded ${
                      note.isBookmarked
                        ? "text-yellow-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <BookmarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {note.content}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {note.subject}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                      +{note.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/notes/${note.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Edit Note
                  </Link>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <DocumentTextIcon className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first note to get started with AI-powered summarization
            and study tools.
          </p>
          <Link
            to="/notes/new"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Your First Note
          </Link>
        </div>
      )}
    </div>
  );
};

export default Notes;
