import React, { useState } from "react";
import { FiCopy, FiCheck, FiEdit2, FiTrash2, FiExternalLink, FiActivity, FiCpu } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LanguageBadge = ({ lang }) => {
  const colors = {
    "c++": "bg-blue-600 text-white",
    "cpp": "bg-blue-600 text-white",
    "javascript": "bg-yellow-400 text-black",
    "python": "bg-blue-500 text-white",
    "java": "bg-orange-500 text-white",
    "react": "bg-cyan-500 text-black",
    "default": "bg-gray-600 text-white"
  };
  const key = lang?.toLowerCase() || "default";
  const colorClass = colors[key] || colors["default"];
  
  return (
    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-sm ${colorClass}`}>
      {lang || "TEXT"}
    </span>
  );
};

function SnippetCard({ snippet, onEdit, onDelete }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full group overflow-hidden relative">
      
      <div className="bg-gray-900 px-3 py-1.5 flex justify-between items-center select-none shrink-0">
        <div className="flex gap-1.5">
           <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
        </div>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
             copied ? "bg-green-500/20 text-green-400" : "bg-white/10 text-gray-400 hover:text-white"
          }`}
        >
          {copied ? <FiCheck size={12}/> : <FiCopy size={12}/>}
          {copied ? "COPIED" : "COPY"}
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-100 bg-white shrink-0">
          <div className="flex justify-between items-center mb-1.5">
             <div className="flex items-center gap-2 overflow-hidden">
                <h3 className="font-bold text-sm text-gray-800 line-clamp-1" title={snippet.title}>
                  {snippet.title}
                </h3>
                <LanguageBadge lang={snippet.language} />
             </div>
             
             <div className="flex gap-1 shrink-0">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(snippet); }} 
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                  title="Edit"
                >
                   <FiEdit2 size={14}/>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete(snippet._id); }} 
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                  title="Delete"
                >
                   <FiTrash2 size={14}/>
                </button>
             </div>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-hidden">
             <div className="flex gap-2 text-[10px] text-gray-500 font-mono">
                {(snippet.timeComplexity || snippet.spaceComplexity) ? (
                  <>
                    {snippet.timeComplexity && <span className="flex items-center gap-1"><FiActivity className="text-purple-500"/> {snippet.timeComplexity}</span>}
                    {snippet.spaceComplexity && <span className="flex items-center gap-1"><FiCpu className="text-emerald-500"/> {snippet.spaceComplexity}</span>}
                  </>
                ) : <span className="italic opacity-50">No complexity data</span>}
             </div>
             
             {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex gap-1 overflow-x-auto hide-scrollbar">
                   {snippet.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[9px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                         #{tag}
                      </span>
                   ))}
                </div>
             )}
          </div>
      </div>

      <div className="flex-1 bg-[#1e1e1e] relative overflow-hidden text-sm min-h-0">
        <div className="absolute inset-0 custom-scrollbar overflow-auto">
           <SyntaxHighlighter 
              language={snippet.language === "c++" ? "cpp" : snippet.language} 
              style={vscDarkPlus} 
              customStyle={{ 
                  margin: 0, 
                  padding: '1rem', 
                  background: 'transparent', 
                  fontSize: '0.85rem', 
                  lineHeight: '1.5',
                  minHeight: '100%'
              }}
              wrapLines={true}
              showLineNumbers={true}
           >
              {snippet.code}
           </SyntaxHighlighter>
        </div>
      </div>

      {snippet.problemLink && (
        <div className="px-2 py-1 bg-gray-50 border-t border-gray-100 text-[10px] shrink-0 text-right">
             <a href={snippet.problemLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline">
               <FiExternalLink size={10} /> View Problem
             </a>
        </div>
      )}

    </div>
  );
}

export default SnippetCard;