import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { 
  FiMapPin, FiMail, FiGithub, FiLinkedin, FiExternalLink, 
  FiCpu, FiAward, FiCode, FiDownload 
} from "react-icons/fi";

const getProjectImage = (project) => {
  if (project.image && project.image.trim() !== "") return project.image;
  if (project.githubLink && project.githubLink.includes("github.com")) {
    try {
      const urlParts = new URL(project.githubLink).pathname.split("/").filter(Boolean);
      if (urlParts.length >= 2) return `https://opengraph.githubassets.com/1/${urlParts[0]}/${urlParts[1]}`;
    } catch (e) {}
  }
  return "https://via.placeholder.com/800x400/0f172a/94a3b8?text=Project+Code";
};

const BackgroundPattern = () => (
  <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 dark:from-[#020617] dark:via-transparent dark:to-[#020617]"></div>
  </div>
);

const HighImpactProjectCard = ({ project, index }) => {
  const imageUrl = getProjectImage(project);
  return (
    <div className="group relative w-full rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm overflow-hidden hover:border-purple-500/50 transition-all duration-500 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="lg:col-span-3 relative h-64 lg:h-auto overflow-hidden bg-slate-100 dark:bg-gray-900/50 p-6 flex items-center justify-center">
            <img src={imageUrl} alt={project.title} className="w-full h-full object-cover rounded-xl" />
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
    </div>
  );
};

function PublicProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams(); // Get username from URL
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch from the PUBLIC endpoint
        const { data } = await axios.get(`${API_URL}/api/user-profile/public/${username}`);
        setProfile(data);
      } catch (e) { console.error(e); } 
      finally { setLoading(false); }
    };
    fetchProfile();
  }, [API_URL, username]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white">Loading Profile...</div>;
  if (!profile) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-white">User not found</div>;

  return (
    <div className="min-h-screen overflow-y-auto custom-scrollbar font-sans transition-colors duration-500 bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-gray-200 relative">
      <BackgroundPattern />
      <div className="max-w-6xl mx-auto px-3 md:px-6 pb-20 relative z-10 pt-12">
        <div className="space-y-24 animate-fade-in-up">
            
            {/* HERO */}
            <section className="flex flex-col items-center text-center max-w-3xl mx-auto">
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
                      <img src={`https://github-readme-stats.vercel.app/api?username=${profile.githubUsername}&show_icons=true&theme=transparent&hide_border=true&title_color=2563eb&text_color=64748b&icon_color=2563eb`} className="w-full max-w-md dark:invert dark:hue-rotate-180" alt="GitHub Stats" />
                   </div>
                 )}
                 {profile.leetcodeUsername && (
                   <div className="border rounded-2xl p-4 flex justify-center overflow-hidden bg-white border-slate-200 dark:bg-white/5 dark:border-white/10 shadow-sm">
                      <img src={`https://leetcard.jacoblin.cool/${profile.leetcodeUsername}?theme=light&font=Inter&ext=heatmap`} className="w-full max-w-md scale-95 dark:invert dark:hue-rotate-180" alt="LeetCode Stats" />
                   </div>
                 )}
               </div>
            )}

            {/* SKILLS */}
            {profile.skills && profile.skills.length > 0 && (
              <section className="text-center">
                 <h2 className="text-3xl font-bold mb-10 flex items-center justify-center gap-2 text-slate-900 dark:text-white"><FiCpu className="text-blue-600 dark:text-purple-400"/> Tech Stack</h2>
                 <div className="flex flex-wrap justify-center gap-4">
                    {profile.skills.map((skill, idx) => (
                       <div key={idx} className="px-5 py-2 rounded-lg border font-medium cursor-default bg-white border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-200">{skill}</div>
                    ))}
                 </div>
              </section>
            )}

            {/* PROJECTS */}
            {profile.projects && profile.projects.length > 0 && (
               <section>
                  <div className="flex items-center gap-3 mb-12">
                     <div className="h-8 w-1 rounded-full bg-blue-500 dark:bg-purple-500"></div>
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Projects</h2>
                  </div>
                  <div className="flex flex-col gap-16">
                     {profile.projects.map((project, i) => <HighImpactProjectCard key={i} project={project} index={i} />)}
                  </div>
               </section>
            )}

            {/* ACHIEVEMENTS */}
            {profile.achievements && profile.achievements.length > 0 && (
               <section className="pb-12">
                  <div className="flex items-center gap-3 mb-12">
                     <div className="h-8 w-1 bg-yellow-500 rounded-full"></div>
                     <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Achievements</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                     {profile.achievements.map((ach, i) => (
                        <div key={i} className="aspect-square rounded-2xl border flex flex-col items-center justify-center p-4 bg-white border-slate-200 dark:bg-white/5 dark:border-white/10">
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
      </div>
    </div>
  );
}

export default PublicProfile;