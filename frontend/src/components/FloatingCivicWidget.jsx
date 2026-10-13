import React, { useState } from 'react';
import { ShieldAlert, X, PhoneCall, MessageSquare, ExternalLink, Zap, Building2, MapPin } from 'lucide-react';
import { HELPLINE_DATA } from './CivicGrievanceAssistant';
import { Link } from 'react-router-dom';

export default function FloatingCivicWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs shadow-xl border border-slate-700 hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>TN Civic & EB Helplines</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Emergency Utility Routing
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Tamil Nadu Utility & Civic Helplines
              </h3>
              <p className="text-xs text-slate-500">Official state-wide grievance redressal call lines</p>
            </div>

            <div className="space-y-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> TANGEDCO / EB Grievance
                  </span>
                  <a
                    href="tel:1912"
                    className="px-3 py-1 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center gap-1 shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call 1912
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Power cuts, fuse blows, voltage drops & billing (24/7 State-wide).</p>
                <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">WhatsApp Photos: 94987 94987</span>
                  <a
                    href="https://wa.me/919498794987"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-600 underline flex items-center gap-0.5"
                  >
                    <MessageSquare className="w-3 h-3" /> Chat WhatsApp
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" /> CM Helpline IPGRS
                  </span>
                  <a
                    href="tel:1100"
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call 1100
                  </a>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Universal State-wide municipal line for garbage, roads, water & streetlights.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Chennai City Corporate Helpline
                  </span>
                  <div className="flex gap-1.5">
                    <a href="tel:1913" className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]">GCC 1913</a>
                    <a href="tel:1916" className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-[11px]">Metro 1916</a>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">GCC (1913) for city roads/garbage; CMWSSB (1916) for Metro water & sewer.</p>
              </div>

            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                to="/civic-helplines"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Open Full Assistant Page <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
