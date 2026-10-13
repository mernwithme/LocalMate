import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  Clock,
  ChevronDown,
  X,
  Bike,
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import CategoryCard from '../components/CategoryCard';
import BookingModal from '../components/BookingModal';
import ContactProviderModal from '../components/ContactProviderModal';
import ProviderComparisonModal from '../components/ProviderComparisonModal';
import EmergencyHelpSection from '../components/EmergencyHelpSection';
import BudgetMatchSection from '../components/BudgetMatchSection';
import MoveInChecklistSection from '../components/MoveInChecklistSection';
import API from '../services/api';
import { CBE_AREAS, LOCALMATE_SECTORS, MOCK_EXPLORE_SERVICES } from '../data/mockServices';
import { heroContent, affordablePricingNotice } from '../data/websiteContent';

export default function LandingPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Coimbatore Areas');
  const [services, setServices] = useState(MOCK_EXPLORE_SERVICES);
  const [comparedServices, setComparedServices] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get('/services?limit=12');
        if (data.success && data.services?.length > 0) {
          setServices(data.services);
        }
      } catch (err) {
        setServices(MOCK_EXPLORE_SERVICES);
      }
    };
    fetchServices();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword.trim()) query.set('keyword', keyword.trim());
    if (selectedArea && selectedArea !== 'All Coimbatore Areas') query.set('area', selectedArea);
    navigate(`/services?${query.toString()}`);
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

  const handleRemoveCompared = (id) => {
    setComparedServices((prev) => prev.filter((s) => s._id !== id));
  };

  const availableNowServices = services.filter((s) => {
    const status = (s.provider?.availabilityStatus || s.availability || '').toLowerCase();
    return status.includes('available');
  }).slice(0, 4);

  const rentalServices = services.filter((s) => s.isRental || s.category === 'Rentals').slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">

      <section className="relative pt-10 pb-12 lg:pt-16 lg:pb-20 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Coimbatore Local Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
              Find a service <span className="text-blue-600 dark:text-blue-400">near you.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              "{heroContent.headline}" Compare local providers on price, rating, distance, and live availability before you book.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <form
              onSubmit={handleHeroSearch}
              className="glass-card p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-lg border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90"
            >
              <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What do you need help with? (e.g. Electrician, Plumber, Bike rental)"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                />
              </div>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2 px-3 w-full sm:w-auto">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="bg-transparent border-none text-slate-900 dark:text-white text-xs font-semibold focus:outline-none cursor-pointer py-1"
                >
                  {CBE_AREAS.map((area) => (
                    <option key={area} value={area} className="dark:bg-slate-900 text-slate-900 dark:text-white">
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                Find Services <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Popular Areas:</span>
              {['Gandhipuram', 'RS Puram', 'Peelamedu', 'Saibaba Colony', 'Singanallur', 'Saravanampatti'].map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    setSelectedArea(area);
                    navigate(`/services?area=${encodeURIComponent(area)}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {area}
                </button>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Core Feature
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Compare local providers before you book.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                We do not just show you one provider and force you to accept. Compare their price, rating, distance, and live availability to pick the best match for your home.
              </p>
            </div>

            <Link
              to="/services?category=Home & Emergency Services"
              className="self-start md:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              Try Comparing Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">Suresh Kumar (Provider A)</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Available Now
                </span>
              </div>
              <div className="text-slate-400">Electrician • Peelamedu</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-base font-extrabold text-blue-400">₹250</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8
                </span>
                <span className="text-slate-300">1.2 km away</span>
                <span className="text-emerald-400 font-semibold">42 jobs done</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">Karthik Raja (Provider B)</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Available Now
                </span>
              </div>
              <div className="text-slate-400">Electrician • Gandhipuram</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-base font-extrabold text-blue-400">₹200</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.5
                </span>
                <span className="text-slate-300">2.1 km away</span>
                <span className="text-emerald-400 font-semibold">35 jobs done</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-white">Muruganandam (Provider C)</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Busy
                </span>
              </div>
              <div className="text-slate-400">Electrician • RS Puram</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <span className="text-base font-extrabold text-blue-400">₹300</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.9
                </span>
                <span className="text-slate-300">3.4 km away</span>
                <span className="text-emerald-400 font-semibold">67 jobs done</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="emergency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EmergencyHelpSection
          services={services}
          onBookService={(srv) => setSelectedServiceForBooking(srv)}
          onContactProvider={(srv) => setSelectedServiceForContact(srv)}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Now
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Providers Available Now in Coimbatore
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              These local experts have their status set to 'Available Now' and can take new jobs right away.
            </p>
          </div>
          <Link
            to="/services?availableNow=true"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            See All Available Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {availableNowServices.map((srv) => (
            <ServiceCard
              key={srv._id}
              service={srv}
              onBook={(s) => setSelectedServiceForBooking(s)}
              onToggleCompare={handleToggleCompare}
              isCompared={comparedServices.some((c) => c._id === srv._id)}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BudgetMatchSection
          services={services}
          onBookService={(srv) => setSelectedServiceForBooking(srv)}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MoveInChecklistSection
          services={services}
          onBookService={(srv) => setSelectedServiceForBooking(srv)}
        />
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Bike className="w-4 h-4" /> Vehicles & Equipment
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Rental Services in Coimbatore
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rent bikes, scooters, DSLR cameras, sound systems, and laptops with clear daily rates and pickup spots.
            </p>
          </div>
          <Link
            to="/services?category=Rentals"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            Browse All Rentals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {rentalServices.map((srv) => (
            <ServiceCard
              key={srv._id}
              service={srv}
              onBook={(s) => setSelectedServiceForBooking(s)}
              onToggleCompare={handleToggleCompare}
              isCompared={comparedServices.some((c) => c._id === srv._id)}
            />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">All Sectors</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Browse Coimbatore Service Sectors
            </h2>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            All Services <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {LOCALMATE_SECTORS.map((sector) => (
            <Link
              key={sector.name}
              to={`/services?category=${encodeURIComponent(sector.name)}`}
              className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {sector.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {sector.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 font-semibold">
                <span>View Providers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {affordablePricingNotice.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {affordablePricingNotice.description}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {affordablePricingNotice.platformFee}
          </div>
        </div>
      </section>

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
          onRemoveService={handleRemoveCompared}
          onClearAll={() => setComparedServices([])}
          onClose={() => setIsCompareModalOpen(false)}
          onBookService={(srv) => setSelectedServiceForBooking(srv)}
        />
      )}

      {selectedServiceForBooking && (
        <BookingModal
          service={selectedServiceForBooking}
          onClose={() => setSelectedServiceForBooking(null)}
          onSuccess={() => {
            setSelectedServiceForBooking(null);
          }}
        />
      )}

      {selectedServiceForContact && (
        <ContactProviderModal
          service={selectedServiceForContact}
          provider={selectedServiceForContact.provider}
          onClose={() => setSelectedServiceForContact(null)}
        />
      )}

    </div>
  );
}
