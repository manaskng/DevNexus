import React, { useState } from 'react';
import Editor from "@monaco-editor/react";
import { FiLoader, FiCopy, FiCheck } from 'react-icons/fi';

const CodeEditor = ({ code, language, onChange, theme = "vs-dark" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🛠️ HELPER: Get correct extension based on language
  const getFileName = (lang) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift'
    };
    return `main.${extensions[lang] || 'txt'}`;
  };

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#1e1e1e]">
      
      {/*  Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-[#252526] border-b border-slate-200 dark:border-white/5 select-none shrink-0">
        
        <div className="flex items-center gap-4">
          {/* Mac Buttons */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 transition-colors shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 transition-colors shadow-sm"></div>
          </div>
          
          {/*  DYNAMIC FILE NAME */}
          <div className="flex items-center space-x-2 text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
             <span className="uppercase text-indigo-500 font-bold">{language}</span>
             <span className="opacity-30">/</span>
             <span>{getFileName(language)}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button 
          onClick={handleCopy}
          className={`
            text-[10px] font-bold px-3 py-1 rounded-md flex items-center gap-2 border transition-all
            ${copied 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : 'bg-white dark:bg-white/5 text-slate-500 border-slate-200 dark:border-white/10 hover:text-indigo-500'
            }
          `}
        >
          {copied ? <FiCheck size={12}/> : <FiCopy size={12}/>}
          <span>{copied ? 'SYNCED' : 'COPY'}</span>
        </button>
      </div>

      {/*  Monaco Editor Surface */}
      <div className="flex-1 relative min-h-0">
        <Editor
          height="100%"
          language={language === 'c' || language === 'cpp' ? 'cpp' : language}
          value={code}
          onChange={onChange}
          theme={theme}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            wordWrap: "on",
            padding: { top: 20, bottom: 20 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            lineNumbersMinChars: 4,
            renderLineHighlight: "line",
          }}
          loading={
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-[#1e1e1e]">
               <FiLoader className="animate-spin text-2xl" /> 
               <span className="text-xs font-mono">Initializing Neural Engine...</span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;