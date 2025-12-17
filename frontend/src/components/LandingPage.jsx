import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCode, FiLayers, FiCpu, FiUserCheck, FiGithub } from "react-icons/fi";
import { motion } from "framer-motion";
import DashboardSlideshow from "./DashboardSlideshow"; // <--- ADDED THIS IMPORT

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    viewport={{ once: true }}
    className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/[0.07] transition-all group hover:-translate-y-2"
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/10">
      <Icon className="text-purple-400" size={28} />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
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

      {/* Hero Section */}
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
            System Online v2.0
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
            The Ultimate Workspace <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient-x">
              For Developers
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop juggling tools. <strong>DevNexus</strong> unifies your Code Snippets, Kanban Tasks, and Career Portfolio into one powerful, distraction-free ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link to="/register" className="group px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2 hover:gap-4 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Initialize Workspace <FiArrowRight className="transition-transform group-hover:translate-x-1"/>
            </Link>
            <a href="https://github.com/manaskng/DevNexus" target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full border border-gray-700 bg-gray-900/50 hover:bg-gray-800 hover:border-gray-500 transition-all font-bold text-lg text-gray-300 hover:text-white backdrop-blur-sm flex items-center gap-2">
              <FiGithub /> Star on GitHub
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative max-w-5xl mx-auto z-20"
        >
           {/* Glow Effect Behind */}
           <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20"></div>
           
           {/* The "Browser Window" Container */}
           <div className="relative rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden">
              
              {/* Fake Browser Header */}
              <div className="h-8 bg-[#1e293b] border-b border-white/5 flex items-center px-4 space-x-2">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                 <div className="ml-4 px-3 py-1 bg-[#020617] rounded-md text-[10px] text-gray-500 font-mono flex-1 text-center border border-white/5">
                    devnexus.app/dashboard
                 </div>
              </div>

              {/* The Slideshow Image Area */}
              <div className="relative aspect-[16/9] bg-gray-900 group">
                 <DashboardSlideshow />
                 
                 {/* Overlay Gradient for depth */}
                 <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 pointer-events-none"></div>
              </div>
           </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Core Functionalities</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={FiCode} 
            title="Code Vault" 
            desc="A dedicated syntax-highlighted library for your algorithms and snippets. Tag, search, and copy instantly." 
            delay={0.1}
          />
          <FeatureCard 
            icon={FiLayers} 
            title="Task Command" 
            desc="Kanban-style task management built for engineers. Track bugs, features, and learning goals in one view." 
            delay={0.2}
          />
          <FeatureCard 
            icon={FiUserCheck} 
            title="Career Profile" 
            desc="Auto-generate a stunning developer portfolio based on your saved projects and coding stats. Share one link to rule them all." 
            delay={0.3}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center bg-[#020617] relative z-10">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} DevNexus. Engineered by <span className="text-white font-bold">Manas Raj</span>.
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;