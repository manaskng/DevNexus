import React, { useState, useEffect } from "react";

// ──────────────────────────────────────────────────────
// Dashboard Slideshow — Used on the Landing Page to
// showcase screenshots of the app features.
// Cycles through images in /public automatically.
// ──────────────────────────────────────────────────────

const SLIDES = [
  { src: "/slide-1.png", alt: "DevDocs editor" },
  { src: "/slide-2.png", alt: "Code Vault" },
  { src: "/slide-3.png", alt: "DevSpace collaboration" },
  { src: "/slide-4.png", alt: "Task Board" },
  { src: "/slide-5.png", alt: "Profile Manager" },
  { src: "/slide-6.png", alt: "AI Code Analysis" },
  { src: "/slide-7.png", alt: "Real-time coding" },
  { src: "/slide-8.png", alt: "Snippet Library" },
];

function DashboardSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {SLIDES.map((slide, i) => (
        <img
          key={i}
          src={slide.src}
          alt={slide.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current
                ? "bg-white w-4"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardSlideshow;
