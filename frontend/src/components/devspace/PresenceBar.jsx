import React from 'react';
import { FiUsers, FiCpu, FiWifi, FiEdit3, FiActivity } from 'react-icons/fi';

const PresenceBar = ({ roomId, isConnected, users = [], typingUsers = new Map(), currentSocketId }) => {
  
  // Get the name of someone typing (excluding yourself)
  const typingEntry = Array.from(typingUsers.entries()).find(([id]) => id !== currentSocketId);
  const typingName = typingEntry ? typingEntry[1] : null;

  return (
    <div className="flex flex-wrap items-center justify-between p-3 mb-4 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm transition-all">
      
      {/* LEFT: Room Info & Typing Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/5">
           <FiCpu className="text-indigo-500" size={14} />
           <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider font-mono">{roomId}</span>
        </div>
        
        {/* 🚀 TYPING INDICATOR (Text) */}
        {typingName ? (
          <div className="flex items-center gap-2 text-xs font-bold text-purple-500 animate-pulse transition-all">
             <FiEdit3 size={12} />
             <span>{typingName} is writing...</span>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400">
             <FiActivity size={12} />
             <span>Ready</span>
          </div>
        )}
      </div>

      {/* RIGHT: User Avatars */}
      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className={`hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${isConnected ? 'text-emerald-500' : 'text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          {isConnected ? 'Live' : 'Offline'}
        </div>
        
        {/* Avatar Stack */}
        <div className="flex -space-x-3 overflow-hidden py-1 pl-1">
           {users.map((user) => {
             const isMe = user.socketId === currentSocketId;
             const isTyping = typingUsers.has(user.socketId);

             return (
               <div 
                 key={user.socketId}
                 title={`${user.userName} ${isMe ? '(You)' : ''}`}
                 className={`
                    relative inline-flex h-9 w-9 items-center justify-center rounded-full 
                    border-2 border-white dark:border-[#0f172a] 
                    text-white font-bold text-xs uppercase shadow-sm transition-all duration-300
                    ${isTyping 
                        ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-white dark:ring-offset-[#0f172a] z-10 scale-110' 
                        : 'hover:scale-105 hover:z-10'
                    }
                 `}
                 style={{ backgroundColor: user.color }}
               >
                 {user.userName.slice(0, 2)}
                 
                 {/* Typing Pen Overlay */}
                 {isTyping && (
                   <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 text-purple-500 rounded-full p-0.5 shadow-sm z-20">
                      <FiEdit3 size={10} />
                   </div>
                 )}
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};

export default PresenceBar;