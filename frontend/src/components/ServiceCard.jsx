import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, ShieldCheck, ArrowRight, Heart, CheckCircle2, SlidersHorizontal, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { handleImageError } from '../utils/imageFallback';
import { useAuth } from '../context/AuthContext';

export default function ServiceCard({
  service,
  onBook,
  onToggleCompare,
  isCompared = false,
  showCompareOption = true,
}) {
  const { user } = useAuth();
  const {
    _id,
    title,
    description,
    category,
    price,
    duration,
    images,
    rating = 4.8,
    numReviews = 12,
    location,
    area,
    distanceKm = 1.8,
    experienceRequired,
    availability = 'Available Now',
    isRental,
    dailyPrice,
    provider,
  } = service;

  const imageUrl = images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  const availabilityStatus = provider?.availabilityStatus || availability || 'Available Now';
  const isAvailableNow = availabilityStatus.toLowerCase().includes('available');
  const isBusy = availabilityStatus.toLowerCase().includes('busy');
  const completedJobs = provider?.completedJobs || service.completedJobs || Math.max(numReviews, 18);
  const displayArea = area || provider?.area || location?.split(',')[0] || 'Peelamedu';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`glass-card rounded-2xl overflow-hidden group flex flex-col h-full border transition-all ${
        isCompared
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
          : 'border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-lg'
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => handleImageError(e, 'service')}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-900/80 backdrop-blur-md text-white border border-white/20">
            {category}
          </span>
          {isRental && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500 text-slate-950 uppercase tracking-wider">
              Rental
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 backdrop-blur-md border ${
              isAvailableNow
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                : isBusy
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailableNow ? 'bg-emerald-400 animate-pulse' : isBusy ? 'bg-amber-400' : 'bg-slate-400'
              }`}
            />
            {isAvailableNow ? 'Available Now' : isBusy ? 'Busy' : 'Offline'}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-baseline gap-1.5 text-white drop-shadow-md bg-slate-950/70 px-2.5 py-1 rounded-lg backdrop-blur-sm">
          <span className="text-lg font-extrabold">₹{isRental ? (dailyPrice || price) : price}</span>
          <span className="text-[11px] font-medium text-slate-200">
            {isRental ? '/ day' : 'starting'}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {provider && (
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={provider.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={provider.name}
                  onError={(e) => handleImageError(e, 'avatar')}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500 flex-shrink-0"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {provider.name}
                </span>
                {provider.isVerifiedProvider && (
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" title="Verified Local Provider" />
                )}
              </div>

              <span className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                {provider.experienceYears ? `${provider.experienceYears}y exp` : experienceRequired || 'Verified'}
              </span>
            </div>
          )}

          <Link to={`/services/${_id}`}>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
              {title}
            </h3>
          </Link>

          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="truncate">{displayArea}, Coimbatore</span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md whitespace-nowrap">
              {distanceKm} km away
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900 dark:text-white">{rating}</span>
              <span>({numReviews} reviews)</span>
            </div>
            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-blue-500" />
              {completedJobs} jobs done
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {showCompareOption && onToggleCompare && (
              <button
                type="button"
                onClick={() => onToggleCompare(service)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isCompared
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Compare with other providers"
              >
                {isCompared ? <Check className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
                {isCompared ? 'Compared' : 'Compare'}
              </button>
            )}

            {user?.role === 'provider' ? (
              user?._id === (service.provider?._id || service.provider) ? (
                <Link
                  to="/dashboard/provider"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  Manage Service
                </Link>
              ) : (
                <span className="flex-1 py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-xs text-center border border-slate-200/50 dark:border-slate-800">
                  Provider View
                </span>
              )
            ) : (
              <button
                type="button"
                onClick={() => onBook && onBook(service)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1 transition-all"
              >
                Request Booking <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
