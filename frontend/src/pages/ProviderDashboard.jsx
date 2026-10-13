import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import {
  DollarSign,
  Briefcase,
  Star,
  Plus,
  CheckCircle2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  AlertCircle,
  Truck,
  PlayCircle,
  Check,
  X,
  ShieldCheck,
  Send,
  Save,
  Lock,
  Sparkles,
  PhoneCall,
  Zap,
  Pencil,
  Upload,
  Camera,
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';
import API from '../services/api';
import { CBE_AREAS, LOCALMATE_SECTORS } from '../data/mockServices';

const PROVIDER_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
];

const REVENUE_DATA = [
  { month: 'May', revenue: 6400 },
  { month: 'Jun', revenue: 8200 },
  { month: 'Jul', revenue: 9500 },
  { month: 'Aug', revenue: 11200 },
  { month: 'Sep', revenue: 12800 },
  { month: 'Oct', revenue: 14500 },
];

const INITIAL_SERVICES = [
  {
    _id: 'cbe-srv-001',
    title: 'Emergency Electrical Repair & Circuit Fix',
    category: 'Home & Emergency Services',
    price: 250,
    duration: '45-60 Mins',
    area: 'Peelamedu',
    status: 'active',
  },
  {
    _id: 'cbe-srv-025',
    title: 'RO Water Purifier Installation & Filter Change',
    category: 'Home & Emergency Services',
    price: 349,
    duration: '45 Mins',
    area: 'Peelamedu',
    status: 'active',
  },
];

const INITIAL_BOOKING_REQUESTS = [
  {
    _id: 'bk-201',
    customerName: 'Priya Natarajan',
    customerPhone: '+91 98401 23456',
    serviceTitle: 'Emergency Electrical Repair & Circuit Fix',
    bookingDate: '2026-10-10',
    timeSlot: '10:00 AM - 12:00 PM',
    address: '12 VOC Street, Gandhipuram, Coimbatore',
    amount: 250,
    status: 'pending',
    notes: 'Circuit breaker trips when AC is turned on.',
  },
  {
    _id: 'bk-202',
    customerName: 'Karthik Subramanian',
    customerPhone: '+91 98422 33445',
    serviceTitle: 'RO Water Purifier Installation & Filter Change',
    bookingDate: '2026-10-10',
    timeSlot: '02:00 PM - 04:00 PM',
    address: '45 Avinashi Road, Peelamedu, Coimbatore',
    amount: 349,
    status: 'accepted',
    notes: 'Need sediment and carbon filter replacement.',
  },
  {
    _id: 'bk-203',
    customerName: 'Sangeetha R.',
    customerPhone: '+91 98433 55667',
    serviceTitle: 'Emergency Electrical Repair & Circuit Fix',
    bookingDate: '2026-10-09',
    timeSlot: '11:00 AM - 01:00 PM',
    address: '18 DB Road, RS Puram, Coimbatore',
    amount: 250,
    status: 'completed',
  },
];

const REJECTION_REASONS = [
  'Not available at this time',
  'Already booked for this slot',
  'Outside my service area',
  'Requires specialized tools not currently available',
  'Other',
];

export default function ProviderDashboard() {
  const { user, updateProfile, updateProfileState } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingFilter, setBookingFilter] = useState('all');
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [bookingRequests, setBookingRequests] = useState(INITIAL_BOOKING_REQUESTS);

  const [availabilityStatus, setAvailabilityStatus] = useState(
    user?.availabilityStatus || 'Available Now'
  );

  const [providerName, setProviderName] = useState(user?.name || 'Suresh Kumar');
  const [providerPhone, setProviderPhone] = useState(user?.phone || '+91 98421 11001');
  const [providerWhatsapp, setProviderWhatsapp] = useState(user?.whatsapp || user?.phone || '+91 98421 11001');
  const [providerAvatar, setProviderAvatar] = useState(user?.avatar || PROVIDER_AVATAR_PRESETS[0]);
  const [bio, setBio] = useState(
    user?.bio || 'Trusted electrician in Peelamedu with 6 years experience. Specializes in emergency circuit repairs.'
  );
  const [skills, setSkills] = useState(
    user?.skills?.join(', ') || 'Wiring, Switch Board, Inverter Check, Emergency Power'
  );
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || 6);
  const [startingPrice, setStartingPrice] = useState(user?.startingPrice || 250);
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 350);
  const [serviceArea, setServiceArea] = useState(user?.address?.area || 'Peelamedu');
  const [emergencyAvailable, setEmergencyAvailable] = useState(
    user?.emergencyAvailable !== undefined ? user?.emergencyAvailable : true
  );
  const [coverageZones, setCoverageZones] = useState(
    user?.serviceAreas || ['Peelamedu', 'Gandhipuram', 'RS Puram', 'Ganapathy']
  );
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProviderProfile, setSavingProviderProfile] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setProviderName(user.name);
      if (user.phone) setProviderPhone(user.phone);
      if (user.whatsapp) setProviderWhatsapp(user.whatsapp);
      if (user.avatar) setProviderAvatar(user.avatar);
      if (user.bio) setBio(user.bio);
      if (user.skills) setSkills(user.skills.join(', '));
      if (user.experienceYears) setExperienceYears(user.experienceYears);
      if (user.startingPrice) setStartingPrice(user.startingPrice);
      if (user.hourlyRate) setHourlyRate(user.hourlyRate);
      if (user.address?.area) setServiceArea(user.address.area);
      if (user.serviceAreas) setCoverageZones(user.serviceAreas);
      if (user.emergencyAvailable !== undefined) setEmergencyAvailable(user.emergencyAvailable);
    }
  }, [user]);

  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Home & Emergency Services');
  const [newPrice, setNewPrice] = useState(250);
  const [newDuration, setNewDuration] = useState('1 Hour');
  const [newArea, setNewArea] = useState('Peelamedu');
  const [isRental, setIsRental] = useState(false);

  const [editingService, setEditingService] = useState(null);

  const [rejectModalBooking, setRejectModalBooking] = useState(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState(REJECTION_REASONS[0]);
  const [customRejectReason, setCustomRejectReason] = useState('');

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const { data: bData } = await API.get('/bookings');
        if (bData.success && bData.bookings?.length > 0) {
          setBookingRequests(bData.bookings);
        }
      } catch (err) {
      }

      try {
        const { data: sData } = await API.get(`/services?provider=${user?._id || ''}`);
        if (sData.success && sData.services?.length > 0) {
          setServices(sData.services);
        }
      } catch (err) {
      }
    };

    fetchProviderData();
  }, [user?._id]);

  const handleSetAvailability = async (newStatus) => {
    setAvailabilityStatus(newStatus);
    try {
      await API.put('/auth/profile', { availabilityStatus: newStatus });
      updateProfileState({ ...user, availabilityStatus: newStatus });
      toast.success(`Status updated to "${newStatus}"!`);
    } catch (err) {
      updateProfileState({ ...user, availabilityStatus: newStatus });
      toast.success(`Status set to "${newStatus}" (Local update)`);
    }
  };

  const handleAcceptBooking = async (id) => {
    if (String(id).startsWith('bk-')) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'accepted' } : b))
      );
      toast.success('Booking request accepted! Customer has been notified.');
      return;
    }

    try {
      const { data } = await API.put(`/bookings/${id}/accept`);
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'accepted' } : b))
      );
      toast.success('Booking request accepted! Customer has been notified.');
    } catch (err) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'accepted' } : b))
      );
      toast.success('Booking request accepted! (Local update)');
    }
  };

  const handleOpenRejectModal = (booking) => {
    setRejectModalBooking(booking);
    setSelectedRejectReason(REJECTION_REASONS[0]);
    setCustomRejectReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalBooking) return;
    const reason =
      selectedRejectReason === 'Other' && customRejectReason.trim()
        ? customRejectReason.trim()
        : selectedRejectReason;

    const bookingId = rejectModalBooking._id;

    if (String(bookingId).startsWith('bk-')) {
      setBookingRequests((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason } : b
        )
      );
      toast.success('Booking request declined.');
      setRejectModalBooking(null);
      return;
    }

    try {
      await API.put(`/bookings/${bookingId}/reject`, { reason, rejectionReason: reason });
      setBookingRequests((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason } : b
        )
      );
      toast.success('Booking request declined.');
    } catch (err) {
      setBookingRequests((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason } : b
        )
      );
      toast.success('Booking request declined (Local update).');
    } finally {
      setRejectModalBooking(null);
    }
  };

  const handleMarkOnTheWay = async (id) => {
    if (String(id).startsWith('bk-')) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'on_the_way' } : b))
      );
      toast.success('Status updated to On The Way.');
      return;
    }

    try {
      await API.put(`/bookings/${id}/status`, { status: 'on_the_way' });
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'on_the_way' } : b))
      );
      toast.success('Status updated to On The Way.');
    } catch (err) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'on_the_way' } : b))
      );
      toast.success('Status updated to On The Way (Local update).');
    }
  };

  const handleStartBooking = async (id) => {
    if (String(id).startsWith('bk-')) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'started' } : b))
      );
      toast.success('Service marked as started.');
      return;
    }

    try {
      await API.put(`/bookings/${id}/start`);
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'started' } : b))
      );
      toast.success('Service marked as started.');
    } catch (err) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'started' } : b))
      );
      toast.success('Service marked as started (Local update).');
    }
  };

  const handleCompleteBooking = async (id) => {
    if (String(id).startsWith('bk-')) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'completed' } : b))
      );
      toast.success('Job marked completed! Great job.');
      return;
    }

    try {
      await API.put(`/bookings/${id}/complete`);
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'completed' } : b))
      );
      toast.success('Job marked completed! Great job.');
    } catch (err) {
      setBookingRequests((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'completed' } : b))
      );
      toast.success('Job marked completed! (Local update).');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a service title.');
      return;
    }

    const payload = {
      title: newTitle,
      category: newCategory,
      price: Number(newPrice),
      duration: newDuration,
      area: newArea,
      isRental,
    };

    try {
      const { data } = await API.post('/services', payload);
      if (data.success && data.service) {
        setServices([data.service, ...services]);
      } else {
        setServices([{ _id: 'srv-' + Date.now(), ...payload, status: 'active' }, ...services]);
      }
      toast.success('Service listing created successfully!');
    } catch (err) {
      setServices([{ _id: 'srv-' + Date.now(), ...payload, status: 'active' }, ...services]);
      toast.success('Service created (Local listing)!');
    }

    setShowNewServiceModal(false);
    setNewTitle('');
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      await API.put(`/services/${editingService._id}`, editingService);
      setServices((prev) =>
        prev.map((s) => (s._id === editingService._id ? editingService : s))
      );
      toast.success('Service updated successfully.');
    } catch (err) {
      setServices((prev) =>
        prev.map((s) => (s._id === editingService._id ? editingService : s))
      );
      toast.success('Service updated (Local update)');
    }

    setEditingService(null);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service listing?')) return;
    try {
      await API.delete(`/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
      toast.success('Service removed.');
    } catch (err) {
      setServices(services.filter((s) => s._id !== id));
      toast.success('Service removed (Local update).');
    }
  };

  const toggleZone = (zone) => {
    if (coverageZones.includes(zone)) {
      if (coverageZones.length > 1) {
        setCoverageZones(coverageZones.filter((z) => z !== zone));
      } else {
        toast.error('You must maintain at least one service zone in Coimbatore.');
      }
    } else {
      setCoverageZones([...coverageZones, zone]);
    }
  };

  const [uploadingProviderPhoto, setUploadingProviderPhoto] = useState(false);
  const providerFileInputRef = useRef(null);

  const handleLocalProviderPhotoSelect = async (e) => {
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

    setUploadingProviderPhoto(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setProviderAvatar(dataUrl);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await API.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success && (data.url || data.avatar)) {
        setProviderAvatar(data.url || data.avatar);
        toast.success('Profile photo uploaded from local files!');
      }
    } catch (err) {
      toast.success('Profile photo selected from local files!');
    } finally {
      setUploadingProviderPhoto(false);
      e.target.value = '';
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setSavingProviderProfile(true);
    const skillsArr = skills.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: providerName,
      phone: providerPhone,
      whatsapp: providerWhatsapp,
      avatar: providerAvatar,
      bio,
      skills: skillsArr,
      experienceYears: Number(experienceYears),
      startingPrice: Number(startingPrice),
      hourlyRate: Number(hourlyRate),
      emergencyAvailable,
      serviceAreas: coverageZones,
      address: { ...user?.address, area: serviceArea, city: 'Coimbatore', state: 'Tamil Nadu' },
    };
    if (newPassword) {
      payload.password = newPassword;
    }

    if (updateProfile) {
      await updateProfile(payload);
    } else {
      updateProfileState({ ...user, ...payload });
      toast.success('Provider profile saved!');
    }
    setSavingProviderProfile(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const todayBookings = bookingRequests.filter(
    (b) => b.bookingDate === new Date().toISOString().split('T')[0] || b.bookingDate === '2026-10-10'
  ).length;
  const pendingCount = bookingRequests.filter((b) => b.status === 'pending').length;
  const acceptedCount = bookingRequests.filter((b) => b.status === 'accepted').length;
  const ongoingCount = bookingRequests.filter((b) => b.status === 'on_the_way' || b.status === 'started').length;
  const completedCount = bookingRequests.filter((b) => b.status === 'completed').length;
  const rejectedCount = bookingRequests.filter((b) => b.status === 'rejected' || b.status === 'cancelled').length;

  const totalEarnings = bookingRequests
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 14250);

  const filteredBookings = bookingRequests.filter((b) => {
    if (bookingFilter === 'pending') return b.status === 'pending';
    if (bookingFilter === 'accepted') return b.status === 'accepted';
    if (bookingFilter === 'ongoing') return b.status === 'on_the_way' || b.status === 'started';
    if (bookingFilter === 'completed') return b.status === 'completed';
    if (bookingFilter === 'rejected') return b.status === 'rejected' || b.status === 'cancelled';
    return true;
  });

  const verificationStatus = user?.verificationStatus || 'APPROVED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {verificationStatus === 'PENDING' && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Verification Status: PENDING</strong>. Your provider profile is awaiting review by the platform administrator. Once approved, your listings will appear publicly for customers to request bookings.
          </div>
        </div>
      )}

      {verificationStatus === 'SUSPENDED' && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <div className="text-xs text-rose-800 dark:text-rose-200">
            <strong>Account SUSPENDED</strong>. Your account has been suspended by an administrator. Please reach out to customer support to resolve any compliance issues.
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => setActiveTab('profile')}
            title="Click to edit provider profile & rates"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              onError={(e) => handleImageError(e, 'avatar')}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500 transition-all shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 p-1 rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
              <Pencil className="w-2.5 h-2.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {user?.name || 'Suresh Kumar'}
              </h1>
              <span
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                  verificationStatus === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : verificationStatus === 'SUSPENDED'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {verificationStatus === 'APPROVED' ? 'Verified Provider' : verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {serviceArea || 'Peelamedu'}, Coimbatore • {experienceYears} Years Experience
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm hover:border-blue-400 dark:hover:border-blue-500"
          >
            <Pencil className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Edit Profile & Rates
          </button>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5 self-start md:self-auto">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Set Current Availability:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'Available Now', label: 'Available Now', dot: 'bg-emerald-500' },
                { id: 'Busy', label: 'Busy', dot: 'bg-amber-500' },
                { id: 'Offline', label: 'Offline', dot: 'bg-slate-400' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSetAvailability(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    availabilityStatus === st.id
                      ? st.id === 'Available Now'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                        : st.id === 'Busy'
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                        : 'bg-slate-700 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${availabilityStatus === st.id ? 'bg-white' : st.dot}`} />
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          icon={Calendar}
          title="Today's Bookings"
          value={todayBookings}
          trend="+1 today"
          isIncrease={true}
        />
        <StatCard
          icon={AlertCircle}
          title="Pending Requests"
          value={pendingCount}
          trend={pendingCount > 0 ? 'Needs response' : 'All clear'}
          isIncrease={pendingCount === 0}
        />
        <StatCard
          icon={CheckCircle2}
          title="Completed Jobs"
          value={user?.completedJobs || 42}
          trend="Lifetime"
          isIncrease={true}
        />
        <StatCard
          icon={DollarSign}
          title="Total Earnings"
          value={`₹${totalEarnings.toLocaleString('en-IN')}`}
          trend="+12% this month"
          isIncrease={true}
        />
        <StatCard
          icon={Star}
          title="Customer Rating"
          value={`${user?.rating || 4.8} / 5`}
          trend={`${user?.numReviews || 42} reviews`}
          isIncrease={true}
        />
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Booking Requests ({bookingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'services'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          My Listed Services ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'earnings'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Earnings & Overview
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Provider Profile & Rates
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Booking Requests & Assignments
              </h3>
              <p className="text-xs text-slate-500">
                Accept or reject new customer booking requests, and update statuses as you complete jobs.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: `All (${bookingRequests.length})` },
                { id: 'pending', label: `New Requests (${pendingCount})` },
                { id: 'accepted', label: `Accepted (${acceptedCount})` },
                { id: 'ongoing', label: `Ongoing (${ongoingCount})` },
                { id: 'completed', label: `Completed (${completedCount})` },
                { id: 'rejected', label: `Declined (${rejectedCount})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setBookingFilter(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    bookingFilter === f.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredBookings.length === 0 ? (
              <div className="glass-card p-10 rounded-2xl text-center border border-slate-200 dark:border-slate-800">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No bookings found in this category.
                </p>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const customerName = b.customer?.name || b.customerName || 'Customer';
                const customerPhone = b.customer?.phone || b.customerPhone || 'Not provided';
                const serviceTitle = b.service?.title || b.serviceTitle || 'Service';
                const amount = b.totalAmount || b.amount || 0;
                const notes = b.notes || b.message;

                return (
                  <div
                    key={b._id}
                    className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            b.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : b.status === 'accepted'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              : b.status === 'on_the_way'
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                              : b.status === 'started'
                              ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                              : b.status === 'rejected'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {serviceTitle}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Customer: <strong>{customerName}</strong> (<a href={`tel:${customerPhone}`} className="text-blue-600 hover:underline">{customerPhone}</a>)
                      </p>

                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" /> {b.bookingDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" /> {b.timeSlot}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.address}
                        </span>
                      </p>

                      {notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-500">Customer Note:</span> "{notes}"
                        </p>
                      )}

                      {b.rejectionReason && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
                          <span className="font-semibold">Declined Reason:</span> {b.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right mr-2">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                          ₹{amount}
                        </span>
                        <span className="text-[10px] text-slate-400">Total</span>
                      </div>

                      {b.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAcceptBooking(b._id)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(b)}
                            className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 text-xs font-bold transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {b.status === 'accepted' && (
                        <button
                          onClick={() => handleMarkOnTheWay(b._id)}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" /> On The Way
                        </button>
                      )}

                      {b.status === 'on_the_way' && (
                        <button
                          onClick={() => handleStartBooking(b._id)}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Start Service
                        </button>
                      )}

                      {b.status === 'started' && (
                        <button
                          onClick={() => handleCompleteBooking(b._id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                My Service Listings
              </h3>
              <p className="text-xs text-slate-500">
                Create and manage your offered services. Note: You cannot book your own services.
              </p>
            </div>
            <button
              onClick={() => setShowNewServiceModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" /> Add Service Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv) => (
              <div
                key={srv._id}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {srv.category} {srv.isRental && '• Rental'}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                    {srv.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Starting ₹{srv.price} • {srv.duration || '1 Hour'} • {srv.area || 'Peelamedu'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingService(srv)}
                    className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                    title="Edit listing"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(srv._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Monthly Earnings (Coimbatore)
            </h3>
            <p className="text-xs text-slate-500">
              Clear payouts directly to your account. No hidden platform cuts.
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Earnings']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 bg-white dark:bg-slate-900">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Provider Settings
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Service Provider Profile & Trade Rates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure your verified identity, baseline inspection rates, emergency dispatch availability, and Coimbatore coverage zones.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <input
                  ref={providerFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLocalProviderPhotoSelect}
                  className="hidden"
                />

                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Profile Photo & Verified Avatar
                  </label>
                  <span className="text-[11px] text-slate-400">Local files or presets supported</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div
                    onClick={() => providerFileInputRef.current?.click()}
                    className="relative group cursor-pointer"
                    title="Click to choose photo from local files"
                  >
                    <img
                      src={providerAvatar}
                      alt={providerName}
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
                        onClick={() => providerFileInputRef.current?.click()}
                        disabled={uploadingProviderPhoto}
                        className="px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        {uploadingProviderPhoto ? 'Uploading Photo...' : 'Choose from Local Files'}
                      </button>
                      <span className="text-[11px] text-slate-400">or pick a preset:</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {PROVIDER_AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setProviderAvatar(preset)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all ${
                            providerAvatar === preset
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
                      value={providerAvatar}
                      onChange={(e) => setProviderAvatar(e.target.value)}
                      placeholder="Or paste an image URL (https://...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  1. Business Identity & Communication
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name / Business Title
                    </label>
                    <input
                      type="text"
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
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
                        value={user?.email || 'provider@localmate.com'}
                        readOnly
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 cursor-not-allowed"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Customer Call Number
                    </label>
                    <input
                      type="tel"
                      value={providerPhone}
                      onChange={(e) => setProviderPhone(e.target.value)}
                      placeholder="+91 98421 11001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      WhatsApp Dispatch Number
                    </label>
                    <input
                      type="tel"
                      value={providerWhatsapp}
                      onChange={(e) => setProviderWhatsapp(e.target.value)}
                      placeholder="+91 98421 11001"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  2. Pricing Structure & Trade Experience
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Starting Visit / Inspection (₹)
                    </label>
                    <input
                      type="number"
                      min="50"
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Baseline charge on profile</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Hourly Labor Rate (₹)
                    </label>
                    <input
                      type="number"
                      min="100"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Standard labor per hour</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Verified on profile</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                  <input
                    type="checkbox"
                    id="emergencyAvail"
                    checked={emergencyAvailable}
                    onChange={(e) => setEmergencyAvailable(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <label htmlFor="emergencyAvail" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                    <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                      <Zap className="w-3.5 h-3.5" /> Emergency Dispatch Ready
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block mt-0.5">
                      Show your listing in the "Need Help Now?" 24/7 emergency dispatch section for urgent calls in Coimbatore.
                    </span>
                  </label>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  3. Coimbatore Service Zones & Coverage
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Operational Base
                  </label>
                  <select
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
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
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Active Coverage Zones (Click to enable/disable)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CBE_AREAS.filter((a) => a !== 'All Coimbatore Areas').map((zone) => {
                      const isCovered = coverageZones.includes(zone);
                      return (
                        <button
                          key={zone}
                          type="button"
                          onClick={() => toggleZone(zone)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isCovered
                              ? 'bg-blue-600 text-white font-bold shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          {isCovered && '✓ '}
                          {zone}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  4. Bio & Specializations
                </h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Professional Bio Overview
                  </label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Highlight your trade background, experience in Coimbatore, and client approach..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Key Skills & Specializations (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Wiring, Switch Board, Inverter Check, Emergency Power"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {skill}
                      </span>
                    ))}
                  </div>
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
                  Profile changes reflect live on the LocalMate marketplace immediately.
                </p>
                <button
                  type="submit"
                  disabled={savingProviderProfile}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingProviderProfile ? 'Saving updates...' : 'Save Provider Profile'}
                </button>
              </div>

            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Marketplace Card Preview
                </h4>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Preview
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={providerAvatar}
                      alt={providerName}
                      onError={(e) => handleImageError(e, 'avatar')}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30"
                    />
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {providerName}
                      </h5>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {serviceArea}, Coimbatore
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {experienceYears} yrs exp
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {bio}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Starting Visit</span>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">₹{startingPrice}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Labor Rate</span>
                    <span className="font-bold text-slate-900 dark:text-white">₹{hourlyRate}/hr</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Coverage ({coverageZones.length} Zones)</span>
                  <div className="flex flex-wrap gap-1">
                    {coverageZones.slice(0, 4).map((z) => (
                      <span key={z} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {z}
                      </span>
                    ))}
                    {coverageZones.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500">
                        +{coverageZones.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {emergencyAvailable && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Enrolled in Coimbatore 24/7 emergency dispatch queue</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {rejectModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Decline Booking Request
              </h3>
              <button onClick={() => setRejectModalBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Please select a reason for declining the request from{' '}
              <strong>{rejectModalBooking.customer?.name || rejectModalBooking.customerName || 'Customer'}</strong>.
            </p>

            <div className="space-y-2 text-xs">
              {REJECTION_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedRejectReason === r
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={r}
                    checked={selectedRejectReason === r}
                    onChange={(e) => setSelectedRejectReason(e.target.value)}
                    className="text-blue-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            {selectedRejectReason === 'Other' && (
              <textarea
                rows="2"
                placeholder="Specify reason..."
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRejectModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add New Service Listing
              </h3>
              <button onClick={() => setShowNewServiceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AC Repair & Gas Refill"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {LOCALMATE_SECTORS.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Starting Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 1-2 Hours"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Service Area
                </label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  {CBE_AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rentalItem"
                  checked={isRental}
                  onChange={(e) => setIsRental(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="rentalItem" className="font-semibold text-slate-700 dark:text-slate-300">
                  This is a Rental Item (Bike, Appliance, Tools)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewServiceModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Create Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit Service Listing
              </h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateService} className="space-y-3 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingService.duration || ''}
                    onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
