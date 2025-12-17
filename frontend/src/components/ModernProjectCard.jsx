import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function ModernProjectCard({ project, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col md:flex-row ${
        !isEven ? "md:flex-row-reverse" : ""
      } items-stretch gap-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group`}
    >
      {/* Content Section (Since we might not have images for every project yet, we focus on content) */}
      <div className="w-full p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {project.title || "Untitled Project"}
            </h3>
            <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
               PROJECT
            </span>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {project.description || "No description provided."}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack && project.techStack.map((t) => (
              <span key={t} className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 border-t border-gray-100 pt-6 mt-auto">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-black transition-colors">
              <FaGithub /> Code
            </a>
          )}
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}