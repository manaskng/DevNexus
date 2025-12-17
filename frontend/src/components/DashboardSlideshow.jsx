import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SCREENSHOTS = [
  { src: "/slide-1.png", alt: "Code Library - Dark Mode" },
  { src: "/slide-2.png", alt: "Task Kanban Board" },
  { src: "/slide-3.png", alt: "Profile Manager - Hero" },
  { src: "/slide-4.png", alt: "Profile Manager - Stats" }, 
  { src: "/slide-5.png", alt: "Profile Manager- Projects" },     
  { src: "/slide-6.png", alt: "Notes view" },
  { src: "/slide-7.png", alt: "Mobile View"}            
];

const DashboardSlideshow = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    }, 3300); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
           {/* LAYER 1: Ambient Background (Blurred) */}
           {/* This fills the container so you don't have black bars */}
           <img 
             src={SCREENSHOTS[index].src}
             alt=""
             className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
           />

           {/* LAYER 2: The Actual Screenshot (Sharp) */}
           {/* object-contain ensures the WHOLE image fits without stretching */}
           <img 
             src={SCREENSHOTS[index].src}
             alt={SCREENSHOTS[index].alt}
             className="relative z-10 w-full h-full object-contain p-4 drop-shadow-2xl"
             onError={(e) => {
               e.target.src = "https://via.placeholder.com/1200x675/0f172a/64748b?text=Preview+" + (index + 1);
             }}
           />
        </motion.div>
      </AnimatePresence>
      
      {/* Progress Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SCREENSHOTS.map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${i === index ? "bg-white scale-125" : "bg-white/30"}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardSlideshow;