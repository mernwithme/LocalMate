import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  RotateCcw,
  CheckCircle2,
  Filter,
  ArrowRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceCard from '../components/ServiceCard';
import BookingModal from '../components/BookingModal';
import ProviderComparisonModal from '../components/ProviderComparisonModal';
import Loader from '../components/Loader';
import API from '../services/api';
import { CBE_AREAS, LOCALMATE_SECTORS, MOCK_EXPLORE_SERVICES, matchArea } from '../data/mockServices';

const ALL_CATEGORIES = [
  'All',
  ...LOCALMATE_SECTORS.map((s) => s.name),
];

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'All Coimbatore Areas');
  const [availableNowOnly, setAvailableNowOnly] = useState(searchParams.get('availableNow') === 'true');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState(searchParams.get('sort') || 'nearest');

  const [services, setServices] = useState(MOCK_EXPLORE_SERVICES);
  const [loading, setLoading] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [comparedServices, setComparedServices] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          keyword,
          category: selectedCategory,
          area: selectedArea !== 'All Coimbatore Areas' ? selectedArea : '',
          availableNow: availableNowOnly ? 'true' : '',
          maxPrice,
          rating: minRating,
          sort,
        });

        const { data } = await API.get(`/services?${queryParams.toString()}`);
        if (data.success && data.services?.length > 0) {
          setServices(data.services);
        } else {
          filterMockServices();
        }
      } catch (err) {
        filterMockServices();
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [keyword, selectedCategory, selectedArea, availableNowOnly, maxPrice, minRating, sort]);

  const filterMockServices = () => {
    let result = [...MOCK_EXPLORE_SERVICES];

    if (keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(kw) ||
          s.category.toLowerCase().includes(kw) ||
          (s.description || '').toLowerCase().includes(kw) ||
          (s.area || '').toLowerCase().includes(kw) ||
          (s.provider?.name || '').toLowerCase().includes(kw)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(
        (s) =>
          s.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'Rentals' && s.isRental)
      );
    }

    if (selectedArea !== 'All Coimbatore Areas') {
      result = result.filter((s) => matchArea(s.area || s.location, selectedArea));
    }

    if (availableNowOnly) {
      result = result.filter((s) => {
        const status = (s.provider?.availabilityStatus || s.availability || '').toLowerCase();
        return status.includes('available');
      });
    }

    result = result.filter((s) => {
      const effectivePrice = s.isRental ? (s.dailyPrice || s.price) : s.price;
      return effectivePrice <= maxPrice;
    });

    if (minRating > 0) {
      result = result.filter((s) => s.rating >= minRating);
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'top-rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'nearest') {
      result.sort((a, b) => (a.distanceKm || 1.8) - (b.distanceKm || 1.8));
    } else if (sort === 'available-now') {
      result.sort((a, b) => {
        const aAvail = (a.provider?.availabilityStatus || a.availability || '').includes('Available');
        const bAvail = (b.provider?.availabilityStatus || b.availability || '').includes('Available');
        return (bAvail ? 1 : 0) - (aAvail ? 1 : 0);
      });
    } else if (sort === 'experienced') {
      result.sort((a, b) => (b.provider?.completedJobs || 0) - (a.provider?.completedJobs || 0));
    }

    setServices(result);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('All');
    setSelectedArea('All Coimbatore Areas');
    setAvailableNowOnly(false);
    setMaxPrice(15000);
    setMinRating(0);
    setSort('nearest');
    setSearchParams({});
  };

  const handleToggleCompare = (service) => {
    setComparedServices((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      if (exists) {
        return prev.filter((s) => s._id !== service._id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], service];
      }
      return [...prev, service];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600" /> Coimbatore Services & Rentals
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Compare & Book Local Providers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            "Find trusted services near you." Compare price, distance, rating, and live availability across Coimbatore.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
          >
            <Filter className="w-4 h-4 text-blue-600" /> Filters
          </button>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nearest">Nearest (Distance)</option>
              <option value="price-low">Lowest Price</option>
              <option value="top-rated">Highest Rating</option>
              <option value="available-now">Available Now First</option>
              <option value="experienced">Most Experienced</option>
              <option value="price-high">Highest Price</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <aside
          className={`space-y-6 md:block ${
            mobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Filters
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Search Service or Provider
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Electrician, RO, Bike"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available Now
                  </span>
                  <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 block">
                    Show providers ready to take jobs now
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={availableNowOnly}
                  onChange={(e) => setAvailableNowOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Coimbatore Area
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {CBE_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Service Sector
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                <span>Max Budget</span>
                <span className="text-blue-600 dark:text-blue-400">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="100"
                max="15000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>₹100</span>
                <span>₹15,000+</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[0, 4, 4.5, 4.8].map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setMinRating(rt)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      minRating === rt
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {rt === 0 ? 'All' : `${rt}+ ⭐`}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        <div className="md:col-span-3 space-y-4">

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{services.length}</strong> providers in Coimbatore
            </span>
            {availableNowOnly && (
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Filtered to Available Now
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-20 flex justify-center">
              <Loader />
            </div>
          ) : services.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                No matching providers found in this area.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Try selecting "All Coimbatore Areas", expanding your budget, or turning off the "Available Now" filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onBook={(s) => setSelectedServiceForBooking(s)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={comparedServices.some((c) => c._id === service._id)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {comparedServices.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-2xl border border-slate-700 flex items-center gap-4 max-w-xl w-[90%]"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-xs font-bold flex items-center justify-center shrink-0">
                {comparedServices.length}
              </span>
              <div className="text-xs truncate">
                <span className="font-bold">Providers in Compare Dock</span>
                <span className="text-slate-400 ml-1.5 hidden sm:inline">
                  ({comparedServices.map((s) => s.provider?.name || s.title).join(', ')})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setComparedServices([])}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setIsCompareModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
              >
                Compare Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCompareModalOpen && (
        <ProviderComparisonModal
          comparedServices={comparedServices}
          onRemoveService={(id) => setComparedServices((prev) => prev.filter((s) => s._id !== id))}
          onClearAll={() => setComparedServices([])}
          onClose={() => setIsCompareModalOpen(false)}
          onBookService={(srv) => setSelectedServiceForBooking(srv)}
        />
      )}

      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onSuccess={() => setSelectedServiceForBooking(null)}
        />
      )}

    </div>
  );
}
