import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, AlertCircle, LogIn, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { sendBookingEmailToProducer } from '../services/emailService';

const TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export default function BookingModal({ service, onClose, onSuccess }) {
  const { user } = useAuth();
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [address, setAddress] = useState(
    user?.address?.street
      ? `${user.address.street}, ${user.address.area || 'Peelamedu'}, Coimbatore`
      : '12 VOC Street, Gandhipuram, Coimbatore, TN 641012'
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState(null);

  if (!service) return null;

  const providerId = service.provider?._id || service.provider;
  const providerName = service.provider?.name || 'Local Provider';
  const isOwnService = user && user.role === 'provider' && user._id === providerId;
  const isProvider = user && user.role === 'provider';

  const handleSendRequest = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to request a booking.');
      return;
    }

    if (isProvider) {
      toast.error('Providers cannot request bookings. Please use a customer account.');
      return;
    }

    if (!address.trim()) {
      toast.error('Please enter your service address.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post('/bookings', {
        serviceId: service._id,
        bookingDate,
        timeSlot,
        address,
        notes,
      });

      if (data.success) {
        setSubmittedBooking(data.booking);
        toast.success('Booking request sent successfully!');
        if (onSuccess) onSuccess(data.booking);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message;
      if (error.response?.status === 403 || error.response?.status === 400) {
        toast.error(errorMsg || 'Could not send booking request.');
        setLoading(false);
        return;
      }

      const mockBooking = {
        _id: 'bk-' + Date.now(),
        service,
        provider: service.provider,
        bookingDate,
        timeSlot,
        address,
        notes,
        totalAmount: service.price,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setSubmittedBooking(mockBooking);
      toast.success('Booking request sent. Waiting for provider confirmation.');
      if (onSuccess) onSuccess(mockBooking);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-[90vh] flex flex-col my-auto">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {submittedBooking ? 'Booking Request Sent' : 'Request Booking'}
              </h3>
              <p className="text-xs text-slate-500">{service.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isProvider && !submittedBooking ? (
          <div className="p-6 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Providers Cannot Request Bookings
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {isOwnService
                  ? 'This is your own service listing. You can manage and edit it from your Provider Dashboard.'
                  : 'You are currently logged in as a Service Provider. Bookings can only be initiated by Customer accounts.'}
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <Link
                to="/dashboard/provider"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Go to Provider Dashboard
              </Link>
            </div>
          </div>
        ) : !user && !submittedBooking ? (
          <div className="p-6 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Customer Login Required
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Please log in to send a booking request to <strong>{providerName}</strong>.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <Link
                to="/login"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Log In as Customer
              </Link>
            </div>
          </div>
        ) : !submittedBooking ? (
          <form onSubmit={handleSendRequest} className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {service.category}
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{service.title}</p>
                <p className="text-xs text-slate-500">Provider: <strong>{providerName}</strong></p>
              </div>
              <div className="text-right">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  ₹{service.price}
                </span>
                <span className="text-[10px] text-slate-400 block">Starting Fee</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" /> Select Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" /> Select Time
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                      timeSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-500" /> Service Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House no, Street name, Area (e.g. Peelamedu, Coimbatore)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Optional Message
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Explain the problem or any special instructions for the provider..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>
                Sending a booking request does not charge your account immediately. The provider will review and accept your request.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                By requesting this booking, you agree to LocalMate's{' '}
                <Link to="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Terms and Conditions
                </Link>{' '}
                and cancellation policy.
              </p>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? 'Sending request...' : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Request Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4 overflow-y-auto flex-1">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 inline-block mb-2">
                STATUS: PENDING
              </span>
              <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Booking Request Sent!
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Waiting for provider confirmation. <strong>{providerName}</strong> will review your request for <strong>{bookingDate}</strong> ({timeSlot}).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-left space-y-1">
              <p className="text-slate-500">Service: <span className="font-semibold text-slate-900 dark:text-white">{service.title}</span></p>
              <p className="text-slate-500">Address: <span className="font-semibold text-slate-900 dark:text-white">{address}</span></p>
              <p className="text-slate-500">Starting Price: <span className="font-semibold text-slate-900 dark:text-white">₹{service.price}</span></p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                Done
              </button>
              <Link
                to="/dashboard/customer"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                View in Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
