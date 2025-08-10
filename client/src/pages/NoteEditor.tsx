import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  SparklesIcon,
  BookmarkIcon,
  TagIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { notesAPI, aiAPI } from "../services/api";

interface Note {
  id?: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  isBookmarked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note>({
    title: "",
    content: "",
    subject: "",
    tags: [],
    isBookmarked: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Literature",
    "Computer Science",
    "Economics",
    "Psychology",
    "Philosophy",
    "Other",
  ];

  const loadNote = useCallback(async () => {
    setLoading(true);
    try {
      const response = await notesAPI.getById(id!);
      const noteData = response.data.note;
      setNote({
        id: noteData._id,
        title: noteData.title || "",
        content: noteData.content || "",
        subject: noteData.subject || "",
        tags: noteData.tags || [],
        isBookmarked: noteData.isBookmarked || false,
        createdAt: noteData.createdAt,
        updatedAt: noteData.updatedAt,
      });
    } catch (error) {
      console.error("Failed to load note:", error);
      toast.error("Failed to load note");
     
      setNote({
        title: "",
        content: "",
        subject: "",
        tags: [],
        isBookmarked: false,
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id && id !== "new") {
      loadNote();
    }
  }, [loadNote, id]);

  const handleSave = async () => {
    if (!note || !note.title?.trim() || !note.content?.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    setSaving(true);
    try {
      const noteData = {
        title: note.title,
        content: note.content,
        subject: note.subject,
        tags: note.tags,
      };

      if (!id || id === "new") {
       
        await notesAPI.create(noteData);
        toast.success("Note created successfully!");
        navigate("/notes");
      } else {
       
        await notesAPI.update(id, noteData);
        toast.success("Note updated successfully!");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.error || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleAIAssist = async (action: string) => {
    if (!note || !note.content) {
      toast.error("Please add some content to your note first");
      return;
    }

    setAiLoading(true);
    try {
      let enhancedContent = note.content;

      switch (action) {
        case "summarize":
          const aiResponse = await aiAPI.summarize({
            content: note.content,
            style: "concise",
          });
          enhancedContent =
            "## AI Summary\n\n" +
            aiResponse.data.summary +
            "\n\n---\n\n" +
            note.content;
          break;
        case "expand":
         
          enhancedContent =
            note.content +
            "\n\n## AI Enhanced Content\n\nThis section provides additional context and explanations for the key concepts mentioned above...";
          break;
        case "structure":
          enhancedContent =
            "# " +
            note.title +
            "\n\n## Key Points\n\n" +
            note.content +
            "\n\n## Summary\n\n" +
            note.content.substring(0, 200) +
            "...";
          break;
      }

      setNote((prev) => ({ ...prev, content: enhancedContent }));
      toast.success("AI enhancement applied!");
    } catch (error: any) {
      console.error("AI assist error:", error);
      toast.error(error.response?.data?.error || "AI assistance failed");
    } finally {
      setAiLoading(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && note && !note.tags.includes(newTag.trim())) {
      setNote((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const toggleBookmark = () => {
    setNote((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
     
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/notes")}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id === "new" ? "Create New Note" : "Edit Note"}
            </h1>
            <p className="text-gray-600">
              {id === "new"
                ? "Start writing your academic notes"
                : "Update your note content"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg ${
              note.isBookmarked
                ? "text-yellow-600 bg-yellow-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <BookmarkIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <SparklesIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       
        <div className="lg:col-span-3 space-y-6">
         
          <div className="card">
            <input
              type="text"
              placeholder="Note title..."
              value={note.title}
              onChange={(e) =>
                setNote((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full text-2xl font-bold border-none outline-none bg-transparent"
            />
          </div>

         
          <div className="card">
            <textarea
              placeholder="Start writing your notes here..."
              value={note.content}
              onChange={(e) =>
                setNote((prev) => ({ ...prev, content: e.target.value }))
              }
              className="w-full h-96 resize-none border-none outline-none bg-transparent"
            />
          </div>
        </div>

       
        <div className="space-y-6">
         
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AcademicCapIcon className="w-5 h-5 mr-2" />
              Subject
            </h3>
            <select
              value={note.subject}
              onChange={(e) =>
                setNote((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

         
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TagIcon className="w-5 h-5 mr-2" />
              Tags
            </h3>
            <div className="space-y-3">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

         
          {showAIPanel && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="w-5 h-5 mr-2" />
                AI Assistant
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAIAssist("summarize")}
                  disabled={aiLoading || !note.content}
                  className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="font-medium">Summarize</div>
                  <div className="text-sm text-gray-600">
                    Create a concise summary
                  </div>
                </button>
                <button
                  onClick={() => handleAIAssist("expand")}
                  disabled={aiLoading || !note.content}
                  className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="font-medium">Expand</div>
                  <div className="text-sm text-gray-600">
                    Add more details and explanations
                  </div>
                </button>
                <button
                  onClick={() => handleAIAssist("structure")}
                  disabled={aiLoading || !note.content}
                  className="w-full p-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <div className="font-medium">Structure</div>
                  <div className="text-sm text-gray-600">
                    Organize with headings and sections
                  </div>
                </button>
              </div>
              {aiLoading && (
                <div className="mt-4 text-center">
                  <div className="spinner"></div>
                  <p className="text-sm text-gray-600 mt-2">
                    AI is processing...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
