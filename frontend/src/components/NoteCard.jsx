import React from "react";
import { FiFileText, FiClock, FiEdit3, FiTrash2, FiImage } from "react-icons/fi";
import { BsPinFill, BsPinAngle } from "react-icons/bs";

function NoteCard({ note, onEdit, onDelete, onPin }) {
  
  const getPreview = (html) => {
    if (!html) return "No content...";
    
    // Check for image tags
    const hasImage = html.includes("<img");
    
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    
    if (text.trim().length === 0 && hasImage) {
      return (
        <span className="flex items-center gap-1 text-indigo-500 font-medium">
          <FiImage /> Image Attachment
        </span>
      );
    }
    
    return text || "No content...";
  };

  
  const dateStr = note.updatedAt 
    ? new Date(note.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
    : "Just now";

  // Badge Logic
  const getTypeBadge = (title) => {
    const t = (title || "").toLowerCase();
    if(t.includes('api') || t.includes('spec')) return { label: 'SPEC', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300' };
    if(t.includes('bug') || t.includes('fix')) return { label: 'FIX', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' };
    if(t.includes('plan') || t.includes('road')) return { label: 'PLAN', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' };
    return null;
  };

  const badge = getTypeBadge(note.title);

  return (
    <div 
      onClick={() => onEdit(note)}
      className={`
        group relative flex flex-col h-60 cursor-pointer rounded-xl border transition-all duration-300
        bg-white dark:bg-[#1e293b]
        ${note.isPinned 
          ? 'border-indigo-200 dark:border-indigo-500/30 ring-1 ring-indigo-50 dark:ring-indigo-500/10' 
          : 'border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg'
        }
      `}
    >
      <div className={`h-1 w-full rounded-t-xl ${note.isPinned ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-indigo-400 transition-colors'}`}></div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
           <div className="flex items-center gap-3 overflow-hidden">
              <div className={`p-2 rounded-lg shrink-0 ${note.isPinned ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                 <FiFileText size={20} />
              </div>
              <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 dark:text-white truncate text-lg">
                    {note.title || "Untitled Doc"}
                  </h3>
                  {badge && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge.color}`}>{badge.label}</span>}
              </div>
           </div>
           
           <button 
             onClick={(e) => { 
                e.stopPropagation(); 
                if(note._id) onPin(note._id); 
             }}
             className={`p-1.5 rounded-lg transition-colors ${note.isPinned ? 'text-indigo-500' : 'text-slate-300 hover:text-slate-500 dark:hover:text-slate-400'}`}
           >
             {note.isPinned ? <BsPinFill /> : <BsPinAngle />}
           </button>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium opacity-90">
          {getPreview(note.description)}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
           <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
             <FiClock size={12}/> {dateStr}
           </div>
           
           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onDelete(note._id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors">
                <FiTrash2 size={14}/>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;