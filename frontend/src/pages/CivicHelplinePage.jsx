import React from 'react';
import CivicGrievanceAssistant from '../components/CivicGrievanceAssistant';
import { ShieldCheck, PhoneCall, Zap, Building2, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CivicHelplinePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
          Official TN Public Services Directory
        </span>
      </div>

      <CivicGrievanceAssistant />

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" /> When to call Civic Helplines vs. Booking LocalMate Workers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Use EB Helpline (1912 / WhatsApp 94987 94987) for:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Neighborhood power cuts, grid trips & main transformer outages</li>
              <li>Dangling live electric wires or broken EB street poles</li>
              <li>EB meter spark, phase drop or TANGEDCO line fuse blow</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Use CM Helpline (1100) or GCC (1913) for:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Public road potholes, damaged streetlights & drainage overflow</li>
              <li>Uncollected municipal garbage bins & public sanitation issues</li>
              <li>Municipal water supply pipe leakages in your area</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
