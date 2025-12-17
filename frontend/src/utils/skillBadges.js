export const getSkillBadge = (skill) => {
  // Normalize input: lowercase and trim spaces
  const s = skill.toLowerCase().trim();
  
  const baseUrl = "https://img.shields.io/badge/";
  const suffix = "?style=for-the-badge&logoColor=white";

  const badges = {
    // ===== Languages =====
    "c": `${baseUrl}c-%2300599C.svg${suffix}&logo=c`,
    "c++": `${baseUrl}c++-%2300599C.svg${suffix}&logo=c%2B%2B`,
    "cpp": `${baseUrl}c++-%2300599C.svg${suffix}&logo=c%2B%2B`, // Alias
    "java": `${baseUrl}java-%23ED8B00.svg${suffix}&logo=openjdk`,
    "python": `${baseUrl}python-3670A0${suffix}&logo=python&logoColor=ffdd54`,
    "javascript": `${baseUrl}javascript-%23323330.svg${suffix}&logo=javascript&logoColor=%23F7DF1E`,
    "js": `${baseUrl}javascript-%23323330.svg${suffix}&logo=javascript&logoColor=%23F7DF1E`, // Alias
    "typescript": `${baseUrl}typescript-%23007ACC.svg${suffix}&logo=typescript`,
    "ts": `${baseUrl}typescript-%23007ACC.svg${suffix}&logo=typescript`, // Alias
    "go": `${baseUrl}go-%2300ADD8.svg${suffix}&logo=go`,
    "golang": `${baseUrl}go-%2300ADD8.svg${suffix}&logo=go`, // Alias
    "rust": `${baseUrl}rust-%23000000.svg${suffix}&logo=rust`,
    "php": `${baseUrl}php-%23777BB4.svg${suffix}&logo=php`,
    "bash": `${baseUrl}bash-%234EAA25.svg${suffix}&logo=gnubash`,
    "shell": `${baseUrl}bash-%234EAA25.svg${suffix}&logo=gnubash`, // Alias

    // ===== Frontend =====
    "html": `${baseUrl}html5-%23E34F26.svg${suffix}&logo=html5`,
    "html5": `${baseUrl}html5-%23E34F26.svg${suffix}&logo=html5`,
    "css": `${baseUrl}css3-%231572B6.svg${suffix}&logo=css3`,
    "css3": `${baseUrl}css3-%231572B6.svg${suffix}&logo=css3`,
    "react": `${baseUrl}react-%2320232a.svg${suffix}&logo=react&logoColor=%2361DAFB`,
    "react.js": `${baseUrl}react-%2320232a.svg${suffix}&logo=react&logoColor=%2361DAFB`, // Alias
    "next.js": `${baseUrl}next.js-black${suffix}&logo=next.js`,
    "nextjs": `${baseUrl}next.js-black${suffix}&logo=next.js`, // Alias
    "vue": `${baseUrl}vue.js-%2335495e.svg${suffix}&logo=vue.js`,
    "vue.js": `${baseUrl}vue.js-%2335495e.svg${suffix}&logo=vue.js`,
    "angular": `${baseUrl}angular-%23DD0031.svg${suffix}&logo=angular`,
    "redux": `${baseUrl}redux-%23593d88.svg${suffix}&logo=redux`,
    "tailwind": `${baseUrl}tailwindcss-%2338B2AC.svg${suffix}&logo=tailwind-css`,
    "tailwindcss": `${baseUrl}tailwindcss-%2338B2AC.svg${suffix}&logo=tailwind-css`,
    "bootstrap": `${baseUrl}bootstrap-%238511FA.svg${suffix}&logo=bootstrap`,
    "vite": `${baseUrl}vite-%23646CFF.svg${suffix}&logo=vite`,

    // ===== Backend =====
    "node.js": `${baseUrl}node.js-6DA55F${suffix}&logo=node.js`,
    "nodejs": `${baseUrl}node.js-6DA55F${suffix}&logo=node.js`, // Alias
    "express": `${baseUrl}express.js-%23404d59.svg${suffix}&logo=express`,
    "express.js": `${baseUrl}express.js-%23404d59.svg${suffix}&logo=express`,
    "nestjs": `${baseUrl}nestjs-%23E0234E.svg${suffix}&logo=nestjs`,
    "django": `${baseUrl}django-%23092E20.svg${suffix}&logo=django`,
    "flask": `${baseUrl}flask-%23000000.svg${suffix}&logo=flask`,
    "fastapi": `${baseUrl}fastapi-%23009688.svg${suffix}&logo=fastapi`,
    "spring": `${baseUrl}spring-%236DB33F.svg${suffix}&logo=springboot`,
    "springboot": `${baseUrl}spring-%236DB33F.svg${suffix}&logo=springboot`, // Alias

    // ===== Databases =====
    "mysql": `${baseUrl}mysql-4479A1.svg${suffix}&logo=mysql`,
    "postgresql": `${baseUrl}postgresql-%23336791.svg${suffix}&logo=postgresql`,
    "postgres": `${baseUrl}postgresql-%23336791.svg${suffix}&logo=postgresql`, // Alias
    "mongodb": `${baseUrl}mongodb-%234ea94b.svg${suffix}&logo=mongodb`,
    "mongo": `${baseUrl}mongodb-%234ea94b.svg${suffix}&logo=mongodb`, // Alias
    "redis": `${baseUrl}redis-%23DC382D.svg${suffix}&logo=redis`,
    "sqlite": `${baseUrl}sqlite-%23003B57.svg${suffix}&logo=sqlite`,
    "firebase": `${baseUrl}firebase-%23039BE5.svg${suffix}&logo=firebase`,
    "supabase": `${baseUrl}supabase-%233FCF8E.svg${suffix}&logo=supabase`,

    // ===== DevOps / Deployment =====
    "docker": `${baseUrl}docker-%230db7ed.svg${suffix}&logo=docker`,
    "kubernetes": `${baseUrl}kubernetes-%23326CE5.svg${suffix}&logo=kubernetes`,
    "k8s": `${baseUrl}kubernetes-%23326CE5.svg${suffix}&logo=kubernetes`, // Alias
    "nginx": `${baseUrl}nginx-%23009639.svg${suffix}&logo=nginx`,
    "github actions": `${baseUrl}github_actions-%232088FF.svg${suffix}&logo=github-actions`,
    "vercel": `${baseUrl}vercel-black${suffix}&logo=vercel`,
    "netlify": `${baseUrl}netlify-%2300C7B7.svg${suffix}&logo=netlify`,
    "render": `${baseUrl}render-%2346E3B7.svg${suffix}&logo=render`,

    // ===== Cloud =====
    "aws": `${baseUrl}aws-%23FF9900.svg${suffix}&logo=amazon-aws`,
    "azure": `${baseUrl}azure-%230072C6.svg${suffix}&logo=microsoft-azure`,
    "gcp": `${baseUrl}google_cloud-%234285F4.svg${suffix}&logo=google-cloud`,

    // ===== Machine Learning / AI =====
    "machine learning": `${baseUrl}machine_learning-%2300C853.svg${suffix}&logo=tensorflow`,
    "ml": `${baseUrl}machine_learning-%2300C853.svg${suffix}&logo=tensorflow`, // Alias
    "deep learning": `${baseUrl}deep_learning-%23FF6F00.svg${suffix}&logo=tensorflow`,
    "tensorflow": `${baseUrl}tensorflow-%23FF6F00.svg${suffix}&logo=tensorflow`,
    "pytorch": `${baseUrl}pytorch-%23EE4C2C.svg${suffix}&logo=pytorch`,
    "scikit-learn": `${baseUrl}scikit_learn-%23F7931E.svg${suffix}&logo=scikit-learn`,
    "sklearn": `${baseUrl}scikit_learn-%23F7931E.svg${suffix}&logo=scikit-learn`, // Alias
    "keras": `${baseUrl}keras-%23D00000.svg${suffix}&logo=keras`,
    "opencv": `${baseUrl}opencv-%235C3EE8.svg${suffix}&logo=opencv`,
    "huggingface": `${baseUrl}huggingface-%23FFD21E.svg${suffix}&logo=huggingface`,

    // ===== Data Science =====
    "numpy": `${baseUrl}numpy-%23013243.svg${suffix}&logo=numpy`,
    "pandas": `${baseUrl}pandas-%23150458.svg${suffix}&logo=pandas`,
    "matplotlib": `${baseUrl}matplotlib-%233F4F75.svg${suffix}&logo=python`,
    "seaborn": `${baseUrl}seaborn-%234A4A4A.svg${suffix}&logo=python`,

    // ===== Tools =====
    "git": `${baseUrl}git-%23F05033.svg${suffix}&logo=git`,
    "github": `${baseUrl}github-%23121011.svg${suffix}&logo=github`,
    "linux": `${baseUrl}linux-%23FCC624.svg${suffix}&logo=linux&logoColor=black`,
    "postman": `${baseUrl}postman-%23FF6C37.svg${suffix}&logo=postman`,
    "jira": `${baseUrl}jira-%230052CC.svg${suffix}&logo=jira`,

    // ===== SaaS / BaaS =====
    "saas": `${baseUrl}saas-%23009688.svg${suffix}`,
    "baas": `${baseUrl}baas-%234285F4.svg${suffix}`,
    "auth0": `${baseUrl}auth0-%23EB5424.svg${suffix}&logo=auth0`,
    "stripe": `${baseUrl}stripe-%23646CFF.svg${suffix}&logo=stripe`,
  };

  // Fallback: If skill not found, generate a gray badge with the skill name
  return badges[s] || `${baseUrl}${encodeURIComponent(skill)}-gray${suffix}`;
};