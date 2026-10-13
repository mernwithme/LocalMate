import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Heart, Send, MapPin, Phone, Mail, CheckCircle2, SlidersHorizontal, Bike } from 'lucide-react';
import toast from 'react-hot-toast';
import { aboutContent, whyChooseContent } from '../data/websiteContent';

export function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <MapPin className="w-3.5 h-3.5" /> Coimbatore, Tamil Nadu
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          About Local<span className="text-blue-600 dark:text-blue-400">Mate</span>
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium">
          "{aboutContent.tagline}" - {aboutContent.story}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <SlidersHorizontal className="w-9 h-9 text-blue-600 dark:text-blue-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Compare Before You Book</h3>
          <p className="text-xs text-slate-500">
            Check starting price, distance, rating, and live availability across multiple local providers.
          </p>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <ShieldCheck className="w-9 h-9 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Coimbatore Only</h3>
          <p className="text-xs text-slate-500">
            Focused exclusively on Coimbatore neighborhoods like Gandhipuram, RS Puram, and Peelamedu.
          </p>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
          <Bike className="w-9 h-9 text-amber-500 mx-auto" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Services + Rentals</h3>
          <p className="text-xs text-slate-500">
            From emergency electricians to daily bike, camera, and laptop rentals in one easy portal.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
          Why People Choose LocalMate
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whyChooseContent.points.map((pt) => (
            <div key={pt.title} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {pt.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">
                {pt.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Thank you! Your message was received.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Contact LocalMate
        </h1>
        <p className="text-xs text-slate-500">
          Have a question or want to partner in Coimbatore? Reach out to us.
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-4">
        {submitted ? (
          <div className="text-center py-6 space-y-2">
            <Send className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Message Sent</h3>
            <p className="text-xs text-slate-500">Our Coimbatore support team will reply shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Suresh Kumar"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea
                rows="4"
                required
                placeholder="How can we help you in Coimbatore?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <h1 className="text-6xl font-black text-blue-600">404</h1>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-xs">
        The page you are looking for does not exist on LocalMate.
      </p>
      <Link
        to="/"
        className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
      >
        Return to Home
      </Link>
    </div>
  );
}
