import React, { useState } from 'react';
import { Zap, Droplets, Key, Snowflake, Bike, Car, Wrench, Phone, MessageSquare, ArrowRight, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EMERGENCY_PROBLEMS } from '../data/mockServices';

const ICON_MAP = {
  Zap,
  Droplets,
  Key,
  Snowflake,
  Bike,
  Car,
  HelpCircle: Wrench,
};

export default function EmergencyHelpSection({ services = [], onBookService, onContactProvider }) {
  const [selectedProblem, setSelectedProblem] = useState(EMERGENCY_PROBLEMS[0]);

  const filteredEmergencyProviders = services.filter((srv) => {
    const isAvail = (srv.provider?.availabilityStatus || srv.availability || '').toLowerCase().includes('available');
    if (!isAvail) return false;

    const titleLower = (srv.title + ' ' + srv.category + ' ' + (srv.tags || []).join(' ')).toLowerCase();
    const tagLower = selectedProblem.tag.toLowerCase();

    if (selectedProblem.id === 'power') {
      return titleLower.includes('electric') || titleLower.includes('power') || titleLower.includes('circuit') || titleLower.includes('inverter');
    }
    if (selectedProblem.id === 'water') {
      return titleLower.includes('plumb') || titleLower.includes('leak') || titleLower.includes('pipe') || titleLower.includes('motor');
    }
    if (selectedProblem.id === 'lock') {
      return titleLower.includes('lock') || titleLower.includes('carpenter') || titleLower.includes('door');
    }
    if (selectedProblem.id === 'ac') {
      return titleLower.includes('ac') || titleLower.includes('cooling');
    }
    if (selectedProblem.id === 'bike') {
      return titleLower.includes('bike') || titleLower.includes('puncture') || titleLower.includes('mechanic');
    }
    if (selectedProblem.id === 'car') {
      return titleLower.includes('car') || titleLower.includes('battery') || titleLower.includes('mechanic');
    }
    return titleLower.includes(tagLower) || srv.category === 'Home & Emergency Services';
  }).slice(0, 3);

  return (
    <section className="rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Fast Assistance
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Need Help Now?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Pick your emergency problem. We will show nearby Coimbatore providers who are available right now.
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 self-start flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Available Now</span> providers only
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
        {EMERGENCY_PROBLEMS.map((prob) => {
          const IconComp = ICON_MAP[prob.icon] || Wrench;
          const isSelected = selectedProblem.id === prob.id;
          return (
            <button
              key={prob.id}
              onClick={() => setSelectedProblem(prob)}
              type="button"
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-500/25 scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-rose-400'
              }`}
            >
              <IconComp className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : 'text-rose-500'}`} />
              <span className="text-center line-clamp-1">{prob.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <span>Available Providers for:</span>
          <span className="text-rose-600 dark:text-rose-400 underline decoration-rose-500 underline-offset-4">
            {selectedProblem.label}
          </span>
        </h3>

        {filteredEmergencyProviders.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No specific provider currently online for this problem. You can still search all Coimbatore providers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredEmergencyProviders.map((srv) => {
              const p = srv.provider || {};
              const phone = p.phone || '+91 98421 11001';
              return (
                <motion.div
                  key={srv._id}
                  whileHover={{ y: -3 }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                            {p.name}
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {srv.area || 'Peelamedu'}, Coimbatore
                          </span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available Now
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 line-clamp-1 mb-1">
                      {srv.title}
                    </h5>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <MapPin className="w-3.5 h-3.5" />
                        {srv.distanceKm || 1.4} km away
                      </span>
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                        ₹{srv.price} <span className="text-[10px] font-normal text-slate-400">starting</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <a
                      href={`tel:${phone}`}
                      className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      title={`Call ${p.name}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call
                    </a>

                    <button
                      type="button"
                      onClick={() => onContactProvider && onContactProvider(srv)}
                      className="py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                      title="Chat with provider"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-blue-600" /> Chat
                    </button>

                    <button
                      type="button"
                      onClick={() => onBookService && onBookService(srv)}
                      className="py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/30 flex items-center justify-center gap-1 transition-all"
                    >
                      Request <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
