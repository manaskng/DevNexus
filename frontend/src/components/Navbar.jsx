import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiFileText, FiCode, FiX, FiLoader, FiCpu, FiLogOut, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext'; // Import the hook

function Navbar({ user, setUser }) {
  const { theme, toggleTheme } = useTheme(); // Use Global Theme
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ notes: [], snippets: [] });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(`${API_URL}/api/search?q=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setResults(data);
          setShowResults(true);
        } catch (error) { console.error("Search error", error); } 
        finally { setLoading(false); }
      } else {
        setResults({ notes: [], snippets: [] });
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [query, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate('/welcome'); 
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="w-full px-6 lg:px-8"> 
        <div className="flex items-center justify-between h-16">
          
          {/* 1. BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <FiCpu size={18} />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              DevNexus
            </span>
          </Link>
          
          {user && (
            <>
              {/* 2. CENTER: SEARCH BAR */}
              <div className="hidden md:block flex-1 max-w-lg mx-8 relative" ref={searchRef}>
                <div className="relative group">
                  <div className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {loading ? <FiLoader className="animate-spin"/> : <FiSearch />}
                  </div>
                  
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 1 && setShowResults(true)}
                    placeholder="Search notes, code, tags..."
                    className="w-full pl-10 pr-10 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-white/10 transition-all placeholder-slate-500 dark:placeholder-gray-600 text-sm"
                  />
                  
                  {query && (
                    <button onClick={()=>{setQuery(""); setShowResults(false)}} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <FiX/>
                    </button>
                  )}
                </div>

                {/* RESULTS DROPDOWN */}
                <AnimatePresence>
                  {showResults && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto custom-scrollbar"
                    >
                      {/* Snippets */}
                      {results.snippets.length > 0 && (
                        <div className="p-2">
                            <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase px-2 mb-2 tracking-wider">Code Library</h3>
                            {results.snippets.map(s => (
                                <div key={s._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg"><FiCode /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">{s.title}</p>
                                        <span className="text-[10px] uppercase font-bold bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-500 px-1.5 py-0.5 rounded border border-slate-300 dark:border-gray-700">{s.language}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                      )}

                      {/* Notes */}
                      {results.notes.length > 0 && (
                        <div className="p-2 border-t border-slate-100 dark:border-white/5">
                            <h3 className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase px-2 mb-2 mt-1 tracking-wider">Notes</h3>
                            {results.notes.map(n => (
                                <div key={n._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg"><FiFileText /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-gray-200 group-hover:text-yellow-600 dark:group-hover:text-yellow-400">{n.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-gray-500 line-clamp-1" dangerouslySetInnerHTML={{__html: n.description?.replace(/<[^>]+>/g, '')}}></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                      )}

                      {results.notes.length === 0 && results.snippets.length === 0 && !loading && (
                        <div className="p-6 text-center text-slate-500 dark:text-gray-500 text-sm">No matches found</div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. RIGHT SIDE: THEME TOGGLE & USER */}
              <div className="flex items-center space-x-4">
                
                {/* THEME TOGGLE BUTTON */}
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white transition-all"
                  title="Toggle Theme"
                >
                  {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

                <span className="text-slate-600 dark:text-gray-300 font-medium hidden sm:block text-sm">
                  {user.username}
                </span>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500 dark:hover:text-white transition-all text-sm font-bold border border-red-200 dark:border-red-500/20"
                >
                  <FiLogOut size={14}/> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;