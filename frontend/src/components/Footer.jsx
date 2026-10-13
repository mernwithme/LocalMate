import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Shield, Award, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const handleNewsletter = (e) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to updates!');
    e.target.reset();
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-slate-800">
          
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Local<span className="text-blue-500">Mate</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-900/60 text-blue-300">
                  Coimbatore
                </span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              "Find trusted services near you." Compare local Coimbatore service providers and rentals before you book.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-400">
              <span className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold bg-blue-950/60 px-3 py-1.5 rounded-md border border-blue-800/50">
                <Shield className="w-3.5 h-3.5" /> Coimbatore Only
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-800/50">
                <Award className="w-3.5 h-3.5" /> Compare & Book
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="hover:text-blue-400 transition-colors">Find Services</Link></li>
              <li><Link to="/services?category=Rentals" className="hover:text-blue-400 transition-colors">Rentals</Link></li>
              <li><a href="#emergency" className="text-rose-400 font-bold hover:underline transition-colors">Emergency Help</a></li>
              <li><Link to="/become-provider" className="hover:text-blue-400 transition-colors">Become a Provider</Link></li>
              <li><Link to="/about" className="hover:text-blue-400 transition-colors">About LocalMate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-blue-400 font-bold text-xs tracking-wider uppercase mb-4">
              Coimbatore Areas
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Gandhipuram & RS Puram</li>
              <li>• Peelamedu & Singanallur</li>
              <li>• Saibaba Colony & Ganapathy</li>
              <li>• Saravanampatti & Kalapatti</li>
              <li>• Vadavalli & Thudiyalur</li>
            </ul>
          </div>

          <div>
            <h4 className="text-amber-400 font-bold text-xs tracking-wider uppercase mb-4">
              Emergency Lines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-bold text-white block">Electricity EB: <a href="tel:1912" className="text-amber-400 hover:underline">1912</a></span>
                <span className="text-[11px] text-slate-400">Coimbatore power cuts</span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-bold text-white block">CM Helpline: <a href="tel:1100" className="text-emerald-400 hover:underline">1100</a></span>
                <span className="text-[11px] text-slate-400">Roads & municipal pipes</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">Stay Updated</h4>
            <p className="text-xs text-slate-400 mb-3">Get helpful tips and service offers near you.</p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="absolute right-1 top-1 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors" title="Subscribe">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 LocalMate. All rights reserved.</p>
          <p className="text-slate-400 font-medium">
            Developed by <span className="text-white font-bold">Nithish Kumar</span>
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
