import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiPlus, FiSearch, FiFileText, FiLoader, FiEdit3, FiClock, FiTrash2, FiMoreVertical 
} from "react-icons/fi";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import DOMPurify from 'dompurify'; // Ensure you have this: npm install dompurify
import NoteModel from "./NoteModel";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); // Determines what shows in Right Pane
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Sort: Pinned first, then updated recently
      const sorted = data.sort((a, b) => (b.isPinned - a.isPinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
      setNotes(sorted);
      
      // Auto-select the first note if none selected
      if (!selectedNote && sorted.length > 0) setSelectedNote(sorted[0]);
    } catch (error) {
      console.error("Error fetching docs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  // --- ACTIONS ---
  const handleSave = (savedNote) => {
    // Optimistic Update
    const exists = notes.some(n => n._id === savedNote._id);
    const updatedList = exists 
      ? notes.map(n => n._id === savedNote._id ? savedNote : n)
      : [savedNote, ...notes];
    
    setNotes(updatedList);
    setSelectedNote(savedNote); // Auto-switch view to the edited note
  };

  const handlePin = async (e, note) => {
    e.stopPropagation();
    const newStatus = !note.isPinned;
    // Optimistic
    const updated = notes.map(n => n._id === note._id ? { ...n, isPinned: newStatus } : n);
    setNotes(updated);
    if(selectedNote?._id === note._id) setSelectedNote({ ...selectedNote, isPinned: newStatus });

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/notes/${note._id}/pin`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) { fetchNotes(); }
  };

  const handleDelete = async () => {
    if (!selectedNote || !window.confirm("Delete this document permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/notes/${selectedNote._id}`, { headers: { Authorization: `Bearer ${token}` } });
      
      const remaining = notes.filter(n => n._id !== selectedNote._id);
      setNotes(remaining);
      setSelectedNote(remaining.length > 0 ? remaining[0] : null);
    } catch (err) { console.error("Delete failed"); }
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  // --- SUB-COMPONENT: LIST ITEM (Left Pane) ---
  const DocListItem = ({ note }) => (
    <div 
      onClick={() => setSelectedNote(note)}
      className={`
        group flex items-center justify-between p-4 mb-2 rounded-xl cursor-pointer transition-all border
        ${selectedNote?._id === note._id 
          ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-500/30 shadow-sm' 
          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-lg shrink-0 ${note.isPinned ? 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/20' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
           <FiFileText />
        </div>
        <div className="min-w-0">
           <h4 className={`text-sm font-semibold truncate ${selectedNote?._id === note._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
             {note.title}
           </h4>
           <span className="text-[10px] text-slate-400 flex items-center gap-1">
             {new Date(note.updatedAt).toLocaleDateString()}
           </span>
        </div>
      </div>
      {note.isPinned && <BsPinFill className="text-indigo-400 text-xs shrink-0" />}
    </div>
  );

  return (
    <div className="flex h-full max-h-screen overflow-hidden bg-white dark:bg-[#0b1121]">
      
      {/* ---------------- LEFT PANEL: LIST ---------------- */}
      <div className="w-80 shrink-0 border-r border-slate-200 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-[#0b1121]">
        
        {/* Header & Search */}
        <div className="p-5 border-b border-slate-200 dark:border-white/5">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FiFileText className="text-indigo-500"/> Docs
                <span className="text-xs font-normal text-slate-400 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {notes.length}
                </span>
              </h2>
              <button 
                onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-md"
              >
                <FiPlus />
              </button>
           </div>
           
           <div className="relative">
             <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Filter docs..."
               className="w-full bg-white dark:bg-[#151b2e] border border-slate-200 dark:border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
             />
           </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
          {loading ? (
             <div className="flex justify-center py-10"><FiLoader className="animate-spin text-slate-400"/></div>
          ) : filteredNotes.length === 0 ? (
             <div className="text-center py-10 text-xs text-slate-400">No docs found</div>
          ) : (
             filteredNotes.map(note => <DocListItem key={note._id} note={note} />)
          )}
        </div>
      </div>

      {/* ---------------- RIGHT PANEL: PREVIEW ---------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#0b1121]">
        {selectedNote ? (
          <>
            {/* Toolbar */}
            <div className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-8 bg-white dark:bg-[#0b1121]">
               <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {selectedNote.title}
                  </h1>
                  <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Last edited {new Date(selectedNote.updatedAt).toLocaleDateString()}
                  </p>
               </div>
               
               <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => handlePin(e, selectedNote)}
                    className={`p-2 rounded-lg transition-colors ${selectedNote.isPinned ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    title="Pin Document"
                  >
                    {selectedNote.isPinned ? <BsPinFill /> : <BsPinAngle />}
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                  <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-transform active:scale-95"
                  >
                    <FiEdit3 size={16} /> Edit Doc
                  </button>
               </div>
            </div>

            {/* Content Render (Read-Only) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
               <div className="max-w-4xl mx-auto">
                 {/* Using DOMPurify to safely render HTML content */}
                 <div 
                   className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-a:text-indigo-600"
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNote.description) }} 
                 />
               </div>
            </div>
          </>
        ) : (
          /* Empty State (Right Pane) */
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <FiFileText size={32} className="opacity-50"/>
             </div>
             <p className="text-sm font-medium">Select a document to view</p>
          </div>
        )}
      </div>

      {/* Editor Modal (Reused) */}
      <NoteModel 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        note={selectedNote} // If null, creates new
        onSave={handleSave} 
      />
    </div>
  );
}

export default NoteList;