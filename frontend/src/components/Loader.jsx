import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = 'Loading... Please wait...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-3">
      <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {text}
      </span>
    </div>
  );
}
