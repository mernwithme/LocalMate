import React from 'react';

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse border border-slate-200/80 dark:border-slate-800 space-y-4 p-4">
      <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
      </div>
    </div>
  );
}
