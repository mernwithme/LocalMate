import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, percentage, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </h3>
        {percentage && (
          <div className="flex items-center gap-1 text-xs font-semibold">
            {trend === 'up' ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{percentage}%
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> -{percentage}%
              </span>
            )}
            <span className="text-slate-400 font-normal">vs last month</span>
          </div>
        )}
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color] || colorMap.blue}`}>
        {Icon && <Icon className="w-6 h-6 stroke-[2.2]" />}
      </div>
    </div>
  );
}
