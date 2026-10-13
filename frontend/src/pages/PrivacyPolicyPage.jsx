import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>

      <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-800">
          <ShieldCheck className="w-3.5 h-3.5" /> Data Protection & Privacy
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last updated: October 12, 2026. Applicable to LocalMate operations in Coimbatore, Tamil Nadu, India.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Introduction</h2>
          <p>
            LocalMate ("we", "us", or "our") operates the local service discovery platform at localmate.in.
            This Privacy Policy explains how we collect, store, and process personal information when you browse
            services, list your skills, or book appointments in Coimbatore.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
          <p>We collect only the information required to connect customers with local providers:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Account Details:</strong> Name, phone number, email address, and account password.</li>
            <li><strong>Service Locations:</strong> Street address, neighborhood area (e.g. Gandhipuram, Peelamedu, RS Puram), and pincode for dispatching home visits.</li>
            <li><strong>Provider Verification:</strong> Skill details, past work experience, government identity proof submitted for verification, and service rate cards.</li>
            <li><strong>Booking & Communication:</strong> Selected dates, appointment time slots, and direct messages exchanged between customers and providers.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. How Your Information Is Used</h2>
          <p>Your details are used strictly for service delivery:</p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Facilitating scheduled appointments between clients and nearby technicians or rental providers.</li>
            <li>Sending status updates on bookings, cancellations, and real-time chat messages.</li>
            <li>Admin verification of provider credentials to maintain marketplace safety.</li>
            <li>Providing customer support for dispute resolution or helpline referrals.</li>
          </ul>
          <p className="text-xs">We do not sell, rent, or trade your personal contact details to third-party marketing companies.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Data Sharing with Service Providers</h2>
          <p>
            When you confirm a booking, your name, service address, and phone number are shared with the
            designated provider solely for completing the requested job. Providers are bound by platform terms
            not to use this information for unauthorized purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">5. Data Storage and Security</h2>
          <p>
            We implement industry-standard encryption protocols (including HTTPS and salted bcrypt hashing for passwords)
            to safeguard user data. Session tokens are stored securely and automatically expire after inactivity.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">6. Your Rights & Account Deletion</h2>
          <p>
            You have the right to review, update, or request the deletion of your account and personal history.
            You can modify your profile directly through your account dashboard or by submitting a request to our support team.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">7. Contact Information</h2>
          <p>
            For privacy inquiries or data requests, contact LocalMate Grievance Officer:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <p><strong>LocalMate Operations</strong></p>
            <p>Race Course Road, Coimbatore, Tamil Nadu - 641018</p>
            <p>Email: privacy@localmate.in</p>
          </div>
        </section>
      </div>
    </div>
  );
}
