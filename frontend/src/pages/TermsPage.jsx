import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, ShieldCheck, Scale, AlertTriangle, HelpCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
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
          <FileText className="w-3.5 h-3.5" /> Platform Governance & Legal Agreement
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Effective Date: October 12, 2026. Applies to all customers, service providers, and rental operators using LocalMate (localmate.in) in Coimbatore, Tamil Nadu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">Independent Providers</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            All listed professionals operate as independent contractors. LocalMate is a matching platform.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">Fair Pricing & Parts</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Baseline prices cover visit & diagnosis. Material costs must be agreed on-site before work begins.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">Rental Guidelines</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Valid original ID and security deposit are required for vehicle and tool rentals upon pickup.
          </p>
        </div>
      </div>

      <div className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed space-y-8">
        
        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Acceptance of Terms & Eligibility
          </h2>
          <p>
            By accessing or using the LocalMate website (<strong>localmate.in</strong>), mobile web interface, or associated APIs, you agree to be bound by these Terms and Conditions and our{' '}
            <Link to="/privacy" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Privacy Policy
            </Link>.
            If you do not agree to these terms, you must discontinue platform use immediately.
          </p>
          <p className="text-xs text-slate-500">
            You must be at least 18 years of age and legally competent to enter into a binding agreement under the Indian Contract Act, 1872.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Platform Marketplace Model
          </h2>
          <p>
            LocalMate functions exclusively as a technology platform connecting consumers residing in Coimbatore with verified local independent service providers (electricians, plumbers, home appliance technicians, painters, cleaners, two-wheeler mechanics) and equipment rental operators.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>LocalMate is not an employer, contractor, or joint venture partner of any service provider.</li>
            <li>Each service contract is entered directly between the customer and the selected service provider.</li>
            <li>LocalMate does not own, inspect, or operate rental vehicles or tools listed on the platform.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            3. User Accounts, Verification & Coimbatore Territory
          </h2>
          <p>
            When registering, users must provide truthful and accurate information, including full name, active telephone number, email, and Coimbatore service area (e.g., Gandhipuram, RS Puram, Peelamedu, Singanallur, Saravanampatti).
          </p>
          <p>
            Service providers undergo verification of their identity documents (Aadhaar / Driving License / trade certification) and area coverage before listing activation. LocalMate reserves the right to suspend or remove any profile that provides misleading qualifications or engages in fraudulent activity.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            4. Pricing, Estimates & Payment Settlement
          </h2>
          <p>
            All prices shown on provider listing cards represent <strong>starting inspection, minimum labor, or initial diagnostic charges</strong> established by the individual provider.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Spare Parts & Extra Labor:</strong> Any parts, components (e.g., pipes, wiring, condenser), or additional labor must be quoted and verbally confirmed with the customer on site before installation.</li>
            <li><strong>Zero Platform Booking Fee:</strong> LocalMate does not charge customers any surcharge or booking commission for discovering providers.</li>
            <li><strong>Payment Method:</strong> Payment is settled directly between the customer and the provider via UPI (GPay, PhonePe, Paytm), cash, or agreed direct digital transfer upon completion of the task.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            5. Cancellations, Rescheduling & No-Show Policy
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Customers may cancel a requested or scheduled booking free of charge up to 1 hour before the chosen appointment slot.</li>
            <li>If a provider cannot fulfill a confirmed booking due to an unforeseen emergency, they must notify the customer promptly through in-app messaging or telephone.</li>
            <li>Excessive last-minute cancellations without justification may result in account review or temporary suspension.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            6. Rentals & Security Deposit Guidelines
          </h2>
          <p>
            For vehicle rentals (two-wheelers, scooters) and heavy equipment hire:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Identification:</strong> The renter must present a valid original Government Photo ID (Aadhaar Card, Passport, or valid Driving License) at the time of equipment handover.</li>
            <li><strong>Security Deposit:</strong> Any security deposit requested by the rental shop must be paid directly to the owner and is 100% refundable upon safe return in undamaged condition.</li>
            <li><strong>Custody & Traffic Laws:</strong> Renters must obey all motor vehicle regulations, helmet mandates, and local traffic statutes in Coimbatore. The renter is strictly liable for any fines, fuel charges, or mechanical damage incurred during custody.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            7. Authentic Reviews & Prohibition of Fake Metrics
          </h2>
          <p>
            LocalMate operates on authentic local trust. Ratings and reviews must reflect genuine customer service engagements.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Providers may not post reviews for their own listings or solicit artificial reviews from affiliated parties.</li>
            <li>Customers may not post defamatory, abusive, or extortionate feedback.</li>
            <li>LocalMate actively monitors review authenticity and will permanently ban accounts involved in fake review manipulation.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            8. Limitation of Liability
          </h2>
          <p>
            LocalMate exercises reasonable diligence in vetting listed service providers. However, to the maximum extent permitted by law:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>LocalMate shall not be liable for any indirect, incidental, or consequential damages resulting from services performed on site.</li>
            <li>LocalMate does not guarantee uninterrupted website availability or specific repair outcomes.</li>
            <li>Customers and providers are encouraged to inspect work and verify satisfactory completion prior to settling payment.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            9. Governing Law & Coimbatore Jurisdiction
          </h2>
          <p>
            These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the Republic of India. Any legal action, dispute, or proceeding arising out of or related to these terms shall be submitted to the exclusive jurisdiction of the competent courts in Coimbatore, Tamil Nadu.
          </p>
        </section>

        <section className="space-y-3 pt-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" /> 10. Grievance Officer & Contact Information
          </h2>
          <p className="text-xs">
            In accordance with the Information Technology Act, 2000 and rules made thereunder, questions or grievances regarding these terms may be addressed to our designated Grievance Officer:
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <p className="font-bold text-slate-900 dark:text-white">LocalMate Legal & Grievance Desk</p>
            <p className="text-slate-600 dark:text-slate-400">Attention: Legal Redressal Officer</p>
            <p className="text-slate-600 dark:text-slate-400">Race Course Road, Gopalapuram, Coimbatore, Tamil Nadu - 641018</p>
            <p className="text-slate-600 dark:text-slate-400">
              Email: <a href="mailto:legal@localmate.in" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">legal@localmate.in</a>
            </p>
            <p className="text-slate-600 dark:text-slate-400">Domain: <a href="https://localmate.in" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">https://localmate.in</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}
