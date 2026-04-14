import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiCalendar, FiExternalLink, FiClock, FiPlus, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

// Platform brand colors + emoji logos
const PLATFORM_ICONS = {
  CF:   { emoji: "🔵", gradient: "from-blue-500/20 to-blue-600/10" },
  LC:   { emoji: "🟠", gradient: "from-amber-500/20 to-orange-600/10" },
  CC:   { emoji: "⚪", gradient: "from-stone-400/20 to-stone-600/10" },
  AC:   { emoji: "⚫", gradient: "from-gray-400/20 to-gray-600/10" },
  HR:   { emoji: "🟢", gradient: "from-emerald-500/20 to-green-600/10" },
  HE:   { emoji: "🔷", gradient: "from-indigo-500/20 to-indigo-600/10" },
  TC:   { emoji: "🔴", gradient: "from-sky-500/20 to-cyan-600/10" },
  GFG:  { emoji: "🟩", gradient: "from-green-500/20 to-green-600/10" },
  N360: { emoji: "🟦", gradient: "from-blue-600/20 to-blue-700/10" },
  OTH:  { emoji: "⬜", gradient: "from-slate-500/20 to-slate-600/10" },
};

function getCountdown(startTime) {
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return "Live Now";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const ContestWidget = ({ onClose }) => {
  const widgetRef = useRef(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("upcoming");
  const [platformFilter, setPlatformFilter] = useState("all");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchContests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/contests`, { timeout: 15000 });
      setContests(res.data.contests || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load contests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContests(); }, [API_URL]);

  // Close handlers
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) onClose();
    };
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleAddTask = async (contestName) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/tasks`, { content: `Participate: ${contestName}` }, { headers: { Authorization: `Bearer ${token}` } });
      alert(`✓ Added "${contestName}" to your Task Board`);
    } catch { alert("Failed to add task."); }
  };

  const getFilteredContests = () => {
    const now = new Date();
    const tonight = new Date();
    tonight.setHours(23, 59, 59, 999);

    let filtered = contests;
    if (filter === "today") {
      filtered = contests.filter(c => new Date(c.startTime) <= tonight || c.status === "CODING");
    } else {
      filtered = contests.filter(c => new Date(c.endTime) > now);
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(c => c.platform.shortName === platformFilter);
    }

    return filtered.slice(0, 30);
  };

  const filteredContests = getFilteredContests();

  // Get unique platforms from data
  const activePlatforms = [...new Set(contests.map(c => c.platform.shortName))].filter(p => p !== "OTH");

  return (
    <motion.div
      ref={widgetRef}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute top-14 right-0 w-[420px] max-w-[calc(100vw-32px)] bg-[#0a0f1e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-[100] flex flex-col font-sans"
    >
      {/* ── HEADER ── */}
      <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-[#0f172a] to-transparent">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2 tracking-tight">
            <div className="w-7 h-7 bg-blue-500/15 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <FiCalendar className="text-blue-400" size={14} />
            </div>
            Contest Radar
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={fetchContests} disabled={loading} className="p-1.5 text-slate-400 hover:text-white bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all" title="Refresh">
              <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Time Filter Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/5 mb-3">
          {["today", "upcoming"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                filter === f 
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {f === "today" ? "Today" : "Upcoming"}
            </button>
          ))}
        </div>

        {/* Platform Quick Filters */}
        {activePlatforms.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setPlatformFilter("all")}
              className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg border whitespace-nowrap transition-all ${
                platformFilter === "all"
                  ? "bg-white/10 border-white/20 text-white"
                  : "border-white/5 text-slate-500 hover:text-slate-300"
              }`}
            >All</button>
            {activePlatforms.map(p => (
              <button
                key={p}
                onClick={() => setPlatformFilter(platformFilter === p ? "all" : p)}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-lg border whitespace-nowrap transition-all flex items-center gap-1 ${
                  platformFilter === p
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-white/5 text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className="text-[10px]">{PLATFORM_ICONS[p]?.emoji || "⬜"}</span>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── CONTEST LIST ── */}
      <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Loading contests...</span>
          </div>
        ) : error ? (
          <div className="text-center py-14 px-6">
            <FiAlertCircle className="mx-auto text-red-400 mb-2" size={24} />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        ) : filteredContests.length === 0 ? (
          <div className="text-center py-14 px-6">
            <FiCalendar className="mx-auto text-slate-600 mb-2" size={24} />
            <p className="text-xs text-slate-500">No contests found</p>
          </div>
        ) : (
          <div className="p-2 space-y-1.5">
            {filteredContests.map((c, i) => {
              const start = new Date(c.startTime);
              const isLive = c.status === "CODING";
              const countdown = getCountdown(c.startTime);
              const icon = PLATFORM_ICONS[c.platform.shortName] || PLATFORM_ICONS.OTH;

              return (
                <motion.div
                  key={`${c.name}-${i}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`p-3 rounded-xl border transition-all group cursor-default ${
                    isLive 
                      ? "border-emerald-500/30 bg-emerald-500/5" 
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Platform Icon */}
                    <div className={`w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br ${icon.gradient} border border-white/5 flex items-center justify-center text-sm`}>
                      {icon.emoji}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-[8px] font-black uppercase tracking-widest px-1.5 py-px rounded"
                          style={{ backgroundColor: c.platform.color + "18", color: c.platform.color }}
                        >
                          {c.platform.name}
                        </span>
                        {isLive && (
                          <span className="text-[8px] font-black text-emerald-400 flex items-center gap-1 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Live
                          </span>
                        )}
                      </div>

                      <h4 className="text-[13px] font-semibold text-white/90 truncate leading-tight group-hover:text-white transition-colors">
                        {c.name}
                      </h4>

                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <FiClock size={9} />
                          {start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {c.durationHours > 0 && (
                          <span className="text-[10px] text-slate-600 font-mono">{c.durationHours}h</span>
                        )}
                      </div>
                    </div>

                    {/* Countdown + Actions */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[11px] font-bold tabular-nums ${isLive ? "text-emerald-400" : countdown.includes("m") && !countdown.includes("d") ? "text-amber-400" : "text-slate-400"}`}>
                        {countdown}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleAddTask(c.name)} className="p-1 text-slate-500 hover:text-blue-400 transition-colors" title="Add to Tasks">
                          <FiPlus size={11} />
                        </button>
                        <a href={c.url} target="_blank" rel="noreferrer" className="p-1 text-slate-500 hover:text-blue-400 transition-colors" title="Open">
                          <FiExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="px-4 py-2.5 border-t border-white/5 bg-[#060a14]">
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-slate-600 font-medium uppercase tracking-widest">
            {filteredContests.length} contests · Powered by CLIST
          </span>
          <span className="text-[9px] text-slate-600">
            Press <kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10 text-slate-500">ESC</kbd> to close
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestWidget;
