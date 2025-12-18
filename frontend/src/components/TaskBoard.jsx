import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiCheckSquare, FiSquare, FiLayers } from "react-icons/fi";

function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // --- 1. FETCH TASKS ---
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

  // --- 2. ADD TASK ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const tempId = Date.now();
    const tempTask = { _id: tempId, content: newTask, isCompleted: false };
    
    // Optimistic Update
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
      console.error("Error adding task:", error);
      setTasks(prev => prev.filter(t => t._id !== tempId));
    }
  };

  // --- 3. TOGGLE TASK ---
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
      console.error("Error updating task", error);
      fetchTasks();
    }
  };

  // --- 4. DELETE TASK ---
  const deleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t._id !== taskId));

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting task", error);
      fetchTasks();
    }
  };

  return (
    // CHANGED: p-8 to p-3 md:p-8 (Wider tasks on mobile)
    <div className="p-3 md:p-8 h-full flex flex-col max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FiLayers className="text-blue-600 dark:text-purple-400"/> Task Board
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mt-1">Manage your daily engineering goals.</p>
      </div>

      {/* INPUT AREA */}
      <form onSubmit={handleAddTask} className="relative mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full pl-4 pr-14 py-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all text-lg"
        />
        <button 
          type="submit"
          disabled={!newTask.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 dark:bg-purple-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
        >
          <FiPlus size={20} />
        </button>
      </form>

      {/* TASK LIST */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-20">
        {tasks.length === 0 ? (
           <div className="text-center py-20 text-slate-400 dark:text-gray-600 italic">
             No active tasks. Time to build something new?
           </div>
        ) : (
           tasks.map((task) => (
             <div 
               key={task._id} 
               className="group flex items-center justify-between p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 rounded-xl hover:shadow-md transition-all"
             >
               <div className="flex items-center gap-4 overflow-hidden">
                 <button 
                   onClick={() => toggleTask(task._id, task.isCompleted)}
                   className="flex-shrink-0 text-slate-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-purple-400 transition-colors"
                 >
                   {task.isCompleted ? <FiCheckSquare size={24} className="text-green-500" /> : <FiSquare size={24} />}
                 </button>
                 <span className={`text-lg truncate transition-all ${task.isCompleted ? "text-slate-400 dark:text-gray-600 line-through" : "text-slate-800 dark:text-gray-200"}`}>
                   {task.content}
                 </span>
               </div>
               
               <button 
                 onClick={() => deleteTask(task._id)}
                 className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
               >
                 <FiTrash2 size={20} />
               </button>
             </div>
           ))
        )}
      </div>
    </div>
  );
}

export default TaskBoard;