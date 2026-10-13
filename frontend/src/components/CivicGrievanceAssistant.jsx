import React, { useState } from 'react';
import {
  Zap,
  PhoneCall,
  MessageSquare,
  Building2,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  Search,
  Copy,
  ExternalLink,
  ChevronRight,
  Info,
  Droplets,
  Trash2,
  Lightbulb,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const HELPLINE_DATA = {
  tnpdcl: {
    title: 'Tamil Nadu Power Distribution Corporation Limited (TNPDCL / TANGEDCO)',
    serviceName: 'Electricity Board (EB) Consumer Grievance',
    callLine: '1912',
    callLineNote: 'Available 24/7 state-wide for power cuts, fuse blows, voltage drops, and billing issues.',
    whatsapp: '94987 94987',
    whatsappRaw: '919498794987',
    whatsappNote: 'State-wide WhatsApp line for sharing photos of broken poles, dangling wires, or text complaints.',
    scope: 'All Tamil Nadu Districts (State-Wide)',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  ipgrs: {
    title: 'Mudhalvarin Mugavari (CM Helpline Department)',
    serviceName: 'Integrated Public Grievance Redressal System (IPGRS)',
    callLine: '1100',
    callLineNote: 'Universal State-Wide Line that routes civic complaints to the respective district\'s local Municipal Corporation or Municipality for garbage, roads, water, or streetlights.',
    scope: 'All Tamil Nadu Districts (State-Wide)',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  chennai: {
    title: 'Chennai-Specific Corporate Exceptions',
    subtitle: 'Exclusive emergency & civic grievance lines valid for Greater Chennai Corporation area',
    gcc: {
      name: 'Greater Chennai Corporation (GCC)',
      callLine: '1913',
      note: 'Civic issues, roads, streetlights, garbage & flood complaints within GCC limits.',
    },
    cmwssb: {
      name: 'Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)',
      callLine: '1916',
      note: 'Metro water supply, tanker booking complaints & sewerage overflow issues in Chennai.',
    },
    scope: 'Chennai City Only',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
  },
};

const COMMON_ISSUES = [
  { label: 'Power Cut / Fuse Blow / Voltage Drop', target: '1912', type: 'tnpdcl', desc: 'Call TANGEDCO / TNPDCL 24/7 EB Line 1912' },
  { label: 'Broken Pole / Dangling Live Wire Photo', target: '94987 94987', type: 'whatsapp', desc: 'WhatsApp TANGEDCO Support with Photo/GPS' },
  { label: 'Garbage / Road Repair / Streetlight (State-wide)', target: '1100', type: 'ipgrs', desc: 'Call CM Helpline 1100 for Municipal Complaints' },
  { label: 'GCC Civic Complaint (Chennai Only)', target: '1913', type: 'gcc', desc: 'Call Greater Chennai Corporation 1913' },
  { label: 'Metro Water / Sewage Overflow (Chennai Only)', target: '1916', type: 'cmwssb', desc: 'Call CMWSSB Metro Water Helpline 1916' },
];

export default function CivicGrievanceAssistant({ compact = false }) {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [issueSearch, setIssueSearch] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} (${text}) to clipboard!`);
  };

  const isChennaiContext = selectedDistrict.toLowerCase().includes('chennai');

  return (
    <div className="space-y-8">
      
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-2xl blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600/10 dark:bg-blue-400/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Tamil Nadu State Utility Routing System
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tamil Nadu Utility & Civic Grievance Assistant
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Official universal helpline numbers for Electricity Board (EB/TANGEDCO), Municipal Civic Redressal (CM Helpline 1100), and Chennai Corporate Services.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-1.5 min-w-[220px]">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> Filter Context District:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            >
              <option value="All Districts">All Tamil Nadu Districts (State-Wide)</option>
              <option value="Chennai">Chennai (Includes GCC & CMWSSB Lines)</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Madurai">Madurai</option>
              <option value="Trichy">Tiruchirappalli (Trichy)</option>
              <option value="Salem">Salem</option>
              <option value="Tirunelveli">Tirunelveli</option>
              <option value="Erode">Erode</option>
              <option value="Vellore">Vellore</option>
              <option value="Thanjavur">Thanjavur</option>
              <option value="Tiruppur">Tiruppur</option>
              <option value="Kanchipuram">Kanchipuram</option>
              <option value="Kanyakumari">Kanyakumari (Nagercoil)</option>
              <option value="Dindigul">Dindigul</option>
              <option value="Cuddalore">Cuddalore</option>
              <option value="Karur">Karur</option>
              <option value="Ramanathapuram">Ramanathapuram</option>
              <option value="Thoothukudi">Tuticorin (Thoothukudi)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-500" /> Instant Issue Router - Click to Connect Immediately
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMMON_ISSUES.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-blue-500/50 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{item.label}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{item.desc}</span>
              </div>
              {item.type === 'whatsapp' ? (
                <a
                  href={`https://wa.me/${HELPLINE_DATA.tnpdcl.whatsappRaw}?text=${encodeURIComponent('Hello TNPDCL Support, reporting an issue.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                </a>
              ) : (
                <a
                  href={`tel:${item.target}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 shadow"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call {item.target}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="glass-card p-6 rounded-3xl border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-b from-amber-500/5 to-transparent space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                State-Wide 24/7 EB
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                1. {HELPLINE_DATA.tnpdcl.title}
              </h3>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                {HELPLINE_DATA.tnpdcl.serviceName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Primary 24/7 Call Line</span>
                  <a href={`tel:${HELPLINE_DATA.tnpdcl.callLine}`} className="text-2xl font-black text-slate-900 dark:text-white hover:text-amber-500 transition-colors flex items-center gap-1.5">
                    <PhoneCall className="w-5 h-5 text-amber-500" /> {HELPLINE_DATA.tnpdcl.callLine}
                  </a>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyToClipboard(HELPLINE_DATA.tnpdcl.callLine, 'EB Call Line')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    title="Copy Helpline Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`tel:${HELPLINE_DATA.tnpdcl.callLine}`}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/25"
                  >
                    Call Now
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                {HELPLINE_DATA.tnpdcl.callLineNote}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">WhatsApp Support Line</span>
                  <a
                    href={`https://wa.me/${HELPLINE_DATA.tnpdcl.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-black text-slate-900 dark:text-white hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-4.5 h-4.5 text-emerald-500" /> {HELPLINE_DATA.tnpdcl.whatsapp}
                  </a>
                </div>
                <a
                  href={`https://wa.me/${HELPLINE_DATA.tnpdcl.whatsappRaw}?text=${encodeURIComponent('Hello TANGEDCO Support, reporting a complaint.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25"
                >
                  WhatsApp Chat
                </a>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-emerald-500/10 pt-2.5">
                {HELPLINE_DATA.tnpdcl.whatsappNote}
              </p>
            </div>
          </div>

          <div className="pt-3 flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Valid State-Wide across all 38 TN Districts
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 bg-gradient-to-b from-emerald-500/5 to-transparent space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Building2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                CM Public Grievance
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                2. {HELPLINE_DATA.ipgrs.title}
              </h3>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {HELPLINE_DATA.ipgrs.serviceName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Universal State-Wide Line</span>
                  <a href={`tel:${HELPLINE_DATA.ipgrs.callLine}`} className="text-3xl font-black text-slate-900 dark:text-white hover:text-emerald-600 transition-colors flex items-center gap-2">
                    <PhoneCall className="w-6 h-6 text-emerald-500" /> {HELPLINE_DATA.ipgrs.callLine}
                  </a>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => copyToClipboard(HELPLINE_DATA.ipgrs.callLine, 'CM Helpline 1100')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    title="Copy Helpline Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`tel:${HELPLINE_DATA.ipgrs.callLine}`}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/25"
                  >
                    Call 1100 Now
                  </a>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                {HELPLINE_DATA.ipgrs.callLineNote}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-emerald-500 shrink-0" /> Garbage & Sanitation
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" /> Streetlights & Roads
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-blue-500 shrink-0" /> Municipal Water Supply
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-500 shrink-0" /> District Municipalities
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center gap-2 text-[11px] font-bold text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Integrated IPGRS State-wide Dispatch
          </div>
        </div>

      </div>

      <div className={`glass-card p-6 rounded-3xl border transition-all ${
        isChennaiContext || selectedDistrict === 'Chennai'
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-500/5'
          : 'border-blue-200/80 dark:border-blue-900/40'
      } space-y-6`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" /> Chennai City Corporate Exceptions
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              3. {HELPLINE_DATA.chennai.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {HELPLINE_DATA.chennai.subtitle}
            </p>
          </div>
          {isChennaiContext && (
            <span className="px-3 py-1 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Active Context: Chennai District
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {HELPLINE_DATA.chennai.gcc.name}
                </h4>
                <p className="text-xs text-slate-500">GCC Civic Complaint Line</p>
              </div>
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                GCC 1913
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <a href={`tel:${HELPLINE_DATA.chennai.gcc.callLine}`} className="text-3xl font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors flex items-center gap-2">
                <PhoneCall className="w-6 h-6 text-blue-600" /> {HELPLINE_DATA.chennai.gcc.callLine}
              </a>
              <a
                href={`tel:${HELPLINE_DATA.chennai.gcc.callLine}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25"
              >
                Call 1913
              </a>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
              {HELPLINE_DATA.chennai.gcc.note}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {HELPLINE_DATA.chennai.cmwssb.name}
                </h4>
                <p className="text-xs text-slate-500">Chennai Metro Water & Sewerage</p>
              </div>
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800">
                CMWSSB 1916
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <a href={`tel:${HELPLINE_DATA.chennai.cmwssb.callLine}`} className="text-3xl font-black text-slate-900 dark:text-white hover:text-cyan-600 transition-colors flex items-center gap-2">
                <PhoneCall className="w-6 h-6 text-cyan-600" /> {HELPLINE_DATA.chennai.cmwssb.callLine}
              </a>
              <a
                href={`tel:${HELPLINE_DATA.chennai.cmwssb.callLine}`}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/25"
              >
                Call 1916
              </a>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3">
              {HELPLINE_DATA.chennai.cmwssb.note}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
