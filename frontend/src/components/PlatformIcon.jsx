import React from 'react';
import {
  SiGithub, SiLinkedin, SiLeetcode, SiCodeforces, SiVercel, SiNetlify, 
  SiDocker, SiMongodb, SiHackerrank, SiGeeksforgeeks, SiX, SiMedium, 
  SiDevdotto, SiStackoverflow, SiGitlab, SiBitbucket, SiWellfound, SiDiscord, SiYoutube, SiCodechef
} from 'react-icons/si';
import { FiLink, FiTarget, FiCode } from 'react-icons/fi';

function PlatformIcon({ platform, size = 24 }) {
  const lower = platform ? platform.toLowerCase() : "";
  
  // Major Tech
  if (lower.includes('github')) return <SiGithub size={size} />;
  if (lower.includes('gitlab')) return <SiGitlab size={size} />;
  if (lower.includes('bitbucket')) return <SiBitbucket size={size} />;
  if (lower.includes('stackoverflow')) return <SiStackoverflow size={size} />;
  
  // Competitive Programming
  if (lower.includes('leetcode')) return <SiLeetcode size={size} />;
  if (lower.includes('codeforces')) return <SiCodeforces size={size} />;
  if (lower.includes('hackerrank')) return <SiHackerrank size={size} />;
  if (lower.includes('geeks')) return <SiGeeksforgeeks size={size} />;
  if (lower.includes('codechef')) return <SiCodechef size={size} />;
  
  // Careers & Portfolios
  if (lower.includes('linkedin')) return <SiLinkedin size={size} />;
  if (lower.includes('wellfound') || lower.includes('angel')) return <SiWellfound size={size} />;
  if (lower.includes('unstop')) return <FiTarget size={size} />;
  if (lower.includes('codolio')) return <FiCode size={size} />;
  
  // Socials / Content
  // 2. FIXED: Use SiX for both "twitter" and "x" inputs
  if (lower.includes('twitter') || lower === 'x') return <SiX size={size} />;
  if (lower.includes('youtube')) return <SiYoutube size={size} />;
  if (lower.includes('discord')) return <SiDiscord size={size} />;
  if (lower.includes('medium')) return <SiMedium size={size} />;
  if (lower.includes('dev.to')) return <SiDevdotto size={size} />;
  
  // Hosting / DevOps
  if (lower.includes('vercel')) return <SiVercel size={size} />;
  if (lower.includes('netlify')) return <SiNetlify size={size} />;
  if (lower.includes('docker')) return <SiDocker size={size} />;
  if (lower.includes('mongo')) return <SiMongodb size={size} />;
  
  // Default fallback
  return <FiLink size={size} />;
}

export default PlatformIcon;