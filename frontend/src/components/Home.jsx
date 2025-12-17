import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModel from "./NoteModel";
import NoteCard from "./NoteCard";
import { useLocation } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";

function Home() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in.");
          return;
        }

        const { data } = await axios.get(`${API_URL}/api/notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get("search") || "";

        const filteredNotes = search
          ? data.filter(
              (note) =>
                note.title.toLowerCase().includes(search.toLowerCase()) ||
                note.description.toLowerCase().includes(search.toLowerCase())
            )
          : data;
        
        const sortedNotes = filteredNotes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt));

        setNotes(sortedNotes);
      } catch (error) {
        setError("Failed to fetch notes");
        console.error(error);
      }
    };
    fetchNotes();
  }, [location.search, API_URL]);

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleSaveNote = (savedNote) => {
    let newNotes;
    if (editNote) {
      newNotes = notes.map((note) => (note._id === savedNote._id ? savedNote : note));
    } else {
      newNotes = [savedNote, ...notes];
    }
    newNotes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt));
    setNotes(newNotes);
    setEditNote(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      setError("Failed to delete note");
      console.error(error);
    }
  };

  const handlePinNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data: updatedNote } = await axios.put(
        `${API_URL}/api/notes/${id}/pin`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedNotes = notes.map((note) =>
        note._id === updatedNote._id ? updatedNote : note
      );

      updatedNotes.sort((a, b) => b.isPinned - a.isPinned || new Date(b.updatedAt) - new Date(a.updatedAt));
      
      setNotes(updatedNotes);
    } catch (error) {
      setError("Failed to update pin status");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <NoteModel
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => {
          setEditNote(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white text-3xl rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-transform hover:scale-110 z-50"
        aria-label="Create new note"
      >
        <FiPlus />
      </button>

      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Notes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {notes.length} notes found
          </p>
        </div>
        
        {/* Search Bar - Hidden here if Navbar search is used, but kept for standalone support */}
        {/* If you use the Navbar search, you might want to remove this block or keep it as local filter */}
        {/* I'll apply styles just in case you keep it */}
        <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter notes..."
                  // NOTE: 'search' state logic is usually driven by URL params in this component
                  // but kept as is from your provided code
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder-gray-400"
                />
            </div>
        </div>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={handlePinNote}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 m-4 py-16">
          <h2 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">No notes yet!</h2>
          <p className="mt-2 text-sm">Click the + button to create your first note.</p>
        </div>
      )}
    </div>
  );
}

export default Home;