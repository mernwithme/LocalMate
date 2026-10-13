import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Share2,
  Heart,
  ArrowLeft,
  Phone,
  CheckCircle2,
  AlertCircle,
  Bike,
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';
import ContactProviderModal from '../components/ContactProviderModal';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import { handleImageError } from '../utils/imageFallback';
import { MOCK_EXPLORE_SERVICES } from '../data/mockServices';

const MOCK_CBE_SERVICE_DETAILS = {
  _id: 'cbe-srv-001',
  title: 'Emergency Electrical Repair & Circuit Fix',
  description:
    'Complete home electrical inspection, short-circuit troubleshooting, breaker replacements, inverter wiring, and outlet repairs with safety certification in Peelamedu, Gandhipuram, and Avinashi Road.',
  category: 'Home & Emergency Services',
  price: 250,
  duration: '45-60 Mins',
  rating: 4.8,
  numReviews: 42,
  location: 'Peelamedu, Coimbatore',
  area: 'Peelamedu',
  distanceKm: 1.2,
  experienceRequired: '6 Years experience',
  availability: 'Available Now',
  images: [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
  ],
  provider: {
    _id: 'usr-pvd-101',
    name: 'Suresh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Trusted local electrician in Peelamedu with 6 years of experience. Quick response with standard safety testing kit.',
    rating: 4.8,
    numReviews: 42,
    completedJobs: 42,
    availabilityStatus: 'Available Now',
    area: 'Peelamedu',
    phone: '+91 98421 11001',
    isVerifiedProvider: true,
    skills: ['Wiring', 'Switch Board', 'Inverter Check', 'Emergency Power'],
  },
  reviews: [
    {
      _id: 'rev-1',
      user: { name: 'Priya Natarajan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
      rating: 5,
      comment: 'Suresh arrived right on time at our Gandhipuram home and fixed our tripping breaker in 30 minutes! Very honest and clear.',
      createdAt: '2026-10-02',
    },
    {
      _id: 'rev-2',
      user: { name: 'Karthik Raja', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
      rating: 4.8,
      comment: 'Replaced faulty switches and checked the inverter battery voltage safely. Highly recommended in Peelamedu.',
      createdAt: '2026-09-28',
    },
  ],
};

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(MOCK_CBE_SERVICE_DETAILS);
  const [activeImage, setActiveImage] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await API.get(`/services/${id}`);
        if (data.success && data.service) {
          setService(data.service);
          return;
        }
      } catch (err) {
      }

      const foundMock = MOCK_EXPLORE_SERVICES.find((s) => s._id === id);
      if (foundMock) {
        setService({
          ...MOCK_CBE_SERVICE_DETAILS,
          ...foundMock,
          reviews: MOCK_CBE_SERVICE_DETAILS.reviews,
        });
      }
    };

    if (id) fetchService();
  }, [id]);

  const p = service.provider || {};
  const status = p.availabilityStatus || service.availability || 'Available Now';
  const isAvailableNow = status.toLowerCase().includes('available');
  const isBusy = status.toLowerCase().includes('busy');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <Link to="/services" className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Coimbatore Services
        </Link>
        <span className="bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md font-bold">
          Coimbatore Verified Listing
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">

          <div className="glass-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative h-80 sm:h-96 w-full bg-slate-100 dark:bg-slate-800">
              <img
                src={service.images?.[activeImage] || service.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
                alt={service.title}
                onError={(e) => handleImageError(e, 'service')}
                className="w-full h-full object-cover"
              />

              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-md ${
                    isAvailableNow
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                      : isBusy
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isAvailableNow ? 'bg-emerald-400' : isBusy ? 'bg-amber-400' : 'bg-slate-400'}`} />
                  {isAvailableNow ? 'Available Now' : isBusy ? 'Busy' : 'Offline'}
                </span>
              </div>
            </div>

            {service.images?.length > 1 && (
              <div className="p-3 flex items-center gap-3 overflow-x-auto bg-slate-50 dark:bg-slate-900/40">
                {service.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === idx ? 'border-blue-600 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                {service.category}
              </span>
              {service.isRental && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500 text-slate-950 flex items-center gap-1">
                  <Bike className="w-3 h-3" /> Rental Option
                </span>
              )}
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                {service.area || 'Peelamedu'}, Coimbatore
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                {service.distanceKm || 1.2} km away
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {service.title}
            </h1>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 border-y border-slate-100 dark:border-slate-800 py-3">
              <span className="flex items-center gap-1 text-slate-900 dark:text-white">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <strong>{service.rating}</strong> ({service.numReviews} customer reviews)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                {p.completedJobs || 42} jobs completed
              </span>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                About this service:
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.description}
              </p>
            </div>

            {service.isRental && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Bike className="w-4 h-4" /> Rental Details
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-500 block">Daily Price:</span>
                    <strong className="text-slate-900 dark:text-white">₹{service.dailyPrice || service.price}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hourly Rate:</span>
                    <strong className="text-slate-900 dark:text-white">₹{service.hourlyPrice || 60}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Deposit:</span>
                    <strong className="text-slate-900 dark:text-white">₹{service.securityDeposit || 1000}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Helmets:</span>
                    <strong className="text-emerald-600">Included</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Pickup spot: <strong>{service.pickupLocation || 'Gandhipuram, Coimbatore'}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                Customer Reviews ({service.reviews?.length || 2})
              </h3>
            </div>

            <div className="space-y-3">
              {(service.reviews || []).map((rev) => (
                <div
                  key={rev._id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'}
                        alt={rev.user?.name}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-500"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{rev.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      ⭐ {rev.rating}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    "{rev.comment}"
                  </p>
                  <span className="text-[10px] text-slate-400 block">{rev.createdAt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="space-y-6">

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 sticky top-24 shadow-lg">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Starting Rate
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  ₹{service.price}
                </span>
                <span className="text-xs text-slate-500">
                  {service.isRental ? '/ day' : 'onwards'}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Base Service Visit</span>
                <strong className="text-slate-900 dark:text-white">₹{service.price}</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Platform Booking Fee</span>
                <strong className="text-emerald-600 dark:text-emerald-400">₹0 (Free)</strong>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Upfront</span>
                <span className="text-blue-600 dark:text-blue-400">₹{service.price}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
            </p>

            <div className="space-y-2.5 pt-2">
              {user?.role === 'provider' ? (
                user?._id === (service.provider?._id || service.provider) ? (
                  <Link
                    to="/dashboard/provider"
                    className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm block text-center transition-all"
                  >
                    Manage Your Service Listing
                  </Link>
                ) : (
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-center text-slate-500 font-semibold">
                    Providers cannot book other services
                  </div>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all"
                >
                  Request Booking
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowContactModal(true)}
                className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Chat with Provider
              </button>
            </div>

            {p && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Service Provider
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1">
                      {p.name}
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {p.area || service.area || 'Peelamedu'}, Coimbatore
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {p.bio}
                </p>

                <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <a href={`tel:${p.phone || '+919842111001'}`} className="hover:underline">
                    {p.phone || '+91 98421 11001'}
                  </a>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            toast.success('Your service has been scheduled!');
          }}
        />
      )}

      {showContactModal && (
        <ContactProviderModal
          service={service}
          provider={service.provider}
          onClose={() => setShowContactModal(false)}
        />
      )}

    </div>
  );
}
