import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiFileText, FiCode, FiUser, FiCheckSquare, FiTrash2, FiPlus, FiSquare 
} from "react-icons/fi";

function Sidebar({ activeTab, setActiveTab }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // --- TASK LOGIC ---
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const tempId = Date.now();
    const tempTask = { _id: tempId, content: newTask, isCompleted: false };
    
    setTasks([tempTask, ...tasks]);
    setNewTask("");

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${API_URL}/api/tasks`,
        { content: tempTask.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(prev => prev.map(t => t._id === tempId ? data : t));
    } catch (error) {
      setTasks(prev => prev.filter(t => t._id !== tempId));
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, isCompleted: !currentStatus } : t));

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        { isCompleted: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      fetchTasks();
    }
  };

  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      fetchTasks();
    }
  };

  // --- SUB-COMPONENT: Nav Button ---
  const NavButton = ({ id, icon: Icon, label }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-1 group
          ${isActive 
            ? "bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold shadow-sm ring-1 ring-blue-100 dark:ring-0" 
            : "text-gray-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"}`}
      >
        <Icon size={20} className={`${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <aside className="w-72 h-full flex flex-col bg-white dark:bg-[#0b1121] border-r border-slate-100 dark:border-white/5 transition-colors duration-300">
      
      {/* 1. Navigation Section */}
      <div className="p-5 border-b border-slate-100 dark:border-white/5">
        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">
          Apps
        </h3>
        <nav>
          <NavButton id="notes" icon={FiFileText} label="My Notes" />
          <NavButton id="snippets" icon={FiCode} label="Code Library" />
          <NavButton id="profiles" icon={FiUser} label="Profile Manager" />
        </nav>
      </div>

      {/* 2. Tasks Widget Section */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#020617]/30">
        <div className="p-5 pb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Quick Tasks
          </h3>
          <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full font-medium">
            {tasks.filter(t => !t.isCompleted).length} Pending
          </span>
        </div>

        {/* Scrollable Task List */}
        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-600 text-sm italic">
              No tasks yet. <br/> Stay focused! 
            </div>
          ) : (
            <div className="space-y-1">
              {tasks.map((task) => (
                <div 
                  key={task._id} 
                  className="group flex items-center justify-between p-2 rounded-md hover:bg-white dark:hover:bg-white/5 hover:shadow-sm transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <button 
                      onClick={() => toggleTask(task._id, task.isCompleted)}
                      className="flex-shrink-0 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {task.isCompleted ? <FiCheckSquare size={18} className="text-green-500" /> : <FiSquare size={18} />}
                    </button>
                    <span className={`text-sm truncate ${task.isCompleted ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-700 dark:text-gray-300"}`}>
                      {task.content}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-300 hover:text-red-500 transition-all"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Task Input (Fixed at bottom) */}
        <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#0b1121]">
          <form onSubmit={handleAddTask} className="relative">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="w-full pl-3 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button 
              type="submit"
              disabled={!newTask.trim()}
              className="absolute right-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-0 disabled:pointer-events-none transition-all"
            >
              <FiPlus size={14} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;