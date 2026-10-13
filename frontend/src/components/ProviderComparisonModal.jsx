import React from 'react';
import { X, Star, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Clock, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleImageError } from '../utils/imageFallback';

export default function ProviderComparisonModal({
  comparedServices = [],
  onRemoveService,
  onClearAll,
  onClose,
  onBookService,
}) {
  if (comparedServices.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        >
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-600 text-white">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Compare Coimbatore Providers
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Compare price, rating, distance, availability, and completed jobs side by side before choosing.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {comparedServices.length > 1 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-all"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Close comparison"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1 py-2">Metric</div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="relative bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl flex flex-col justify-between">
                    <button
                      onClick={() => onRemoveService(srv._id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-2 mb-2 pr-6">
                      <img
                        src={srv.provider?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={srv.provider?.name || 'Provider'}
                        onError={(e) => handleImageError(e, 'avatar')}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate">
                          {srv.provider?.name || 'Provider'}
                        </h4>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block truncate">
                          {srv.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">
                      {srv.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  Starting Price
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="font-extrabold text-base text-blue-600 dark:text-blue-400">
                    ₹{srv.isRental ? (srv.dailyPrice || srv.price) : srv.price}
                    <span className="text-[11px] font-normal text-slate-400 ml-1">
                      {srv.isRental ? '/ day' : 'onwards'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Rating & Reviews
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{srv.rating || 4.8}</span>
                    <span className="text-slate-400 text-[11px]">({srv.numReviews || 12} reviews)</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Live Status
                </div>
                {comparedServices.map((srv) => {
                  const status = srv.provider?.availabilityStatus || srv.availability || 'Available Now';
                  const isAvail = status.toLowerCase().includes('available');
                  const isBusy = status.toLowerCase().includes('busy');
                  return (
                    <div key={srv._id}>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                          isAvail
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : isBusy
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isAvail ? 'bg-emerald-500' : isBusy ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        {isAvail ? 'Available Now' : isBusy ? 'Busy' : 'Offline'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Distance
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{srv.distanceKm || 1.8} km away</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Experience
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="text-slate-700 dark:text-slate-300 font-medium">
                    {srv.provider?.experienceYears ? `${srv.provider.experienceYears} Years experience` : srv.experienceRequired || 'Verified'}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Completed Jobs
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{srv.provider?.completedJobs || srv.completedJobs || Math.max(srv.numReviews || 0, 20)} jobs completed</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 py-3 border-b border-slate-100 dark:border-slate-800 items-center text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">
                  Coimbatore Area
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id} className="text-slate-600 dark:text-slate-400 font-medium">
                    {srv.area || srv.location || 'Peelamedu, Coimbatore'}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 items-center text-xs">
                <div className="font-bold text-slate-500">
                  Book Decision
                </div>
                {comparedServices.map((srv) => (
                  <div key={srv._id}>
                    <button
                      type="button"
                      onClick={() => {
                        onBookService(srv);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      Request Booking <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 text-center">
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
