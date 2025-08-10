// Import React and necessary hooks for component state and effects
import React, { useState, useEffect } from "react";
// Import Link component for navigation
import { Link } from "react-router-dom";
// Import Heroicons for UI icons
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CalendarIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
// Import notes API service for data fetching
import { notesAPI } from "../services/api";
// Import toast for user notifications
import toast from "react-hot-toast";

// Interface defining the structure of a Note object
// Contains all note-related data for display and management
interface Note {
  _id: string; // Unique note identifier
  title: string; // Note title
  content: string; // Note content
  subject: string; // Academic subject/course
  tags: string[]; // Array of tags for categorization
  isBookmarked?: boolean; // Whether note is bookmarked (optional)
  createdAt: string; // Note creation timestamp
  updatedAt: string; // Note last update timestamp
}

// Notes component that displays and manages user's notes
const Notes: React.FC = () => {
  // State for managing notes data
  const [notes, setNotes] = useState<Note[]>([]); // Array of all notes
  const [loading, setLoading] = useState(true); // Loading state for notes fetching

  // State for search and filtering functionality
  const [searchTerm, setSearchTerm] = useState(""); // Current search term
  const [selectedSubject, setSelectedSubject] = useState("All"); // Currently selected subject filter

  // Effect to load notes from API when component mounts
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true); // Set loading state
        // Fetch all notes from the API
        const response = await notesAPI.getAll();
        setNotes(response.data.notes || []); // Update notes state with fetched data
      } catch (error) {
        console.error("Failed to load notes:", error); // Log error for debugging
        toast.error("Failed to load notes"); // Show error notification to user
      } finally {
        setLoading(false); // Clear loading state regardless of success/failure
      }
    };

    loadNotes(); // Execute the notes loading function
  }, []); // Empty dependency array means this runs once on mount

  // Available subjects for filtering
  // Predefined list of academic subjects
  const subjects = [
    "All", // Option to show all subjects
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
  ];

  // Filter notes based on search term and selected subject
  // Returns only notes that match both search criteria and subject filter
  const filteredNotes = notes.filter((note: Note) => {
    // Check if note matches search term (case-insensitive)
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Search in title
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) || // Search in content
      note.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()) // Search in tags
      );

    // Check if note matches selected subject filter
    const matchesSubject =
      selectedSubject === "All" || note.subject === selectedSubject; // Show all or specific subject

    // Return true only if note matches both search and subject criteria
    return matchesSearch && matchesSubject;
  });

  // Function to format date strings into readable format
  // Converts ISO date strings to localized date format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", // Abbreviated month name
      day: "numeric", // Numeric day
      year: "numeric", // Numeric year
    });
  };

  return (
    <div className="space-y-6">
      {/* Main container with spacing */}
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Responsive header layout */}
        <div>
          {/* Left side - title and description */}
          <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
          {/* Page title */}
          <p className="text-gray-600">
            {/* Page description */}
            Manage and organize your academic notes
          </p>
        </div>
        {/* Right side - new note button */}
        <Link to="/notes/new" className="btn-primary inline-flex items-center mt-4 sm:mt-0">
          {/* Link to create new note */}
          <span className="sr-only">Create new note</span>
          <PlusIcon className="w-5 h-5 mr-2" />
          {/* Plus icon */}
          New Note
          {/* Button text */}
        </Link>
      </div>

      {/* Search and Filters Section */}
      <div className="card">
        {/* Search and filters card */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Responsive layout for search and filters */}
          {/* Search Input */}
          <div className="flex-1 relative">
            {/* Search container with relative positioning */}
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {/* Search icon positioned absolutely */}
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {/* Filters */}
          <div className="flex gap-2">
            {/* Filter controls container */}
            {/* Subject Filter Dropdown */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {/* Subject option */}
                  {subject}
                </option>
              ))}
            </select>
            {/* Additional Filters Button */}
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              {/* Filter button */}
              <FunnelIcon className="w-5 h-5 text-gray-600" />
              {/* Filter icon */}
            </button>
          </div>
        </div>
      </div>

      {/* Conditional Content Rendering */}
      {loading ? (
        // Show loading state if notes are being fetched
        <div className="card text-center py-12">
          {/* Loading card */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          {/* Loading spinner */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading notes...</h3>
          {/* Loading title */}
        </div>
      ) : filteredNotes.length > 0 ? (
        // Show notes grid if notes exist
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Responsive notes grid */}
          {filteredNotes.map((note) => (
            // Map through filtered notes
            <div key={note._id} className="card hover:shadow-lg transition-shadow cursor-pointer">
              {/* Unique key for each note */}
              {/* Note card with hover effects */}
              <div className="p-6">
                {/* Note card content */}
                {/* Note Header */}
                <div className="flex items-start justify-between mb-3">
                  {/* Title and bookmark layout */}
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {/* Note title with line clamping */}
                    {note.title}
                  </h3>
                  {/* Bookmark Button */}
                  <button
                    className={`p-1 rounded ${
                      note.isBookmarked
                        ? "text-yellow-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {/* Yellow for bookmarked; gray otherwise */}
                    <BookmarkIcon className="w-5 h-5" />
                    {/* Bookmark icon */}
                  </button>
                </div>

                {/* Note Content Preview */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {/* Note content with line clamping */}
                  {note.content}
                </p>

                {/* Note Metadata */}
                <div className="flex items-center justify-between mb-3">
                  {/* Subject and date layout */}
                  {/* Subject Badge */}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {/* Subject styling */}
                    {note.subject}
                  </span>
                  {/* Last Updated Date */}
                  <span className="text-xs text-gray-500">
                    {/* Date styling */}
                    {formatDate(note.updatedAt)}
                    {/* Formatted date */}
                  </span>
                </div>

                {/* Tags Section */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {/* Tags container */}
                  {note.tags.slice(0, 3).map((tag) => (
                    // Show first 3 tags
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                      {/* Tag styling */}
                      {tag}
                    </span>
                  ))}
                  {/* Show count of additional tags if more than 3 exist */}
                  {note.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">
                      {/* Additional tags count */}
                      +{note.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Note Actions */}
                <div className="flex items-center justify-between">
                  {/* Actions layout */}
                  {/* Edit Link */}
                  <Link
                    to={`/notes/${note._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    {/* Link styling */}
                    Edit Note
                  </Link>
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* Action buttons container */}
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      {/* Document action */}
                      <DocumentTextIcon className="w-4 h-4" />
                      {/* Document icon */}
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      {/* Calendar action */}
                      <CalendarIcon className="w-4 h-4" />
                      {/* Calendar icon */}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State - Show when no notes exist
        <div className="card text-center py-12">
          {/* Empty state card */}
          <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          {/* Empty state icon */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          {/* Empty state title */}
          <p className="text-gray-600 mb-6">
            {/* Empty state description */}
            Create your first note to get started with AI-powered summarization
            and study tools.
          </p>
          {/* Create First Note Button */}
          <Link to="/notes/new" className="btn-primary inline-flex items-center">
            {/* Link to create new note */}
            <PlusIcon className="w-5 h-5 mr-2" />
            {/* Plus icon */}
            Create Your First Note
            {/* Button text */}
          </Link>
        </div>
      )}
    </div>
  );
};

// Export the Notes component as default
export default Notes;
