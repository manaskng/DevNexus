import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiSearch } from "react-icons/fi";
import NoteCard from "./NoteCard";
import NoteModel from "./NoteModel";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
   
  const API_URL = import.meta.env.VITE_API_URL;

  // --- HELPER: CENTRALIZED SORTING LOGIC ---
  const sortNotes = (notesList) => {
    return [...notesList].sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
      return a.isPinned ? -1 : 1;
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(sortNotes(data));
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLE SAVE (Create/Update) ---
  const handleSave = (savedNote) => {
    let updatedList;
    if (selectedNote) {
      updatedList = notes.map((n) => (n._id === savedNote._id ? savedNote : n));
    } else {
      updatedList = [savedNote, ...notes];
    }
    setNotes(sortNotes(updatedList));
  };

  // --- HANDLE PIN TOGGLE ---
  const handlePin = async (noteId) => {
    const noteToToggle = notes.find(n => n._id === noteId);
    if (!noteToToggle) return;

    const newPinStatus = !noteToToggle.isPinned;

    const optimisticList = notes.map(n => 
      n._id === noteId ? { ...n, isPinned: newPinStatus } : n
    );
    setNotes(sortNotes(optimisticList)); 

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/notes/${noteId}`, 
        { isPinned: newPinStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to toggle pin", error);
      fetchNotes(); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete note");
    }
  };

  const openNewNote = () => { setSelectedNote(null); setIsModalOpen(true); };
  const openEditNote = (note) => { setSelectedNote(note); setIsModalOpen(true); };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // CHANGED: p-8 to p-3 md:p-8 (Wider notes on mobile)
    <div className="p-3 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Notes</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">
            {filteredNotes.length} notes found
          </p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-64">
                <FiSearch className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
            </div>
            <button
              onClick={openNewNote}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-all active:scale-95"
            >
              <FiPlus size={20} />
              <span className="font-medium hidden sm:block">New Note</span>
            </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 dark:text-gray-500">Loading your thoughts...</div>
      ) : (
        <>
            {filteredNotes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 m-4">
                <p className="text-lg">No notes found matching "{search}"</p>
                <button onClick={openNewNote} className="text-blue-600 dark:text-blue-400 hover:underline mt-2">Create one now</button>
                </div>
            ) : (
                // CHANGED: gap-6 to gap-4 md:gap-6 (Less space between cards on mobile)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-20">
                {filteredNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={openEditNote}
                      onDelete={handleDelete}
                      onPin={handlePin}
                    />
                ))}
                </div>
            )}
        </>
      )}

      <NoteModel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        note={selectedNote}
        onSave={handleSave}
      />
    </div>
  );
}

export default NoteList;