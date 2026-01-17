import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiPlus, FiSearch, FiFileText, FiLoader, FiEdit3, FiTrash2, FiArrowLeft 
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

  // --- LIST ITEM COMPONENT ---
  const DocListItem = ({ note }) => (
    <div 
      onClick={() => handleNoteSelect(note)}
      // UPDATED HOVER COLORS for better contrast against new gray background
      className={`
        group flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all border
        ${selectedNote?._id === note._id 
          ? 'bg-white border-indigo-200 shadow-sm dark:bg-indigo-900/20 dark:border-indigo-500/30' 
          : 'bg-transparent border-transparent hover:bg-white/60 dark:hover:bg-white/5'
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`p-2 rounded-md shrink-0 ${note.isPinned ? 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/20' : 'text-slate-500 bg-slate-200/50 dark:bg-slate-800'}`}>
           <FiFileText size={16} />
        </div>
        <div className="min-w-0">
           <h4 className={`text-sm font-medium truncate ${selectedNote?._id === note._id ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
             {note.title}
           </h4>
           <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
             {new Date(note.updatedAt).toLocaleDateString()}
           </span>
        </div>
      </div>
      {note.isPinned && <BsPinFill className="text-indigo-400 text-xs shrink-0" />}
    </div>
  );

  return (
    // Main container background matches the Right Panel for seamless edges
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-[#0b1121]">
      
      {/* ---------------- LEFT PANEL (LIST) ---------------- */}
      <div className={`
          flex-col border-r border-slate-200 dark:border-white/5
          w-full md:w-80 h-full shrink-0
          ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}
          /* COLOR CHANGE HERE: Darker gray in light mode, slightly lighter in dark mode */
          bg-slate-100 dark:bg-[#151b2e]
      `}>
        
        {/* Header */}
        <div className="p-4 shrink-0 border-b border-slate-200 dark:border-white/5">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-wider">
                Explorer
                <span className="text-[10px] font-normal text-slate-500 bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded-full">
                  {notes.length}
                </span>
              </h2>
              <button 
                onClick={() => { setSelectedNote(null); setIsModalOpen(true); }}
                className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors shadow-sm"
              >
                <FiPlus size={16} />
              </button>
           </div>
           
           <div className="relative">
             <FiSearch className="absolute left-3 top-2.5 text-slate-500 dark:text-slate-400 text-xs" />
             {/* Input background contrast tweaked */}
             <input 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Search..."
               className="w-full bg-white dark:bg-[#0b1121] border border-slate-200 dark:border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all shadow-sm"
             />
           </div>
        </div>

        {/* Scrollable List Container */}
        {/* Background matches parent Left Panel */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 min-h-0 bg-slate-100 dark:bg-[#151b2e]">
          {loading ? (
             <div className="flex justify-center py-10"><FiLoader className="animate-spin text-slate-400"/></div>
          ) : filteredNotes.length === 0 ? (
             <div className="text-center py-10 text-xs text-slate-500 dark:text-slate-400">No docs found</div>
          ) : (
             filteredNotes.map(note => <DocListItem key={note._id} note={note} />)
          )}
        </div>
      </div>

      {/* ---------------- RIGHT PANEL (CONTENT) ---------------- */}
      {/* Keeps the cleanest, brightest background for readability */}
      <div className={`
         flex-1 flex-col h-full overflow-hidden 
         bg-white dark:bg-[#0b1121]
         ${mobileView === 'detail' ? 'flex' : 'hidden md:flex'}
      `}>
        {selectedNote ? (
          <>
            {/* Toolbar */}
            <div className="h-16 shrink-0 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-[#0b1121]">
               <div className="flex items-center gap-3 overflow-hidden">
                  <button 
                    onClick={handleBackToList}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full"
                  >
                    <FiArrowLeft size={20} />
                  </button>

                  <div className="min-w-0">
                      <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md flex items-center gap-2">
                        {selectedNote.title}
                      </h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400 hidden md:flex items-center gap-2 mt-0.5">
                        Last edited {new Date(selectedNote.updatedAt).toLocaleDateString()}
                      </p>
                  </div>
               </div>
               
               <div className="flex items-center gap-1 shrink-0">
                  <button onClick={(e) => handlePin(e, selectedNote)} className={`p-2 rounded-md ${selectedNote.isPinned ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                    {selectedNote.isPinned ? <BsPinFill size={16}/> : <BsPinAngle size={16}/>}
                  </button>
                  <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">
                    <FiTrash2 size={16}/>
                  </button>
                  <div className="h-5 w-px bg-slate-200 dark:bg-white/10 mx-1 md:mx-3"></div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-md shadow-sm active:scale-95 transition-all"
                  >
                    <FiEdit3 /> <span className="hidden md:inline">Edit</span>
                  </button>
               </div>
            </div>

            {/* Content Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 pb-32 min-h-0">
               <div className="max-w-3xl mx-auto">
                 <div 
                   className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-7 prose-img:rounded-xl prose-img:shadow-lg prose-img:max-w-full prose-img:h-auto prose-img:block prose-a:text-indigo-600"
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNote.description) }} 
                 />
               </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-[#0b1121]">
             <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                <FiFileText size={32} className="opacity-50"/>
             </div>
             <p className="text-sm font-medium">Select a document to view</p>
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