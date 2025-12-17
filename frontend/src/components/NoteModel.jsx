import React, { useEffect, useState } from "react";
import axios from "axios";
import RichTextEditor from "./RichTextEditor";
import { FiX } from "react-icons/fi";

function NoteModel({ isOpen, onClose, note, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(note ? note.title : "");
      setDescription(note ? note.description : "");
      setError("");
    }
  }, [isOpen, note]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { title, description }; // No tags logic here
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const baseURL = import.meta.env.VITE_API_URL;

      let savedNote;
      if (note) {
        const { data } = await axios.put(`${baseURL}/api/notes/${note._id}`, payload, config);
        savedNote = data;
      } else {
        const { data } = await axios.post(`${baseURL}/api/notes`, payload, config);
        savedNote = data;
      }

      onSave(savedNote);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50/80">
           <h2 className="text-xl font-bold text-gray-800">
             {note ? "Edit Note" : "Create New Note"}
           </h2>
           <button 
             onClick={onClose} 
             className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors"
           >
             <FiX size={24}/>
           </button>
        </div>

        {error && <div className="bg-red-50 text-red-500 px-6 py-3 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden p-6 space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg placeholder-gray-400 transition-all"
          />
          
          <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 transition-all bg-white">
            <RichTextEditor
              content={description}
              onChange={(newContent) => setDescription(newContent)}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Saving..." : (note ? "Update Note" : "Create Note")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModel;