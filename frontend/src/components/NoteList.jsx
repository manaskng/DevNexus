import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { 
  FiPlus, FiSearch, FiFileText, FiLoader, FiEdit3, FiTrash2, FiArrowLeft, FiLayout, FiSidebar
} from "react-icons/fi";
import { BsPinAngle, BsPinFill, BsJournalBookmarkFill } from "react-icons/bs";
import DOMPurify from 'dompurify'; 
import NoteModel from "./NoteModel";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState("list"); 
  
  const location = useLocation(); // 👈 2. Get the navigation state
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const sorted = data.sort((a, b) => (b.isPinned - a.isPinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
      setNotes(sorted);
      
      // 👈 3. INTELLIGENT SELECTION LOGIC
      // Check if we came from Search
      if (location.state?.selectedId) {
        const searchedNote = sorted.find(n => n._id === location.state.selectedId);
        if (searchedNote) {
          setSelectedNote(searchedNote);
          setMobileView("detail");
          return; // Stop here, don't select the first one
        }
      }

      // Fallback: Default to first note if on desktop
      if (window.innerWidth >= 768 && !selectedNote && sorted.length > 0) {
        setSelectedNote(sorted[0]);
      }

    } catch (error) {
      console.error("Error fetching docs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, [location.state]); // 👈 4. Re-run if location state changes

  // --- HANDLERS ---
  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setMobileView("detail");
  };

  const handleBackToList = () => setMobileView("list");

  const handleSave = (savedNote) => {
    const exists = notes.some(n => n._id === savedNote._id);
    const updatedList = exists 
      ? notes.map(n => n._id === savedNote._id ? savedNote : n)
      : [savedNote, ...notes];
    
    setNotes(updatedList);
    setSelectedNote(savedNote);
    setMobileView("detail"); 
  };

  const handlePin = async (e, note) => {
    e.stopPropagation();
    const newStatus = !note.isPinned;
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
      if (remaining.length === 0) setMobileView("list");
    } catch (err) { console.error("Delete failed"); }
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  // --- COMPONENT: LIST ITEM ---
  const DocListItem = ({ note }) => (
    <div 
      onClick={() => handleNoteSelect(note)}
      className={`
        group flex items-center justify-between p-3.5 mb-2 rounded-xl cursor-pointer transition-all border
        ${selectedNote?._id === note._id 
          ? 'bg-white border-indigo-200 shadow-md shadow-indigo-500/5 dark:bg-indigo-900/20 dark:border-indigo-500/30' 
          : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/5'
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`
          p-2 rounded-lg shrink-0 transition-colors
          ${note.isPinned 
            ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-500/20' 
            : 'text-slate-400 bg-white border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'
          }
        `}>
           <FiFileText size={16} />
        </div>
        <div className="min-w-0">
           <h4 className={`text-sm font-bold truncate ${selectedNote?._id === note._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
             {note.title}
           </h4>
           <span className="text-[10px] text-slate-400 block mt-0.5">
             {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
           </span>
        </div>
      </div>
      {note.isPinned && <BsPinFill className="text-indigo-400 text-xs shrink-0" />}
    </div>
  );

  // --- VIEW 1: EMPTY STATE ---
  if (!loading && notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 dark:bg-[#020617] animate-fade-in p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BsJournalBookmarkFill size={32} className="text-indigo-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Documentation Zero</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
            Your repository is empty. Create your first research paper, project roadmap, or code snippet collection to get started.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <FiPlus size={18} /> Create New Document
          </button>
        </div>
        <NoteModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} note={null} onSave={handleSave} />
      </div>
    );
  }

  // --- VIEW 2: MAIN SPLIT VIEW ---
  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* LEFT PANEL */}
      <div className={`
          flex-col border-r border-slate-200 dark:border-white/5
          w-full md:w-[320px] h-full shrink-0
          ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}
          bg-slate-50 dark:bg-[#0f172a] 
      `}>
        <div className="p-4 shrink-0">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FiLayout /> Explorer
              </h2>
              <button 
                onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}
                className="p-1.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-300 rounded-lg transition-colors"
              >
                <FiPlus size={16} />
              </button>
           </div>
           
           <div className="relative group">
             <FiSearch className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Filter docs..."
               className="w-full bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
             />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3">
          {loading ? (
             <div className="flex justify-center py-10"><FiLoader className="animate-spin text-indigo-500"/></div>
          ) : filteredNotes.length === 0 ? (
             <div className="text-center py-10 text-xs text-slate-400">No matching docs</div>
          ) : (
             filteredNotes.map(note => <DocListItem key={note._id} note={note} />)
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className={`
         flex-1 flex-col h-full overflow-hidden 
         bg-white dark:bg-[#020617]
         ${mobileView === 'detail' ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedNote ? (
          <>
            <div className="h-16 shrink-0 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 md:px-8 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-sm z-10">
               <div className="flex items-center gap-3 overflow-hidden">
                  <button onClick={handleBackToList} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full">
                    <FiArrowLeft size={18} />
                  </button>
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {selectedNote.title}
                  </h1>
               </div>
               
               <div className="flex items-center gap-1 shrink-0">
                  <button onClick={(e) => handlePin(e, selectedNote)} className={`p-2 rounded-lg transition-all ${selectedNote.isPinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    {selectedNote.isPinned ? <BsPinFill size={16}/> : <BsPinAngle size={16}/>}
                  </button>
                  <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                    <FiTrash2 size={16}/>
                  </button>
                  <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
                  <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow active:scale-95 transition-all">
                    <FiEdit3 /> <span className="hidden sm:inline">Edit</span>
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32 bg-white dark:bg-[#020617]">
               <div className="max-w-3xl mx-auto animate-fade-in-up">
                 <div 
                   className="prose prose-slate dark:prose-invert max-w-none 
                   prose-headings:font-bold prose-headings:tracking-tight
                   prose-p:leading-7 prose-p:text-slate-600 dark:prose-p:text-slate-300
                   prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                   prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-slate-100 dark:prose-img:border-white/10"
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNote.description) }} 
                 />
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-[#020617]">
             <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <FiSidebar size={24} className="opacity-30"/>
             </div>
             <p className="text-sm font-medium">Select a document to read</p>
          </div>
        )}
      </div>

      <NoteModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} note={selectedNote} onSave={handleSave} />
    </div>
  );
}

export default NoteList;