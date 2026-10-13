import React, { useState } from 'react';
import { Home, CheckSquare, Square, ArrowRight, Sparkles, Check, CheckCircle2, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOVE_IN_CHECKLIST } from '../data/mockServices';

export default function MoveInChecklistSection({ services = [], onBookService }) {
  const [selectedTasks, setSelectedTasks] = useState(['clean', 'electric', 'ac']);

  const toggleTask = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const matchedServices = services.filter((srv) => {
    const srvText = (srv.title + ' ' + srv.category + ' ' + (srv.tags || []).join(' ')).toLowerCase();
    return selectedTasks.some((taskId) => {
      const item = MOVE_IN_CHECKLIST.find((c) => c.id === taskId);
      return item && srvText.includes(item.matchKeyword.toLowerCase());
    });
  });

  return (
    <section className="rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Home className="w-3.5 h-3.5" /> Coimbatore Home Setup
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Just moved into a new home?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Moving into a new apartment or house in Coimbatore? Select the services you need below and we will show you trusted local providers ready to help.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-8">
        {MOVE_IN_CHECKLIST.map((item) => {
          const isChecked = selectedTasks.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleTask(item.id)}
              className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center gap-2.5 transition-all ${
                isChecked
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              {isChecked ? (
                <CheckSquare className="w-4 h-4 text-white flex-shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Showing providers for {selectedTasks.length} selected setup tasks:</span>
        </div>

        {selectedTasks.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedTasks([])}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            Clear Selected
          </button>
        )}
      </div>

      {matchedServices.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Select one or more items from the checklist above to find matching providers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchedServices.slice(0, 6).map((srv) => (
            <motion.div
              key={srv._id}
              whileHover={{ y: -3 }}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {srv.category}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-slate-500">
                    <MapPin className="w-3 h-3" /> {srv.area || 'Peelamedu'}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {srv.title}
                </h4>

                <div className="flex items-center gap-2 mt-2">
                  <img
                    src={srv.provider?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                    alt={srv.provider?.name || 'Provider'}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {srv.provider?.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    • ⭐ {srv.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    ₹{srv.price}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">starting</span>
                </div>

                <button
                  type="button"
                  onClick={() => onBookService && onBookService(srv)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-all"
                >
                  Request Booking <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
