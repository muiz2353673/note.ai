import React, { useState } from "react";
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface Citation {
  id: string;
  title: string;
  authors: string;
  year: string;
  source: string;
  url?: string;
  doi?: string;
  format: "APA" | "MLA" | "Chicago" | "Harvard";
  generatedCitation: string;
}

const Citations: React.FC = () => {
  const [citations, setCitations] = useState<Citation[]>([
    {
      id: "1",
      title: "The Impact of Artificial Intelligence on Education",
      authors: "Smith, J., & Johnson, A.",
      year: "2023",
      source: "Journal of Educational Technology",
      url: "https://example.com/paper",
      doi: "10.1000/example.2023.001",
      format: "APA",
      generatedCitation:
        "Smith, J., & Johnson, A. (2023). The Impact of Artificial Intelligence on Education. Journal of Educational Technology, 45(2), 123-145. https://doi.org/10.1000/example.2023.001",
    },
    {
      id: "2",
      title: "Machine Learning in Academic Research",
      authors: "Brown, M., Davis, R., & Wilson, K.",
      year: "2022",
      source: "Computers & Education",
      format: "MLA",
      generatedCitation:
        'Brown, M., et al. "Machine Learning in Academic Research." Computers & Education, vol. 78, 2022, pp. 234-256.',
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    year: "",
    source: "",
    url: "",
    doi: "",
    format: "APA" as "APA" | "MLA" | "Chicago" | "Harvard",
  });

  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.authors ||
      !formData.year ||
      !formData.source
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setGenerating(true);
    try {
     
     

     
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let generatedCitation = "";
      switch (formData.format) {
        case "APA":
          generatedCitation = `${formData.authors} (${formData.year}). ${
            formData.title
          }. ${formData.source}${formData.doi ? `, ${formData.doi}` : ""}${
            formData.url ? ` ${formData.url}` : ""
          }`;
          break;
        case "MLA":
          generatedCitation = `${formData.authors}. "${formData.title}." ${
            formData.source
          }, ${formData.year}${formData.url ? `, ${formData.url}` : ""}`;
          break;
        case "Chicago":
          generatedCitation = `${formData.authors}. "${formData.title}." ${
            formData.source
          } (${formData.year})${formData.url ? `: ${formData.url}` : ""}`;
          break;
        case "Harvard":
          generatedCitation = `${formData.authors} (${formData.year}) '${
            formData.title
          }', ${formData.source}${
            formData.url
              ? `, viewed ${new Date().toLocaleDateString()}, ${formData.url}`
              : ""
          }`;
          break;
      }

      const newCitation: Citation = {
        id: Date.now().toString(),
        ...formData,
        generatedCitation,
      };

      setCitations((prev) => [newCitation, ...prev]);
      setFormData({
        title: "",
        authors: "",
        year: "",
        source: "",
        url: "",
        doi: "",
        format: "APA",
      });
      setShowForm(false);
      toast.success("Citation generated successfully!");
    } catch (error) {
      toast.error("Failed to generate citation");
    } finally {
      setGenerating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Citation copied to clipboard!");
  };

  const deleteCitation = (id: string) => {
    setCitations((prev) => prev.filter((citation) => citation.id !== id));
    toast.success("Citation deleted");
  };

  const generateFromURL = async () => {
    if (!formData.url) {
      toast.error("Please enter a URL");
      return;
    }

    setGenerating(true);
    try {
     
     

     
      await new Promise((resolve) => setTimeout(resolve, 3000));

     
      setFormData((prev) => ({
        ...prev,
        title: "Automatically Extracted Title",
        authors: "Author, A., & Author, B.",
        year: "2024",
        source: "Journal of Example Studies",
      }));

      toast.success("Information extracted from URL!");
    } catch (error) {
      toast.error("Failed to extract information from URL");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
     
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citations</h1>
          <p className="text-gray-600">
            Generate proper citations in multiple formats
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Citation
        </button>
      </div>

     
      {showForm && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generate New Citation
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authors *
                </label>
                <input
                  type="text"
                  name="authors"
                  value={formData.authors}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Smith, J., & Johnson, A."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  placeholder="2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  name="source"
                  value={formData.source}
                  onChange={handleInputChange}
                  required
                  placeholder="Journal name, book title, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="APA">APA</option>
                  <option value="MLA">MLA</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Harvard">Harvard</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL (optional)
                </label>
                <div className="flex">
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/paper"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={generateFromURL}
                    disabled={generating || !formData.url}
                    className="px-4 py-2 bg-gray-600 text-white rounded-r-lg hover:bg-gray-700 disabled:opacity-50"
                  >
                    <SparklesIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DOI (optional)
                </label>
                <input
                  type="text"
                  name="doi"
                  value={formData.doi}
                  onChange={handleInputChange}
                  placeholder="10.1000/example.2024.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={generating}
                className="btn-primary disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Citation"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

     
      {citations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Citations
          </h3>
          <div className="space-y-4">
            {citations.map((citation) => (
              <div key={citation.id} className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {citation.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {citation.authors} ({citation.year}) • {citation.source}
                    </p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {citation.format}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCitation(citation.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 font-mono">
                    {citation.generatedCitation}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(citation.generatedCitation)}
                    className="btn-secondary inline-flex items-center text-sm"
                  >
                    <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                    Copy
                  </button>
                  <button className="btn-secondary inline-flex items-center text-sm">
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No citations yet
          </h3>
          <p className="text-gray-600 mb-6">
            Generate your first citation to get started with proper academic
            referencing.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Your First Citation
          </button>
        </div>
      )}
    </div>
  );
};

export default Citations;
