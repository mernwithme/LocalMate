import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  Heart,
  CreditCard,
  MessageSquare,
  X,
  Star,
  Search,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Truck,
  PlayCircle,
  XCircle,
  User,
  Save,
  Lock,
  PhoneCall,
  KeyRound,
  Bell,
  Sparkles,
  Building,
  Pencil,
  Camera,
  Upload,
} from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';
import { Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import ReviewModal from '../components/ReviewModal';
import { CBE_AREAS } from '../data/mockServices';

const CUSTOMER_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
];

const MOCK_CUSTOMER_BOOKINGS = [
  {
    _id: 'bk-101',
    service: {
      _id: 'cbe-srv-001',
      title: 'Emergency Electrical Repair & Circuit Fix',
      price: 250,
      category: 'Home & Emergency Services',
      location: 'Peelamedu, Coimbatore',
    },
    provider: {
      _id: 'usr-pvd-101',
      name: 'Suresh Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      phone: '+91 98421 11001',
    },
    bookingDate: '2026-10-10',
    timeSlot: '10:00 AM - 12:00 PM',
    address: '12 VOC Street, Gandhipuram, Coimbatore',
    status: 'accepted',
    paymentStatus: 'paid',
    totalAmount: 250,
  },
  {
    _id: 'bk-102',
    service: {
      _id: 'cbe-srv-015',
      title: 'Deep Home Cleaning (2BHK / 3BHK)',
      price: 1499,
      category: 'Cleaning & Pest Control',
      location: 'Saravanampatti, Coimbatore',
    },
    provider: {
      _id: 'usr-pvd-115',
      name: 'Lakshmi Deep Clean',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      phone: '+91 98435 66015',
    },
    bookingDate: '2026-10-02',
    timeSlot: '02:00 PM - 05:00 PM',
    address: '12 VOC Street, Gandhipuram, Coimbatore',
    status: 'completed',
    paymentStatus: 'paid',
    totalAmount: 1499,
    reviewed: false,
  },
];

const MOCK_FAVORITE_PROVIDERS = [
  {
    _id: 'usr-pvd-101',
    name: 'Suresh Kumar',
    skill: 'Electrician',
    area: 'Peelamedu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
  },
  {
    _id: 'usr-pvd-111',
    name: 'Kovai Wheels Rental',
    skill: 'Bike Rental',
    area: 'Gandhipuram',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
  },
];

export default function CustomerDashboard() {
  const { user, updateProfile, updateProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState(MOCK_CUSTOMER_BOOKINGS);
  const [favorites, setFavorites] = useState(MOCK_FAVORITE_PROVIDERS);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [name, setName] = useState(user?.name || 'Priya Natarajan');
  const [phone, setPhone] = useState(user?.phone || '+91 98401 23456');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || user?.phone || '+91 98401 23456');
  const [avatar, setAvatar] = useState(user?.avatar || CUSTOMER_AVATAR_PRESETS[0]);
  const [street, setStreet] = useState(user?.address?.street || '12 VOC Street');
  const [landmark, setLandmark] = useState(user?.address?.landmark || 'Near Gandhipuram Cross Cut Road');
  const [area, setArea] = useState(user?.address?.area || 'Gandhipuram');
  const [city, setCity] = useState(user?.address?.city || 'Coimbatore');
  const [pincode, setPincode] = useState(user?.address?.pincode || '641012');
  const [preferredSlot, setPreferredSlot] = useState(user?.preferredTimeSlot || 'Morning (8:00 AM - 12:00 PM)');
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.phone) setPhone(user.phone);
      if (user.whatsapp) setWhatsapp(user.whatsapp);
      if (user.avatar) setAvatar(user.avatar);
      if (user.address?.street) setStreet(user.address.street);
      if (user.address?.landmark) setLandmark(user.address.landmark);
      if (user.address?.area) setArea(user.address.area);
      if (user.address?.pincode) setPincode(user.address.pincode);
      if (user.preferredTimeSlot) setPreferredSlot(user.preferredTimeSlot);
    }
  }, [user]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get('/bookings');
        if (data.success && data.bookings?.length > 0) {
          setBookings(data.bookings);
        }
      } catch (err) {
      }
    };
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    if (String(id).startsWith('bk-')) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled.');
      return;
    }
    try {
      await API.put(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled.');
    } catch (err) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
      );
      toast.success('Booking cancelled (Local update).');
    }
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter((f) => f._id !== id));
    toast.success('Removed from favorites.');
  };

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRefModal = useRef(null);
  const fileInputRefTab = useRef(null);

  const handleLocalPhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please choose a valid image file (PNG, JPG, WEBP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setUploadingPhoto(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await API.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success && (data.url || data.avatar)) {
        setAvatar(data.url || data.avatar);
        toast.success('Photo uploaded from local files!');
      }
    } catch (err) {
      toast.success('Photo selected from local files!');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSavingProfile(true);
    const payload = {
      name,
      phone,
      whatsapp,
      avatar,
      preferredTimeSlot: preferredSlot,
      address: {
        street,
        landmark,
        area,
        city: 'Coimbatore',
        pincode,
        state: 'Tamil Nadu',
      },
    };
    if (newPassword) {
      payload.password = newPassword;
    }

    if (updateProfile) {
      await updateProfile(payload);
    } else {
      const updated = {
        ...user,
        ...payload,
      };
      updateProfileState(updated);
      toast.success('Profile saved successfully.');
    }
    setSavingProfile(false);
    setShowEditProfileModal(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const pendingRequests = bookings.filter((b) => b.status === 'pending');
  const acceptedBookings = bookings.filter((b) => b.status === 'accepted');
  const ongoingBookings = bookings.filter((b) => b.status === 'on_the_way' || b.status === 'started');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const declinedBookings = bookings.filter((b) => b.status === 'rejected' || b.status === 'cancelled');

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Confirmed
          </span>
        );
      case 'on_the_way':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 flex items-center gap-1">
            <Truck className="w-3 h-3 text-indigo-600" /> On the Way
          </span>
        );
      case 'started':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 flex items-center gap-1">
            <PlayCircle className="w-3 h-3 text-teal-600" /> Service Started
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-500" /> Cancelled
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Declined by Provider
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Waiting for provider
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => setShowEditProfileModal(true)}
            title="Click to edit profile & change photo"
          >
            <img
              src={avatar || user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              onError={(e) => handleImageError(e, 'avatar')}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500 transition-all shadow-sm"
            />
            <div className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-white drop-shadow" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
              <Pencil className="w-2.5 h-2.5" />
            </span>
          </div>

          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md mb-1">
              <MapPin className="w-3 h-3" /> {area || 'Gandhipuram'}, Coimbatore
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {user?.name || 'Priya Natarajan'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.email || 'priya@example.com'} • {user?.phone || '+91 98401 23456'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowEditProfileModal(true)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm hover:border-blue-400 dark:hover:border-blue-600"
          >
            <Pencil className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Edit Profile
          </button>
          <Link
            to="/services"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            Find New Service
          </Link>
          <Link
            to="/messages"
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" /> Chat
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'upcoming'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Active ({pendingRequests.length + acceptedBookings.length + ongoingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Pending Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'accepted'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Confirmed Bookings ({acceptedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Completed Services ({completedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('declined')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'declined'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Declined & Cancelled ({declinedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'favorites'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Saved Providers ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Profile & Address
        </button>
      </div>

      {(activeTab === 'upcoming' || activeTab === 'pending' || activeTab === 'accepted' || activeTab === 'declined') && (
        <div className="space-y-4">
          {(() => {
            const list =
              activeTab === 'pending'
                ? pendingRequests
                : activeTab === 'accepted'
                ? acceptedBookings
                : activeTab === 'declined'
                ? declinedBookings
                : [...pendingRequests, ...acceptedBookings, ...ongoingBookings];

            if (list.length === 0) {
              return (
                <div className="glass-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeTab === 'pending'
                      ? 'No pending booking requests.'
                      : activeTab === 'accepted'
                      ? 'No confirmed bookings.'
                      : activeTab === 'declined'
                      ? 'No declined or cancelled bookings.'
                      : 'No active bookings right now.'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Need an electrician, plumber, AC repair, or rental in Coimbatore?
                  </p>
                  <Link to="/services" className="px-5 py-2 inline-block rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm">
                    Find Nearby Services
                  </Link>
                </div>
              );
            }

            return list.map((b) => (
              <div
                key={b._id}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                      {b.service?.category}
                    </span>
                    {renderStatusBadge(b.status)}
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {b.service?.title}
                  </h3>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> {b.bookingDate} • {b.timeSlot}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.address}
                    </p>
                    {b.provider && (
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        Provider: <strong>{b.provider.name}</strong> ({b.provider.phone})
                      </p>
                    )}
                    {b.notes && (
                      <p className="text-slate-500 italic">
                        Your message: "{b.notes}"
                      </p>
                    )}
                    {b.rejectionReason && (
                      <div className="p-2 mt-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs">
                        <strong>Provider Reason:</strong> {b.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 block">
                      ₹{b.totalAmount}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {b.status === 'completed' ? 'Paid' : 'Estimate'}
                    </span>
                  </div>

                  <Link
                    to="/messages"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                    title="Chat with provider"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </Link>

                  {b.status === 'rejected' && (
                    <Link
                      to={`/services?category=${encodeURIComponent(b.service?.category || '')}`}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                    >
                      Choose Another Provider
                    </Link>
                  )}

                  {(b.status === 'pending' || b.status === 'accepted') && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedBookings.length === 0 ? (
            <div className="glass-card p-10 rounded-3xl text-center space-y-3 border border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No completed jobs yet.</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Once a provider finishes your service, you will see it here and can give your review.
              </p>
            </div>
          ) : (
            completedBookings.map((b) => (
              <div
                key={b._id}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Job Completed
                    </span>
                    <span className="text-xs text-slate-400">{b.service?.category}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {b.service?.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Done on {b.bookingDate} by {b.provider?.name || 'Local Provider'}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                      ₹{b.totalAmount}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">Paid</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReviewBooking(b)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    Write Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'favorites' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Saved Coimbatore Providers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {favorites.map((f) => (
              <div
                key={f._id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={f.avatar}
                    alt={f.name}
                    onError={(e) => handleImageError(e, 'avatar')}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-blue-500"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{f.name}</h4>
                    <span className="text-[11px] text-slate-500 block">
                      {f.skill} • {f.area || 'Peelamedu'}, Coimbatore
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(f._id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Remove from favorites"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 bg-white dark:bg-slate-900">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Customer Account Settings
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Personal Profile & Service Address
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Keep your Coimbatore contact and visit address accurate so verified service professionals reach you on schedule.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Profile Photo
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">PNG, JPG, WEBP up to 5MB</span>
                </div>

                <input
                  ref={fileInputRefTab}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleLocalPhotoSelect}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => fileInputRefTab.current?.click()}
                    title="Click to select image from your computer"
                  >
                    <img
                      src={avatar}
                      alt={name}
                      onError={(e) => handleImageError(e, 'avatar')}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-sm group-hover:ring-blue-600 transition-all"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRefTab.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingPhoto ? 'Uploading Photo...' : 'Choose from Local Files'}
                      </button>
                      <span className="text-[11px] text-slate-400">or select a preset:</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {CUSTOMER_AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                            avatar === preset
                              ? 'border-blue-600 scale-105 shadow-sm ring-2 ring-blue-500/30'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt={`preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Or enter an image URL (https://...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  1. Contact Information
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Account Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || 'customer@localmate.com'}
                        readOnly
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 cursor-not-allowed"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (For technician calls)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Number (For booking status)
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  2. Service Location in Coimbatore
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Door No., Building & Street Address
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 12/B, Green Palms Apartment, Cross Cut Road"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prominent Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Gandhipuram Town Bus Stand / Opp. PSG Tech"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Coimbatore Locality
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {CBE_AREAS.filter((a) => a !== 'All Coimbatore Areas').map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="641012"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  3. Service Booking Preferences
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Visit Window
                  </label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                  <input
                    type="checkbox"
                    id="waUpdates"
                    checked={whatsappUpdates}
                    onChange={(e) => setWhatsappUpdates(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="waUpdates" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span className="font-bold block">Receive instant WhatsApp alerts</span>
                    <span className="text-[11px] text-slate-500">Get technician arrival notices and invoice receipts via WhatsApp message.</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Change Password (Optional)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500">
                  Changes save directly to your LocalMate profile.
                </p>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? 'Saving updates...' : 'Save Profile Settings'}
                </button>
              </div>

            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  How Providers See You
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Verified Client
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={avatar}
                    alt={name}
                    onError={(e) => handleImageError(e, 'avatar')}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30"
                  />
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {name || 'Client Name'}
                    </h5>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {area}, Coimbatore
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Street:</span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">{street}</span>
                  </div>
                  {landmark && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Landmark:</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px]">{landmark}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Preferred Slot:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{preferredSlot}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Phone:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{phone}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Fast Booking Dispatch
                </p>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-snug">
                  Accurate street and landmark information prevents arrival delays by technicians navigating Coimbatore roads.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card w-full max-w-xl max-h-[90vh] flex flex-col my-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Edit Profile & Service Address
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update your contact details and Coimbatore service location.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="overflow-y-auto flex-1 p-6 space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Profile Photo
                  </label>
                  <span className="text-[10px] text-slate-500 font-medium">PNG, JPG, WEBP up to 5MB</span>
                </div>

                <input
                  ref={fileInputRefModal}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleLocalPhotoSelect}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    className="relative group cursor-pointer shrink-0"
                    onClick={() => fileInputRefModal.current?.click()}
                    title="Click to select image from your computer"
                  >
                    <img
                      src={avatar}
                      alt={name}
                      onError={(e) => handleImageError(e, 'avatar')}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-sm group-hover:ring-blue-600 transition-all"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRefModal.current?.click()}
                        disabled={uploadingPhoto}
                        className="px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingPhoto ? 'Uploading Photo...' : 'Choose from Local Files'}
                      </button>
                      <span className="text-[11px] text-slate-400">or pick a preset:</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {CUSTOMER_AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className={`w-8 h-8 rounded-xl overflow-hidden border-2 transition-all ${
                            avatar === preset
                              ? 'border-blue-600 scale-105 shadow-sm ring-2 ring-blue-500/30'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt={`preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Or enter image URL (https://...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || 'customer@localmate.com'}
                      readOnly
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Coimbatore Service Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Coimbatore Area / Locality
                    </label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      {CBE_AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="641012"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Street / Door No.
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="12 VOC Street"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near Gandhipuram Cross Cut Road"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Technician Visit Time Slot
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Morning (8:00 AM - 12:00 PM)">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                  <option value="Flexible (Any Time)">Flexible (Any Time)</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-blue-600" /> Change Password (Optional)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New Password (min 6 chars)"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm New Password"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewBooking && (
        <ReviewModal
          service={reviewBooking.service}
          providerId={reviewBooking.provider?._id}
          bookingId={reviewBooking._id}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            toast.success('Your review was saved!');
          }}
        />
      )}

    </div>
  );
}
