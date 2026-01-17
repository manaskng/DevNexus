import React, { useState } from "react";
import { FiFileText, FiCode, FiUser, FiGrid, FiLayers, FiCpu } from "react-icons/fi";
import NoteList from "./NoteList";
import SnippetLibrary from "./SnippetLibrary"; 
import ProfileManager from "./ProfileManager"; 
import TaskBoard from "./TaskBoard"; 
import DevSpace from "./DevSpace"; 

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative
        ${isActive 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
          : "text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400"
        }
      `}
    >
      <div className="min-w-[24px] flex justify-center">
        <Icon size={20} className={isActive ? "animate-pulse-slow" : ""} />
      </div>
      
      <span className="font-medium text-sm whitespace-nowrap overflow-hidden hidden lg:block">
        {label}
      </span>

      <div className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 lg:hidden pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-md">
        {label}
      </div>
    </button>
  );
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("notes");

  return (
    <div className="flex h-full w-full overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[72px] lg:w-64 h-full border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b1121] transition-all duration-300 ease-in-out z-20 shrink-0">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100 dark:border-white/5">
           <FiGrid className="text-blue-600 lg:mr-3" size={24} />
           <span className="font-bold text-slate-800 dark:text-white hidden lg:block">Workspace</span>
        </div>

        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem id="notes" icon={FiFileText} label="DevDocs" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="devspace" icon={FiCpu} label="DevSpace (Live)" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="snippets" icon={FiCode} label="Code Library" activeTab={activeTab} setActiveTab={setActiveTab} />
          <NavItem id="tasks" icon={FiLayers} label="Task Board" activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="my-4 border-t border-slate-100 dark:border-white/5 mx-2"></div>
          <NavItem id="profiles" icon={FiUser} label="Profile Manager" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="p-4 text-center lg:text-left text-[10px] text-slate-400 dark:text-gray-600 border-t border-slate-100 dark:border-white/5">
           <span className="hidden lg:inline">DevNexus v2.0</span>
        </div>
      </aside>
      
      {/* 🔴 MAIN CONTENT FIX 🔴 
         Logic: If DevSpace is active, we LOCK the main scroll (overflow-hidden) and force h-full.
         This lets DevSpace manage its own internal scrolling/layout.
      */}
      <main className={`
        flex-1 h-full relative 
        ${activeTab === 'devspace' ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}
      `}>
        <div className={`
          mx-auto w-full transition-all duration-300
          ${activeTab === 'devspace' 
            ? 'h-full max-w-full p-0' // DevSpace Mode: Full height, no padding
            : 'min-h-full max-w-[1600px] p-4 lg:p-8 pb-24 md:pb-8' // Standard Mode: Padding & scrolling
          }
        `}>
           {activeTab === "notes" && <NoteList />}
           {activeTab === "devspace" && <DevSpace />}
           {activeTab === "snippets" && <SnippetLibrary />}
           {activeTab === "profiles" && <ProfileManager />}
           {activeTab === "tasks" && <TaskBoard />} 
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#0b1121] border-t border-slate-200 dark:border-white/10 flex justify-around items-center px-4 z-50 pb-safe shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
         <button onClick={() => setActiveTab("notes")} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'notes' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}>
            <FiFileText size={20}/>
            <span className="text-[10px] font-medium">Notes</span>
         </button>
         <button onClick={() => setActiveTab("devspace")} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'devspace' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}>
            <FiCpu size={20}/>
            <span className="text-[10px] font-medium">Space</span>
         </button>
         <button onClick={() => setActiveTab("snippets")} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'snippets' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}>
            <FiCode size={20}/>
            <span className="text-[10px] font-medium">Code</span>
         </button>
         <button onClick={() => setActiveTab("tasks")} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'tasks' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}>
            <FiLayers size={20}/>
            <span className="text-[10px] font-medium">Tasks</span>
         </button>
         <button onClick={() => setActiveTab("profiles")} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === 'profiles' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-gray-500'}`}>
            <FiUser size={20}/>
            <span className="text-[10px] font-medium">Profile</span>
         </button>
      </div>

    </div>
  );
}

export default Dashboard;