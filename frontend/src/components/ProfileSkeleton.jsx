import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-pulse">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
        
        {/* Avatar Skeleton */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          {/* Camera Icon Placeholder */}
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-[#020617]"></div>
        </div>

        {/* Text Info Skeletons */}
        <div className="flex-1 text-center md:text-left space-y-4 w-full">
          {/* Name */}
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto md:mx-0"></div>
          {/* Email / Tagline */}
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 mx-auto md:mx-0"></div>
          
          {/* Stats / Badges */}
          <div className="flex justify-center md:justify-start gap-3 pt-2">
            <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* --- FORM / DETAILS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column Input Placeholders */}
        <div className="space-y-6">
          <div>
            <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
          </div>
          <div>
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
          </div>
        </div>

        {/* Right Column Input Placeholders */}
        <div className="space-y-6">
          <div>
            <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-12 w-full bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
          </div>
          <div>
            <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
            <div className="h-32 w-full bg-slate-100 dark:bg-slate-900 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="flex justify-end pt-4 gap-4">
        <div className="h-12 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-12 w-40 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
      </div>

    </div>
  );
};

export default ProfileSkeleton;