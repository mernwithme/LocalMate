import React, { useState } from 'react';
import { X, Mail, Send, User, CheckCircle2, Shield } from 'lucide-react';
import { sendDirectEmailToProducer } from '../services/emailService';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';

export default function ContactProviderModal({ provider, serviceTitle, onClose }) {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [subject, setSubject] = useState(serviceTitle ? `Question about: ${serviceTitle}` : 'Service Request');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!provider) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !message.trim()) {
      toast.error('Please fill all required fields.');
      return;
    }

    setLoading(true);
    const result = await sendDirectEmailToProducer({
      producerName: provider.name,
      producerEmail: provider.email || 'provider@localmate.com',
      clientName,
      clientEmail,
      subject,
      message,
    });
    setLoading(false);

    if (result.success) {
      setSent(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="glass-card w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 max-h-[90vh] flex flex-col my-auto">
        
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {provider.avatar ? (
              <img
                src={provider.avatar}
                alt={provider.name}
                onError={(e) => handleImageError(e, 'avatar')}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                {provider.name?.charAt(0) || 'P'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Contact {provider.name}
              </h3>
              <p className="text-xs text-slate-500">Send a direct message</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message
              </label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
              >
                {loading ? 'Please wait...' : 'Contact Provider'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-slate-900 dark:text-white">Message Sent</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Your message was sent to <strong>{provider.name}</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all"
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
