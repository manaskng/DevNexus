import React from "react";
import { FiEdit, FiTrash2, FiClock } from "react-icons/fi";
import { BsPinFill, BsPin } from "react-icons/bs";

function NoteCard({ note, onEdit, onDelete, onPin }) {
  const getPreviewText = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div 
      className={`
        relative flex flex-col justify-between h-[280px] cursor-pointer group 
        rounded-2xl border transition-all duration-300 ease-out
        bg-white dark:bg-[#1e293b]
        ${note.isPinned 
          ? 'border-indigo-200 ring-1 ring-indigo-50 dark:border-indigo-500/30 dark:ring-indigo-500/10 shadow-indigo-100 dark:shadow-none' 
          : 'border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
        }
        shadow-sm hover:shadow-xl hover:-translate-y-1
      `}
      onClick={() => onEdit(note)}
    >
      {/* Pinned Badge (Visual Flair) */}
      {note.isPinned && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-indigo-500/10 border-l-transparent rounded-tr-2xl pointer-events-none"></div>
      )}

      <div className="p-6 flex-1 overflow-hidden">
        {/* Header: Title & Pin */}
        <div className="flex justify-between items-start mb-3 gap-2">
          <h3 className={`text-xl font-bold line-clamp-2 leading-tight transition-colors ${
            note.isPinned 
              ? 'text-indigo-700 dark:text-indigo-400' 
              : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
          }`}>
            {note.title || "Untitled Note"}
          </h3>
          
         
          <button 
            onClick={(e) => { e.stopPropagation(); onPin(note._id); }}
            className={`
              shrink-0 p-1.5 rounded-lg transition-all duration-200
              ${note.isPinned 
                ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 dark:text-indigo-300' 
                : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
              }
            `}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            {note.isPinned ? <BsPinFill size={16} /> : <BsPin size={16} />}
          </button>
        </div>

        {/* Description Preview - Modernized */}
        <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-5 font-medium">
           {getPreviewText(note.description) || <span className="italic opacity-50">No content...</span>}
        </div>
      </div>

      {/* Footer: Date & Actions */}
      <div className="px-6 py-4 mt-auto border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 rounded-b-2xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <FiClock size={12} />
          <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-1 group-hover:translate-y-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(note); }} 
            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400 rounded-md transition-colors"
            title="Edit"
          >
            <FiEdit size={15} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }} 
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-md transition-colors"
            title="Delete"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;