import React from "react";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiCode, FiCpu, FiGithub, 
  FiUsers, FiFileText, FiDatabase, FiZap, FiExternalLink 
} from "react-icons/fi";
import { motion } from "framer-motion";
import DashboardSlideshow from "./DashboardSlideshow";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Cards appear one by one
      delayChildren: 0.3
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div 
    variants={cardVariants}
    className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 hover:from-purple-500/50 hover:to-blue-500/50 transition-all duration-500"
  >
    {/* Inner Card Content */}
    <div className="h-full bg-[#0b1121] rounded-[22px] p-8 relative overflow-hidden group-hover:bg-[#0f172a] transition-colors">
      
      {/* Background Gradient Blob on Hover */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}-500/20 blur-[50px] rounded-full group-hover:bg-${color}-500/40 transition-all duration-500`}></div>

      {/* Icon Container */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg shadow-${color}-500/20`}>
        <Icon className={`text-${color}-400 group-hover:text-white transition-colors`} size={28} />
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
        {title}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
        {desc}
      </p>
    </div>
  </motion.div>
);

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      
      {/* Background Grid Animation */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e50a_1px,transparent_1px),linear-gradient(to_bottom,#4f46e50a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-[#020617]"></div>
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-50 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <FiCpu className="text-purple-500" size={24} />
           <span className="text-xl font-bold tracking-tight">DevNexus</span>
        </div>
        <div className="flex gap-4">
           <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
           <Link to="/register" className="px-5 py-2 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-colors">Sign Up</Link>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            DevSpace Live: Online
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            Code, Collaborate, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x">
              & Document.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            <strong>DevNexus</strong> is the complete operating system for developers. Join real-time AI coding rooms, manage documentation, and build your snippet library—all in one tab.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            {/* Primary CTA */}
            <Link to="/register" className="group px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2 hover:gap-4 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Launch Workspace <FiArrowRight className="transition-transform group-hover:translate-x-1"/>
            </Link>
            
            {/* Secondary CTA - Professional "View Source" */}
            <a 
              href="https://github.com/manaskng/DevNexus" 
              target="_blank" 
              rel="noreferrer" 
              className="group px-8 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-bold text-lg text-white backdrop-blur-md flex items-center gap-3"
            >
              <FiGithub className="text-gray-400 group-hover:text-white transition-colors" /> 
              <span>View Source</span>
              <FiExternalLink className="text-xs text-gray-500 group-hover:text-gray-300" />
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative max-w-5xl mx-auto z-20"
        >
           {/* Glow Effect Behind Browser */}
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20"></div>
           
           {/* The "Browser Window" Container */}
           <div className="relative rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden">
             <div className="h-8 bg-[#1e293b] border-b border-white/5 flex items-center px-4 space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-4 px-3 py-1 bg-[#020617] rounded-md text-[10px] text-gray-500 font-mono flex-1 text-center border border-white/5">
                  devnexus.app/devspace
                </div>
             </div>
             <div className="relative aspect-[16/9] bg-gray-900 group">
                 <DashboardSlideshow />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 pointer-events-none"></div>
             </div>
           </div>
        </motion.div>
      </div>

      {/* --- FEATURES GRID (POWER SUITE) --- */}
      <div className="relative py-32 px-6 overflow-hidden">
        
        {/* Massive Background Glow for this section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">The Power Suite</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Everything you need to ship faster, documented better, and built together.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            
            <FeatureCard 
              icon={FiUsers} 
              title="Real-Time DevSpace" 
              desc="Create live coding rooms instantly. Collaborate with your team using socket-powered synchronization, see active users, and write code together in real-time." 
              color="indigo"
            />
            
            <FeatureCard 
              icon={FiFileText} 
              title="DevDocs Manager" 
              desc="A dedicated space for your project research and documentation. Write in markdown, organize notes, pin important docs, and keep your ideas structured." 
              color="yellow"
            />

            <FeatureCard 
              icon={FiZap} 
              title="Neural AI Engine" 
              desc="Stuck on logic? Ask the built-in Gemini AI to explain complex code or refactor your algorithms instantly within the editor." 
              color="purple"
            />

            <FeatureCard 
              icon={FiDatabase} 
              title="Code Vault Integration" 
              desc="Never lose a snippet again. Push working code directly from DevSpace to your personal Code Vault with one click for safe keeping." 
              color="emerald"
            />

          </motion.div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/10 py-12 text-center bg-[#020617] relative z-10">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} DevNexus. Engineered by <span className="text-white font-bold">Manas Raj</span>.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;