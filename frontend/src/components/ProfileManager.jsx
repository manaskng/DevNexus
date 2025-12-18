import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiEdit3, FiSave, FiPlus, FiTrash2, FiMapPin, FiMail, 
  FiGithub, FiLinkedin, FiExternalLink, FiCpu, FiAward, FiCode, FiShare2, FiCheck, FiDownload, FiMessageSquare, FiX, FiArrowRight 
} from "react-icons/fi";

// --- HELPER: Get GitHub Image ---
const getProjectImage = (project) => {
  if (project.image && project.image.trim() !== "") return project.image;
  if (project.githubLink && project.githubLink.includes("github.com")) {
    try {
      const urlParts = new URL(project.githubLink).pathname.split("/").filter(Boolean);
      if (urlParts.length >= 2) return `https://opengraph.githubassets.com/1/${urlParts[0]}/${urlParts[1]}`;
    } catch (e) { console.error("Invalid URL", e); }
  }
  return "https://via.placeholder.com/800x400/0f172a/94a3b8?text=Project+Code";
};

// --- TOAST COMPONENT ---
const Toast = ({ message, onClose }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50, scale: 0.9 }} 
    animate={{ opacity: 1, y: 0, scale: 1 }} 
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-gray-900 text-white shadow-2xl border border-white/10"
  >
    <div className="bg-green-500 rounded-full p-1"><FiCheck size={12}/></div>
    <span className="text-sm font-medium">{message}</span>
  </motion.div>
);

const BackgroundPattern = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 dark:from-[#020617] dark:via-transparent dark:to-[#020617]"></div>
  </div>
);

// --- NEW COMPONENT: Empty State Feature Card ---
const EmptyFeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm flex flex-col items-center text-center hover:border-blue-500/30 transition-all hover:-translate-y-1"
  >
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-inner">
      <Icon size={28} />
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">{desc}</p>
  </motion.div>
);

// --- NEW COMPONENT: Welcome Screen for New Users ---
const EmptyProfileView = ({ username, onStart }) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center relative z-20 px-4 py-12">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center max-w-4xl mx-auto"
    >
      {/* Avatar Placeholder with Pulse Effect */}
      <div className="relative inline-block mb-10 group cursor-pointer" onClick={onStart}>
         <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
         <div className="relative w-32 h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-white dark:border-[#0f172a] shadow-2xl z-10 overflow-hidden">
            <span className="text-5xl font-black text-slate-300 dark:text-slate-600 select-none group-hover:scale-110 transition-transform duration-500">
              {username ? username[0].toUpperCase() : "U"}
            </span>
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <FiPlus className="text-white text-3xl drop-shadow-md" />
            </div>
         </div>
         {/* Online Badge */}
         <motion.div 
           initial={{ y: 10, opacity: 0 }} 
           animate={{ y: 0, opacity: 1 }} 
           transition={{ delay: 0.5 }}
           className="absolute -right-4 top-0 bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-1.5 text-xs font-bold text-green-500 z-20"
         >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
         </motion.div>
      </div>

      <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">{username}</span>.
      </h1>
      
      <p className="text-xl text-slate-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
        Your developer identity is blank. Let's change that.
        <br className="hidden md:block" />
        Build a <span className="text-slate-900 dark:text-white font-semibold">professional portfolio</span> that works as hard as you do.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-16 text-left">
         <EmptyFeatureCard 
           icon={FiShare2} 
           title="Shareable Link" 
           desc={`Claim your unique handle devnexus.app/u/${username} and share it with the world.`}
           delay={0.2}
         />
         <EmptyFeatureCard 
           icon={FiGithub} 
           title="Auto-Sync Stats" 
           desc="Connect GitHub & LeetCode to visualize your contributions instantly."
           delay={0.3}
         />
         <EmptyFeatureCard 
           icon={FiAward} 
           title="Career Timeline" 
           desc="Showcase your experience, projects, and skills in a clean, modern timeline."
           delay={0.4}
         />
      </div>

      <motion.button 
        whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        whileTap={{ scale: 0.98 }}
        onClick={onStart}
        className="group relative inline-flex items-center gap-4 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-xl shadow-xl transition-all overflow-hidden cursor-pointer"
      >
        <span className="relative z-10">Create My Profile</span>
        <FiArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
      </motion.button>
      
      <p className="mt-6 text-sm text-slate-400 dark:text-gray-500">
        Takes less than 2 minutes to set up.
      </p>
    </motion.div>
  </div>
);

const HighImpactProjectCard = ({ project, index }) => {
  const imageUrl = getProjectImage(project);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative w-full rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm overflow-hidden hover:border-purple-500/50 transition-all duration-500 shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="lg:col-span-3 relative h-64 lg:h-auto overflow-hidden bg-slate-100 dark:bg-gray-900/50 p-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 dark:from-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 transform group-hover:scale-[1.02] transition-transform duration-500">
               <div className="absolute top-0 left-0 right-0 h-6 bg-slate-200 dark:bg-gray-800 flex items-center gap-1.5 px-3 z-10">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
               </div>
               <img src={imageUrl} alt={project.title} className="w-full h-full object-cover pt-6" />
            </div>
        </div>
        <div className="lg:col-span-2 p-4 md:p-8 flex flex-col justify-center relative z-10">
          <div className="mb-4">
             <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
             <p className="text-slate-600 dark:text-gray-200 text-sm leading-relaxed line-clamp-4">{project.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
             {project.techStack && project.techStack.map((tech, i) => (
                <span key={i} className="px-2.5 py-1 text-xs font-bold rounded-md border bg-white border-slate-200 text-slate-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">{tech}</span>
             ))}
          </div>
          <div className="flex gap-4 mt-auto">
             {project.githubLink && (
               <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"><FiGithub /> Code</a>
             )}
             {project.liveLink && (
               <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-opacity shadow-lg bg-blue-600 dark:bg-purple-600 text-white hover:opacity-90"><FiExternalLink /> Live</a>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---

function ProfileManager() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [toastMessage, setToastMessage] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const { data } = await axios.get(`${API_URL}/api/user-profile`, { headers: { Authorization: `Bearer ${token}` } });
        const cleanData = { ...data, skills: data.skills || [], achievements: data.achievements || [], projects: data.projects || [], resumes: data.resumes || [] };
        setProfile(cleanData);
        setFormData(cleanData);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [API_URL]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.put(`${API_URL}/api/user-profile`, formData, { headers: { Authorization: `Bearer ${token}` } });
      setProfile(data);
      setFormData(data);
      setIsEditing(false);
      showToast("Profile saved successfully!");
    } catch (e) { alert("Save failed."); }
  };

  const handleCancel = () => {
    setFormData(profile); 
    setIsEditing(false);
  };

  const handleShare = async () => {
    if (!profile?.username) {
       showToast("Please save your profile first to generate a link!");
       return;
    }
    try {
        const safeUsername = encodeURIComponent(profile.username);
        const publicLink = `${window.location.origin}/u/${safeUsername}`;
        await navigator.clipboard.writeText(publicLink);
        showToast("Public Portfolio Link Copied!");
    } catch (err) { console.error("Failed to copy", err); }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleArrayChange = (e, field) => setFormData({ ...formData, [field]: e.target.value.split(',').map(s => s.trim()) });
  
  const updateProject = (index, field, value) => {
    setFormData(prev => {
      const newProjects = [...prev.projects];
      if (field === "techStack") newProjects[index][field] = value.split(',').map(s => s.trim());
      else newProjects[index][field] = value;
      return { ...prev, projects: newProjects };
    });
  };
  const addProject = () => setFormData(prev => ({ ...prev, projects: [...prev.projects, { title: "New Project", description: "", techStack: [], githubLink: "", liveLink: "" }] }));
  const removeProject = (index) => setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));

  const addResume = () => setFormData(prev => ({ ...prev, resumes: [...(prev.resumes || []), { label: "Resume", link: "" }] }));
  const removeResume = (index) => setFormData(prev => ({ ...prev, resumes: prev.resumes.filter((_, i) => i !== index) }));
  const updateResume = (index, field, value) => {
    setFormData(prev => {
        const newRes = [...prev.resumes];
        newRes[index][field] = value;
        return { ...prev, resumes: newRes };
    });
  };

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActiveSection(id); };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white">Loading...</div>;

  // LOGIC: Check if profile exists but has no substantive data
  const isProfileEmpty = profile && !profile.fullName;

  // VISIBILITY LOGIC: Show Floating Nav if Profile Exists OR if we are in Edit Mode
  // This ensures the "Save" button is visible when creating a profile for the first time.
  const showFloatingNav = !isProfileEmpty || isEditing;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar font-sans transition-colors duration-500 bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-gray-200 relative">
      <BackgroundPattern />

      {/* Floating Nav */}
      {showFloatingNav && (
        <div className="sticky top-6 z-40 flex justify-center mb-12 pointer-events-none">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 px-3 py-2 md:px-6 rounded-full shadow-2xl flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium pointer-events-auto">
            {!isEditing && ["about", "skills", "projects", "badges"].map((sec) => (
                <button key={sec} onClick={() => scrollTo(sec)} className={`capitalize transition-colors ${activeSection === sec ? "text-blue-600 dark:text-purple-400 font-bold" : "text-gray-400 hover:text-slate-900 dark:hover:text-white"}`}>
                {sec}
                </button>
            ))}
            
            {!isEditing && <div className="w-px h-4 bg-gray-400/30"></div>}
            
            {!isEditing && <button onClick={handleShare} className="text-gray-400 hover:text-blue-400 transition-colors" title="Share Public Link"><FiShare2 /></button>}
            
            {isEditing ? (
                <>
                <button onClick={handleCancel} className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                    <FiX /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 text-green-500 hover:text-green-400 font-bold transition-colors">
                    <FiSave /> Save
                </button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 dark:hover:text-purple-400">
                    <FiEdit3 /> Edit
                </button>
            )}
            </div>
        </div>
      )}

      <AnimatePresence>{toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}</AnimatePresence>

      <div className="max-w-6xl mx-auto px-3 md:px-6 pb-20 relative z-10 pt-4">
        {isProfileEmpty && !isEditing ? (
            <EmptyProfileView username={profile.username} onStart={() => setIsEditing(true)} />
        ) : !isEditing ? (
            <div className="space-y-24 animate-fade-in-up">
                
                {/* HERO */}
                <section id="about" className="flex flex-col items-center text-center max-w-3xl mx-auto">
                   <div className="relative mb-6">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-purple-600 dark:to-blue-600 rounded-full blur opacity-40 animate-pulse"></div>
                      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-4xl font-bold text-slate-900 dark:text-white">
                         {profile.fullName ? profile.fullName[0] : "U"}
                      </div>
                   </div>
                   
                   <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">{profile.fullName}</h1>
                   <p className="text-xl font-medium mb-6 px-4 py-1 rounded-full border bg-blue-50 border-slate-200 text-blue-600 dark:bg-purple-500/10 dark:border-white/10 dark:text-purple-400">{profile.headline}</p>
                   <p className="text-lg mb-8 leading-relaxed whitespace-pre-wrap text-slate-600 dark:text-gray-200">{profile.about}</p>
                   
                   <div className="flex flex-col items-center gap-6">
                      <div className="flex gap-4 justify-center">
                          {[
                            { icon: FiGithub, link: `https://github.com/${profile.githubUsername}` },
                            { icon: FiLinkedin, link: profile.linkedinProfile },
                            { icon: FiMail, link: `mailto:${profile.email}` }
                          ].map((social, i) => social.link && (
                            <a key={i} href={social.link} target="_blank" rel="noreferrer" className="p-3 rounded-xl border bg-white border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-200 hover:scale-110 transition-transform">
                                <social.icon size={22}/>
                            </a>
                          ))}
                      </div>

                      {profile.resumes && profile.resumes.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-4">
                           {profile.resumes.map((res, i) => (
                             <a key={i} href={res.link} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform hover:-translate-y-1 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                               <FiDownload className="text-lg" /> {res.label || "Download Resume"}
                             </a>
                           ))}
                        </div>
                      )}
                   </div>
                </section>

                {/* STATS */}
                {(profile.githubUsername || profile.leetcodeUsername) && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
                     {profile.githubUsername && (
                       <div className="border rounded-2xl p-4 flex justify-center bg-white border-slate-200 dark:bg-white/5 dark:border-white/10 shadow-sm">
                          <img 
                            src={`https://github-readme-stats.vercel.app/api?username=${profile.githubUsername}&show_icons=true&theme=transparent&hide_border=true&title_color=2563eb&text_color=64748b&icon_color=2563eb`} 
                            className="w-full max-w-md dark:invert dark:hue-rotate-180" 
                            alt="GitHub Stats"
                          />
                       </div>
                     )}
                     {profile.leetcodeUsername && (
                       <div className="border rounded-2xl p-4 flex justify-center overflow-hidden bg-white border-slate-200 dark:bg-white/5 dark:border-white/10 shadow-sm">
                          <img 
                            src={`https://leetcard.jacoblin.cool/${profile.leetcodeUsername}?theme=light&font=Inter&ext=heatmap`} 
                            className="w-full max-w-md scale-95 dark:invert dark:hue-rotate-180" 
                            alt="LeetCode Stats"
                          />
                       </div>
                     )}
                   </div>
                )}

                {/* SKILLS */}
                {profile.skills.length > 0 && (
                  <section id="skills" className="text-center">
                     <h2 className="text-3xl font-bold mb-10 flex items-center justify-center gap-2 text-slate-900 dark:text-white">
                        <FiCpu className="text-blue-600 dark:text-purple-400"/> Tech Stack
                     </h2>
                     <div className="flex flex-wrap justify-center gap-4">
                        {profile.skills.map((skill, idx) => (
                           <div key={idx} className="px-5 py-2 rounded-lg border font-medium cursor-default bg-white border-slate-200 text-slate-600 hover:text-blue-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-200 dark:hover:text-purple-400">
                              {skill}
                           </div>
                        ))}
                     </div>
                  </section>
                )}

                {/* PROJECTS */}
                {profile.projects.length > 0 && (
                   <section id="projects" className="scroll-mt-24">
                      <div className="flex items-center gap-3 mb-12">
                         <div className="h-8 w-1 rounded-full bg-blue-500 dark:bg-purple-500"></div>
                         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
                      </div>
                      <div className="flex flex-col gap-16">
                         {profile.projects.map((project, i) => <HighImpactProjectCard key={i} project={project} index={i} />)}
                      </div>
                   </section>
                )}

                {/* BADGES */}
                {profile.achievements.length > 0 && (
                   <section id="badges" className="scroll-mt-24 pb-12">
                      <div className="flex items-center gap-3 mb-12">
                         <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
                         <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Achievements</h2>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                         {profile.achievements.map((ach, i) => (
                            <div key={i} className="aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 transition-all hover:scale-105 hover:shadow-xl bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
                               <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 bg-opacity-10 bg-black dark:bg-white">
                                  {ach.toLowerCase().includes('code') ? <FiCode size={24} className="text-blue-500"/> : <FiAward size={24} className="text-yellow-500"/>}
                                </div>
                               <span className="text-xs font-bold text-center uppercase tracking-wider text-slate-600 dark:text-gray-200">{ach}</span>
                            </div>
                         ))}
                      </div>
                   </section>
                )}
            </div>
        ) : (
            /* EDIT FORM */
            <div className="border p-8 rounded-3xl shadow-xl bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
                <div className="flex justify-between items-center mb-8 border-b pb-4 border-slate-200 dark:border-gray-800">
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Profile</h2>
                   <div className="text-slate-600 dark:text-gray-200">Update your details below</div>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['fullName', 'headline', 'email', 'location', 'linkedinProfile', 'githubUsername', 'leetcodeUsername', 'portfolioUrl'].map((field) => (
                           <div key={field}>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{field}</label>
                              <input name={field} className="w-full border p-3 rounded-xl outline-none bg-white border-slate-200 text-slate-900 dark:bg-[#1e293b] dark:border-white/10 dark:text-white" value={formData[field] || ""} onChange={handleChange} />
                           </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">About Me</label>
                        <textarea name="about" className="w-full border p-3 rounded-xl outline-none h-32 bg-white border-slate-200 text-slate-900 dark:bg-[#1e293b] dark:border-white/10 dark:text-white" value={formData.about || ""} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Skills</label>
                        <input className="w-full border p-3 rounded-xl outline-none bg-white border-slate-200 text-slate-900 dark:bg-[#1e293b] dark:border-white/10 dark:text-white" value={formData.skills || ""} onChange={e => handleArrayChange(e, 'skills')} />
                    </div>

                    <div className="border-t pt-8 border-slate-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                           <label className="block text-xs font-bold text-gray-500 uppercase ml-1">Resumes</label>
                           <button onClick={addResume} className="text-xs px-3 py-1 rounded bg-blue-600 text-white dark:bg-purple-600">+ Add Resume</button>
                        </div>
                        <div className="space-y-3">
                           {(formData.resumes || []).map((res, i) => (
                              <div key={i} className="flex gap-2">
                                 <input className="w-1/3 border p-2 rounded outline-none text-sm bg-white border-slate-200 text-slate-900 dark:bg-[#1e293b] dark:border-white/10 dark:text-white" placeholder="Label (e.g. CV)" value={res.label} onChange={e => updateResume(i, 'label', e.target.value)} />
                                 <input className="flex-1 border p-2 rounded outline-none text-sm bg-white border-slate-200 text-slate-900 dark:bg-[#1e293b] dark:border-white/10 dark:text-white" placeholder="URL (Drive/Dropbox)" value={res.link} onChange={e => updateResume(i, 'link', e.target.value)} />
                                 <button onClick={() => removeResume(i)} className="text-gray-400 hover:text-red-500"><FiTrash2/></button>
                              </div>
                           ))}
                        </div>
                    </div>

                    <div className="border-t pt-8 border-slate-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Projects</h3>
                           <button onClick={addProject} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-blue-600 text-white dark:bg-purple-600"><FiPlus/> Add Project</button>
                        </div>
                        <div className="grid gap-6">
                            {(formData.projects || []).map((proj, i) => (
                                <div key={i} className="p-6 border rounded-xl relative space-y-4 bg-slate-50 border-slate-200 dark:bg-[#1e293b] dark:border-white/10">
                                    <button onClick={()=>removeProject(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FiTrash2/></button>
                                    <input className="w-full bg-transparent border-b p-2 font-bold text-lg outline-none border-slate-200 dark:border-white/10 text-slate-900 dark:text-white" placeholder="Project Title" value={proj.title} onChange={e=>updateProject(i, 'title', e.target.value)} />
                                    <textarea className="w-full border p-3 rounded-lg outline-none h-24 text-sm bg-white border-slate-200 text-slate-600 dark:bg-[#020617] dark:border-gray-700 dark:text-gray-300" placeholder="Description" value={proj.description} onChange={e=>updateProject(i, 'description', e.target.value)} />
                                    <input className="w-full border p-3 rounded-lg outline-none text-sm bg-white border-slate-200 text-slate-600 dark:bg-[#020617] dark:border-gray-700 dark:text-gray-300" placeholder="Tech Stack (comma sep)" value={proj.techStack} onChange={e=>updateProject(i, 'techStack', e.target.value)} />
                                    <input className="w-full border p-3 rounded-lg outline-none text-sm bg-white border-slate-200 text-slate-600 dark:bg-[#020617] dark:border-gray-700 dark:text-gray-300" placeholder="Image URL (Optional)" value={proj.image || ""} onChange={e=>updateProject(i, 'image', e.target.value)} />
                                    <div className="flex gap-4">
                                        <input className="w-1/2 border p-3 rounded-lg outline-none text-sm bg-white border-slate-200 text-slate-600 dark:bg-[#020617] dark:border-gray-700 dark:text-gray-300" placeholder="GitHub URL" value={proj.githubLink} onChange={e=>updateProject(i, 'githubLink', e.target.value)} />
                                        <input className="w-1/2 border p-3 rounded-lg outline-none text-sm bg-white border-slate-200 text-slate-600 dark:bg-[#020617] dark:border-gray-700 dark:text-gray-300" placeholder="Live URL" value={proj.liveLink} onChange={e=>updateProject(i, 'liveLink', e.target.value)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-8 border-slate-200 dark:border-gray-800">
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Achievements (One per line)</label>
                         <textarea className="w-full border p-3 rounded-xl outline-none h-40 bg-white border-slate-200 text-slate-900 dark:bg-[#1e293b] dark:border-white/10 dark:text-white" value={(formData.achievements || []).join('\n')} onChange={e => setFormData({ ...formData, achievements: e.target.value.split('\n') })} />
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- FLOATING "REPORT ISSUE" BUTTON --- */}
      <a 
        href="mailto:support@devnexus.com?subject=Issue Report - DevNexus&body=Describe your issue here..."
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-red-500/90 text-white rounded-full shadow-2xl hover:scale-105 transition-transform hover:bg-red-600 backdrop-blur-md"
        title="Report an Issue"
      >
        <FiMessageSquare size={20} />
        <span className="font-bold text-sm hidden sm:inline">Report Issue</span>
      </a>

    </div>
  );
}

export default ProfileManager;