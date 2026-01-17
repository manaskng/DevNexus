import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiPlus, FiSearch, FiFileText, FiLoader, FiEdit3, FiTrash2, FiArrowLeft, FiLayers, FiZap 
} from "react-icons/fi";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import DOMPurify from 'dompurify'; 
import NoteModel from "./NoteModel";

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [mobileView, setMobileView] = useState("list"); 
  
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = data.sort((a, b) => (b.isPinned - a.isPinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
      setNotes(sorted);
      
      // Only auto-select if we have notes
      if (window.innerWidth >= 768 && !selectedNote && sorted.length > 0) {
        setSelectedNote(sorted[0]);
      }
    } catch (error) {
      console.error("Error fetching docs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  // --- HANDLERS ---
  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setMobileView("detail");
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

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
        group flex items-center justify-between p-4 mb-2 rounded-2xl cursor-pointer transition-all border
        ${selectedNote?._id === note._id 
          ? 'bg-white border-indigo-200 shadow-md shadow-indigo-500/10 dark:bg-indigo-900/20 dark:border-indigo-500/30' 
          : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-white/5'
        }
      `}
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div className={`
          p-2.5 rounded-xl shrink-0 transition-colors
          ${note.isPinned 
            ? 'text-indigo-600 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-500/20' 
            : 'text-slate-500 bg-white shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
          }
        `}>
           <FiFileText size={18} />
        </div>
        <div className="min-w-0">
           <h4 className={`text-sm font-bold truncate mb-0.5 ${selectedNote?._id === note._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
             {note.title}
           </h4>
           <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
             {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
           </span>
        </div>
      </div>
      {note.isPinned && <BsPinFill className="text-indigo-400 text-xs shrink-0" />}
    </div>
  );

  // --- RENDER 1: EMPTY STATE (No Docs at all) ---
  if (!loading && notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 dark:bg-[#020617] animate-fade-in">
        <div className="max-w-md text-center p-8">
          <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6 border border-slate-100 dark:border-white/10">
            <FiLayers size={40} className="text-indigo-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">Start your Documentation</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Create your first project documentation, research note, or code snippet library. Everything is auto-saved.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <FiPlus size={20} /> Create First Document
          </button>
        </div>
        <NoteModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} note={null} onSave={handleSave} />
      </div>
    );
  }

  // --- RENDER 2: MAIN SPLIT VIEW ---
  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50 dark:bg-[#0b1121]">
      
      {/* LEFT PANEL (Explorer) */}
      <div className={`
          flex-col border-r border-slate-200 dark:border-white/5
          w-full md:w-[360px] h-full shrink-0
          ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}
          bg-slate-50/50 dark:bg-[#0f172a] 
      `}>
        {/* Header */}
        <div className="p-5 shrink-0">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-widest">
                Explorer
                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                  {notes.length}
                </span>
              </h2>
              <button 
                onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}
                className="p-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all shadow-sm"
              >
                <FiPlus size={18} />
              </button>
           </div>
           
           <div className="relative group">
             <FiSearch className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search documents..."
               className="w-full bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
             />
           </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3">
          {loading ? (
             <div className="flex justify-center py-10"><FiLoader className="animate-spin text-indigo-500"/></div>
          ) : filteredNotes.length === 0 ? (
             <div className="text-center py-10 text-xs text-slate-400 font-medium">No documents match your search</div>
          ) : (
             filteredNotes.map(note => <DocListItem key={note._id} note={note} />)
          )}
        </div>
      </div>

      {/* RIGHT PANEL (Content) */}
      <div className={`
         flex-1 flex-col h-full overflow-hidden 
         bg-white dark:bg-[#020617]
         ${mobileView === 'detail' ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedNote ? (
          <>
            {/* Toolbar */}
            <div className="h-20 shrink-0 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-sm z-10">
               <div className="flex items-center gap-4 overflow-hidden">
                  <button 
                    onClick={handleBackToList}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
                  >
                    <FiArrowLeft size={20} />
                  </button>

                  <div className="min-w-0">
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-xl">
                        {selectedNote.title}
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                           Updated {new Date(selectedNote.updatedAt).toLocaleDateString()}
                         </p>
                      </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 shrink-0">
                  <button onClick={(e) => handlePin(e, selectedNote)} className={`p-2.5 rounded-xl transition-all ${selectedNote.isPinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    {selectedNote.isPinned ? <BsPinFill size={18}/> : <BsPinAngle size={18}/>}
                  </button>
                  <button onClick={handleDelete} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all">
                    <FiTrash2 size={18}/>
                  </button>
                  <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
                  >
                    <FiEdit3 /> <span className="hidden md:inline">Edit Doc</span>
                  </button>
               </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32">
               <div className="max-w-4xl mx-auto animate-fade-in-up">
                 <div 
                   className="prose prose-lg prose-slate dark:prose-invert max-w-none 
                   prose-headings:font-bold prose-headings:tracking-tight
                   prose-p:leading-loose prose-p:text-slate-600 dark:prose-p:text-slate-300
                   prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                   prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-slate-200 dark:prose-img:border-white/10
                   prose-pre:bg-[#0f172a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl"
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNote.description) }} 
                 />
               </div>
            </div>
          </>
        ) : (
          /* "Select a Doc" Placeholder (Only shown if docs exist but none selected) */
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30 dark:bg-[#020617]">
             <div className="w-20 h-20 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <FiZap size={32} className="text-indigo-500/50"/>
             </div>
             <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Ready to work</h3>
             <p className="text-sm text-slate-500 dark:text-slate-500 max-w-xs text-center leading-relaxed">
               Select a document from the explorer to start reading or editing.
             </p>
          </div>
        )}
      </div>

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