import React, { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { getSkillBadge } from "../utils/skillBadges"; // Use our helper for icons

const ROTATION_RANGE = 25;
const HALF_ROTATION = ROTATION_RANGE / 2;

export default function ModernSkillCard({ skillName }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 120, damping: 10 });
  const ySpring = useSpring(y, { stiffness: 120, damping: 10 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
    const rX = (mouseY / height - HALF_ROTATION) * -1;
    const rY = mouseX / width - HALF_ROTATION;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        ref={ref}
        style={{ transformStyle: "preserve-3d", transform }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-24 h-24 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
          {/* Using the badge helper to get the image URL */}
          <img
            src={getSkillBadge(skillName)}
            alt={skillName}
            className="h-10 object-contain select-none"
            style={{ transform: "translateZ(60px)" }}
          />
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -5 }}
        className="mt-2 text-xs text-gray-600 font-bold uppercase tracking-wider"
      >
        {skillName}
      </motion.p>
    </div>
  );
}