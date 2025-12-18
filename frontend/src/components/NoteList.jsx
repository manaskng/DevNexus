import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiSearch, FiFileText, FiZap, FiEdit3 } from "react-icons/fi";
import { motion } from "framer-motion";
import NoteCard from "./NoteCard";
import NoteModel from "./NoteModel";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
   
  const API_URL = import.meta.env.VITE_API_URL;


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

  // --- NEW COMPONENT: COOL EMPTY STATE WITH IMAGE ---
  const EmptyNotesView = () => (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-12 py-10 min-h-[60vh] max-w-6xl mx-auto px-4">
      
      {/* Left Side: Content */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-center xl:text-left space-y-6 max-w-lg"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <FiZap /> Capture Ideas Instantly
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          Your Digital <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Second Brain</span>
        </h2>
        
        <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
          Don't let great ideas slip away. Create rich text notes with <strong>bold</strong>, <em>italics</em>, lists, and code blocks.
        </p>
  
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center xl:justify-start">
          <button 
            onClick={openNewNote}
            className="group inline-flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <FiPlus className="text-xl" /> Create First Note
          </button>
        </div>
      </motion.div>
  
      {/* Right Side: SLIDE-9 IMAGE VISUAL */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex-1 w-full max-w-md relative"
      >
        <div className="relative group">
            {/* Glow Effect - UPDATED: Lowered opacity (15/25) and inset (2) for subtler look */}
            <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-15 group-hover:opacity-25 transition-opacity animate-pulse"></div>
            
            {/* The Image (slide-9.png) */}
            <img 
              src="/slide-9.png" 
              alt="Rich Text Note Preview" 
              className="relative rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full object-cover transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1"
            />

            {/* Floating 'Rich Text' Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 hidden sm:block">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold">
                    <FiEdit3 />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">Editor Features</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Rich Text & Code Blocks</p>
                  </div>
               </div>
            </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    // CHANGED: p-8 to p-3 md:p-8 (Wider notes on mobile)
    <div className="p-3 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <FiFileText className="text-indigo-600 dark:text-indigo-400"/> My Notes
          </h1>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
            </div>
            <button
              onClick={openNewNote}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-indigo-700 shadow-md transition-all active:scale-95"
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
            {/* LOGIC: Total Notes 0? Show Cool Empty State. Search 0? Show Simple Text. */}
            {notes.length === 0 ? (
                <EmptyNotesView />
            ) : filteredNotes.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 m-4">
                   <p className="text-lg">No notes found matching "{search}"</p>
                   <button onClick={() => setSearch("")} className="text-indigo-600 dark:text-indigo-400 hover:underline mt-2">Clear Search</button>
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