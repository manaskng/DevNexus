import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import { 
  FiCpu, FiWifi, FiPlay, FiChevronDown, FiActivity, FiTerminal, 
  FiLoader, FiLogOut, FiCopy, FiCheck, FiArrowRight, FiPlus, FiHash, FiSave, FiX, FiTag, FiFileText
} from "react-icons/fi";

// --- CUSTOM COMPONENTS ---
import PresenceBar from "./devspace/PresenceBar";
import CodeEditor from "./devspace/CodeEditor";

// --- SOCKET CONFIG ---
const socket = io(import.meta.env.VITE_API_URL, { 
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const LANGUAGES = [
  { id: "javascript", label: "JavaScript (Node)" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python 3" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
];

function DevSpace() {
  // --- UI STATE ---
  const [viewState, setViewState] = useState("lobby"); 
  const [mobileTab, setMobileTab] = useState("editor"); 
  const [activeSidebarTab, setActiveSidebarTab] = useState("ai"); 
  
  // 🔴 NEW: Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveForm, setSaveForm] = useState({ title: "", description: "", tags: "" });

  // --- SESSION STATE ---
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]); 
  const [typingUsers, setTypingUsers] = useState(new Map()); 
  const [roomCopied, setRoomCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  
  // --- CODE STATE ---
  const [code, setCode] = useState("// Welcome to DevSpace!\n// Select a language and start coding...");
  const [language, setLanguage] = useState("javascript");
  
  // --- FEATURES ---
  const [logs, setLogs] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]); 
  const [isCompiling, setIsCompiling] = useState(false);

  // Refs
  const roomIdRef = useRef("");
  const userNameRef = useRef("");
  const terminalRef = useRef(null);
  const logsRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Sync Refs
  useEffect(() => {
    roomIdRef.current = roomId;
    userNameRef.current = userName;
  }, [roomId, userName]);

  // --- SOCKET LOGIC ---
  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      if (roomIdRef.current && userNameRef.current) {
        socket.emit("join_room", { roomId: roomIdRef.current, userName: userNameRef.current });
      }
    };

    const onDisconnect = () => setIsConnected(false);
    const onRoomUpdate = (users) => setActiveUsers(users);
    
    const onUserTyping = ({ socketId, userName, isTyping }) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        if (isTyping) newMap.set(socketId, userName);
        else newMap.delete(socketId);
        return newMap;
      });
    };

    const onCodeUpdate = (newCode) => setCode(newCode);
    const onLangUpdate = (newLang) => setLanguage(newLang);
    
    const onActivityLog = (log) => {
      setLogs((prev) => [log, ...prev]);
      if (logsRef.current) logsRef.current.scrollTop = 0;
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("room_users_update", onRoomUpdate);
    socket.on("user_typing", onUserTyping);
    socket.on("code_update", onCodeUpdate);
    socket.on("language_update", onLangUpdate);
    socket.on("activity_log", onActivityLog);
    socket.on("load_previous_logs", (h) => setLogs(h.reverse()));

    return () => {
      if (roomIdRef.current && userNameRef.current) {
        socket.emit("leave_room", { roomId: roomIdRef.current, userName: userNameRef.current });
      }
      socket.disconnect();
      
      socket.off("connect"); socket.off("disconnect");
      socket.off("room_users_update"); socket.off("user_typing");
      socket.off("code_update"); socket.off("language_update");
      socket.off("activity_log"); socket.off("load_previous_logs");
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalOutput]);

  // --- ACTIONS ---
  const joinSession = (idToJoin) => {
    if (!userName.trim()) return alert("Enter Display Name");
    if (!idToJoin) return alert("Enter Room ID");

    setRoomId(idToJoin);
    socket.auth = { userName };
    socket.connect();
    socket.emit("join_room", { roomId: idToJoin, userName });
    
    setViewState("workspace");
    setLogs([]);
    setTerminalOutput([{ type: 'info', text: 'Terminal Ready...' }]);
  };

  const createRoom = () => {
    const newId = uuidv4().slice(0, 6).toUpperCase();
    setRoomId(newId);
    joinSession(newId);
  };

  const leaveRoom = () => {
    socket.emit("leave_room", { roomId, userName }); 
    socket.disconnect();
    setViewState("lobby");
    setCode("// Welcome...");
    setAiResponse(null);
    setTerminalOutput([]);
    setActiveUsers([]);
  };

  // --- 💾 OPEN SAVE MODAL ---
  const handleOpenSaveModal = () => {
    if (!code || code.length < 10) return alert("Code is too short to save.");
    
    // Pre-fill form with defaults
    setSaveForm({
      title: `DevSpace Session ${new Date().toLocaleTimeString()}`,
      description: `Collaborative session in Room ${roomId} with ${activeUsers.length} users.`,
      tags: "devspace, collab, " + language
    });
    
    setIsSaveModalOpen(true);
  };

  // --- 🚀 CONFIRM SAVE TO VAULT ---
  const handleConfirmSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Convert comma-separated string to array
      const tagsArray = saveForm.tags.split(',').map(t => t.trim()).filter(t => t);

      await axios.post(
        `${API_URL}/api/snippets`, 
        { 
          title: saveForm.title, 
          description: saveForm.description,
          tags: tagsArray,
          code, 
          language
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("✅ Saved to Vault!");
      socket.emit("trigger_action", { roomId, userName, actionType: `Saved snippet: ${saveForm.title}` });
      setIsSaveModalOpen(false);

    } catch (error) {
      console.error("Save Error:", error);
      alert("❌ Failed to save. Check fields or network.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("code_change", { roomId, code: value });
    socket.emit("typing_start", { roomId, userName });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => socket.emit("typing_stop", { roomId }), 1000);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("language_change", { roomId, language: newLang });
    socket.emit("trigger_action", { roomId, userName, actionType: `Switched to ${newLang}` });
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    setIsCompiling(true);
    setTerminalOutput(prev => [...prev, { type: 'info', text: `> Compiling ${language}...` }]);
    setActiveSidebarTab('ai');
    setMobileTab('tools'); 

    try {
      const token = localStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await axios.post(`${API_URL}/api/compiler/run`, { code, language }, { headers: { Authorization: `Bearer ${token}` } });
      const { run } = res.data;
      
      if (run.stdout) setTerminalOutput(prev => [...prev, { type: 'success', text: run.stdout }]);
      if (run.stderr) setTerminalOutput(prev => [...prev, { type: 'error', text: run.stderr }]);
      if (!run.stdout && !run.stderr) setTerminalOutput(prev => [...prev, { type: 'info', text: 'No output.' }]);
      
      socket.emit("trigger_action", { roomId, userName, actionType: `Ran ${language} code` });
    } catch (error) {
      setTerminalOutput(prev => [...prev, { type: 'error', text: 'Execution Failed.' }]);
    } finally {
      setIsCompiling(false);
    }
  };

  const handleAiAction = async (actionType) => {
    if (!code || code.length < 5) {
      setTerminalOutput(prev => [...prev, { type: 'error', text: 'Error: Code buffer is empty.' }]);
      setActiveSidebarTab('ai');
      setMobileTab('tools');
      return;
    }

    setIsAiLoading(true);
    setAiResponse(null);
    setActiveSidebarTab('ai'); 
    setMobileTab('tools');
    
    socket.emit("trigger_action", { roomId, userName, actionType: `Initiated AI: ${actionType}` });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/ai/process`, { code, action: actionType }, { headers: { Authorization: `Bearer ${token}` } });
      setAiResponse(res.data.result);
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("**Neural Engine Status: Standby**\n\nService is currently calibrating. Please retry.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // --- RENDER LOBBY ---
  if (viewState === "lobby") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in bg-slate-50 dark:bg-[#020617] relative overflow-hidden">
        <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 w-full max-w-md relative z-10">
           <div className="text-center mb-8">
             <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4"><FiCpu className="text-white" size={32} /></div>
             <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">DevSpace</h1>
             <p className="text-slate-500 dark:text-slate-400 font-medium">Collaborative Neural Environment</p>
           </div>
           <div className="mb-6">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Your Identity</label>
             <input className="w-full p-3.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold text-slate-700 dark:text-white" placeholder="Enter Display Name" value={userName} onChange={(e) => setUserName(e.target.value)} />
           </div>
           <div className="space-y-3">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Join Session</label>
             <div className="flex gap-2">
               <div className="relative flex-1">
                 <FiHash className="absolute left-3.5 top-3.5 text-slate-400" />
                 <input className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono font-bold text-slate-700 dark:text-white uppercase" placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value.toUpperCase())} />
               </div>
               <button onClick={() => joinSession(roomId)} className="px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center shadow-lg"><FiArrowRight size={20} /></button>
             </div>
           </div>
           <div className="my-6 flex items-center gap-3"><div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div><span className="text-xs font-bold text-slate-400 uppercase">OR</span><div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div></div>
           <button onClick={createRoom} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-3 group"><FiPlus className="group-hover:rotate-90 transition-transform duration-300" /> Create New Workspace</button>
        </div>
      </div>
    );
  }

  // --- RENDER WORKSPACE ---
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-[#020617] overflow-hidden p-3 md:p-6 gap-4 relative">
      
      {/* 1. TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:flex-none">
             <select value={language} onChange={handleLanguageChange} className="w-full md:w-48 appearance-none bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white text-xs font-bold px-4 py-3 rounded-xl cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
               {LANGUAGES.map(lang => <option key={lang.id} value={lang.id}>{lang.label}</option>)}
             </select>
             <FiChevronDown className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" size={14} />
           </div>

           <button onClick={handleRunCode} disabled={isCompiling} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${isCompiling ? 'bg-slate-200 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 active:scale-95'}`}>
              {isCompiling ? <FiLoader className="animate-spin"/> : <FiPlay fill="currentColor"/>} {isCompiling ? "Compiling..." : "Execute"}
           </button>

           {/* 💾 OPEN SAVE MODAL BUTTON */}
           <button onClick={handleOpenSaveModal} className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 hover:border-indigo-500 text-slate-500 dark:text-slate-400 hover:text-indigo-500 rounded-xl transition-all shadow-sm group">
              <FiSave size={18} className="group-hover:text-indigo-500"/>
              <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider">Save</span>
           </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Room:</span>
               <span className="text-xs font-mono font-bold text-indigo-500">{roomId}</span>
               <button onClick={() => {navigator.clipboard.writeText(roomId); setRoomCopied(true); setTimeout(() => setRoomCopied(false), 2000)}} className="ml-1 p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors">
                 {roomCopied ? <FiCheck className="text-emerald-500" size={14} /> : <FiCopy size={14} />}
               </button>
            </div>
            <button onClick={leaveRoom} className="px-4 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"><FiLogOut/> <span className="hidden sm:inline">Leave</span></button>
        </div>
      </div>

      {/* 2. MAIN LAYOUT */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0">
        <div className={`flex-1 flex flex-col min-w-0 ${mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
           <PresenceBar roomId={roomId} isConnected={isConnected} users={activeUsers} typingUsers={typingUsers} currentSocketId={socket.id} userName={userName} />
           <div className="flex-1 min-h-0"><CodeEditor code={code} language={language} onChange={handleEditorChange} theme="vs-dark" /></div>
        </div>

        <div className={`w-full lg:w-[400px] flex flex-col gap-4 ${mobileTab === 'tools' ? 'flex' : 'hidden lg:flex'}`}>
           <div className="flex-[3] bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col overflow-hidden">
              <div className="flex p-2 bg-slate-50 dark:bg-black/20 border-b border-slate-200 dark:border-white/5">
                 <button onClick={() => setActiveSidebarTab('ai')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg ${activeSidebarTab === 'ai' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-white/10'}`}>Console</button>
                 <button onClick={() => setActiveSidebarTab('logs')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg ${activeSidebarTab === 'logs' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-white/10'}`}>Activity</button>
              </div>

              {activeSidebarTab === 'ai' ? (
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                   <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
                      <button onClick={() => handleAiAction("explain")} disabled={isAiLoading} className="py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-lg text-xs font-bold hover:brightness-110">💡 Explain</button>
                      <button onClick={() => handleAiAction("refactor")} disabled={isAiLoading} className="py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 rounded-lg text-xs font-bold hover:brightness-110">✨ Refactor</button>
                   </div>
                   <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 overflow-y-auto custom-scrollbar font-mono text-[11px] text-slate-300 relative shadow-inner" ref={terminalRef}>
                      {terminalOutput.length === 0 && !aiResponse && <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic">Ready for input...</div>}
                      {terminalOutput.map((l, i) => <div key={i} className={`mb-1 break-all ${l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-emerald-400' : 'text-slate-300'}`}>{l.type === 'info' && <span className="text-blue-500 mr-2">$</span>}{l.text}</div>)}
                      {aiResponse && <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in pb-8"><div className="text-blue-400 font-bold mb-4 uppercase tracking-wider text-xs flex items-center gap-2 border-b border-white/5 pb-2"><FiCpu size={14} /> Neural Analysis</div><div className="prose prose-invert max-w-none"><ReactMarkdown components={{p: ({node, ...props}) => <p className="text-base leading-7 text-slate-300 mb-4 font-light" {...props} />, h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2 mt-4" {...props} />, h2: ({node, ...props}) => <h2 className="text-base font-bold text-blue-200 mb-2 mt-4" {...props} />, strong: ({node, ...props}) => <span className="font-bold text-emerald-400" {...props} />, ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 text-slate-300 mb-4" {...props} />, li: ({node, ...props}) => <li className="text-sm pl-1 marker:text-slate-500" {...props} />, code: ({node, inline, className, children, ...props}) => !inline ? (<div className="bg-[#050912] p-4 rounded-xl border border-white/10 my-4 overflow-x-auto shadow-inner"><code className="text-sm font-mono text-blue-300 leading-relaxed" {...props}>{children}</code></div>) : (<code className="bg-indigo-500/20 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-300 border border-indigo-500/30" {...props}>{children}</code>)}}>{aiResponse}</ReactMarkdown></div></div>}
                   </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3" ref={logsRef}>
                   {logs.map((l, i) => <div key={i} className="flex gap-3 text-xs"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-indigo-500 shrink-0"></div><div><div className="flex items-center gap-2"><span className="font-bold text-slate-700 dark:text-slate-200">{l.user}</span><span className="text-[10px] text-slate-400">{new Date(l.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span></div><p className="text-slate-500 dark:text-slate-400 mt-0.5">{l.action}</p></div></div>)}
                </div>
              )}
           </div>
        </div>
      </div>
      
      {/* 🔴 SAVE MODAL OVERLAY */}
      {isSaveModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-fade-in-up">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <FiSave className="text-indigo-500" /> Save Snippet
              </h2>
              <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-400 hover:text-white"><FiX size={20}/></button>
            </div>

            <form onSubmit={handleConfirmSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                <input 
                  required
                  value={saveForm.title}
                  onChange={e => setSaveForm({...saveForm, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={saveForm.description}
                  onChange={e => setSaveForm({...saveForm, description: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (Comma separated)</label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-3 text-slate-400" size={14}/>
                  <input 
                    value={saveForm.tags}
                    onChange={e => setSaveForm({...saveForm, tags: e.target.value})}
                    placeholder="e.g. algorithm, frontend, auth"
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsSaveModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">Cancel</button>
                <button disabled={isSaving} type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  {isSaving ? <FiLoader className="animate-spin"/> : "Confirm Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex bg-white dark:bg-[#0f172a] p-1 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 shrink-0">
         <button onClick={() => setMobileTab('editor')} className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest ${mobileTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Code Editor</button>
         <button onClick={() => setMobileTab('tools')} className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest ${mobileTab === 'tools' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Console & AI</button>
      </div>

    </div>
  );
}

export default DevSpace;