import React from "react";
import { FiEdit, FiTrash2, FiClock } from "react-icons/fi";
import { BsPinFill, BsPin } from "react-icons/bs";

function NoteCard({ note, onEdit, onDelete, onPin }) {
  return (
    <div 
      className={`
        bg-white dark:bg-[#1e293b] 
        p-6 rounded-xl border shadow-md hover:shadow-xl transition-all duration-300 
        flex flex-col justify-between h-[260px] cursor-pointer group relative 
        ${note.isPinned 
          ? 'border-blue-200 ring-1 ring-blue-50 dark:border-blue-500/30 dark:ring-blue-500/10' 
          : 'border-slate-200 dark:border-white/5'
        }
      `}
      onClick={() => onEdit(note)}
    >
      <div>
        {/* Header: Title & Pin */}
        <div className="flex justify-between items-start mb-3">
          <h3 className={`text-xl font-bold line-clamp-1 transition-colors ${
            note.isPinned 
              ? 'text-blue-700 dark:text-blue-400' 
              : 'text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`}>
            {note.title || "Untitled Note"}
          </h3>
          
          {/* Top Pin Button */}
          {note.isPinned && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPin(note._id); }}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 p-1 rounded transition-colors"
              title="Unpin Note"
            >
              <BsPinFill className="shrink-0" size={18} />
            </button>
          )}
        </div>

        {/* Description Preview */}
        <div 
          className="prose prose-sm max-w-none text-gray-500 dark:text-gray-400 line-clamp-5 leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: note.description }} 
        />
      </div>

      {/* Footer: Date & Actions */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
        <div className="flex items-center gap-1.5 font-medium">
          <FiClock size={14} />
          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        </div>

        {/* Hover Actions */}
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            onClick={(e) => { e.stopPropagation(); onPin(note._id); }} 
            className={`p-2 rounded-full transition-colors ${
              note.isPinned 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-300' 
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-white/10'
            }`}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            {note.isPinned ? <BsPinFill size={16} /> : <BsPin size={16} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(note); }} 
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 dark:hover:bg-green-500/10 rounded-full transition-colors"
            title="Edit"
          >
            <FiEdit size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(note._id); }} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-full transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;