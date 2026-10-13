import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import {
  Users,
  Briefcase,
  DollarSign,
  ShieldCheck,
  Trash2,
  Search,
  Plus,
  MapPin,
  AlertTriangle,
  FileText,
  Calendar,
  CheckCircle2,
  X,
  Edit,
  Check,
  Ban,
  Clock,
  Filter,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { LOCALMATE_SECTORS, CBE_AREAS } from '../data/mockServices';

const INITIAL_USERS = [
  { _id: 'u-1', name: 'Priya Natarajan', email: 'customer@localmate.com', role: 'customer', area: 'Gandhipuram', verificationStatus: 'APPROVED', status: 'Active', joined: '2026-05-12' },
  { _id: 'u-2', name: 'Suresh Kumar', email: 'provider@localmate.com', role: 'provider', area: 'Peelamedu', verificationStatus: 'APPROVED', status: 'Verified', joined: '2026-04-10' },
  { _id: 'u-3', name: 'Kovai Wheels Rental', email: 'rentals@localmate.com', role: 'provider', area: 'Gandhipuram', verificationStatus: 'APPROVED', status: 'Verified', joined: '2026-06-01' },
  { _id: 'u-4', name: 'Lakshmi Deep Clean', email: 'cleaning@localmate.com', role: 'provider', area: 'Saravanampatti', verificationStatus: 'APPROVED', status: 'Verified', joined: '2026-06-15' },
  { _id: 'u-5', name: 'Pradeep Auto Care', email: 'pradeep@localmate.com', role: 'provider', area: 'RS Puram', verificationStatus: 'PENDING', status: 'Pending', joined: '2026-07-20' },
];

const INITIAL_BOOKINGS_AUDIT = [
  { _id: 'bk-101', customer: { name: 'Priya Natarajan', email: 'priya@localmate.com' }, provider: { name: 'Suresh Kumar' }, service: { title: 'Emergency Electrical Repair' }, address: 'Peelamedu', totalAmount: 250, bookingDate: '2026-10-10', timeSlot: '10:00 AM - 12:00 PM', status: 'completed', createdAt: '2026-10-05' },
  { _id: 'bk-102', customer: { name: 'Vignesh M.', email: 'vignesh@localmate.com' }, provider: { name: 'Kovai Wheels Rental' }, service: { title: 'Royal Enfield Bike Rental' }, address: 'Gandhipuram', totalAmount: 450, bookingDate: '2026-10-11', timeSlot: '09:00 AM - 11:00 AM', status: 'accepted', createdAt: '2026-10-06' },
  { _id: 'bk-103', customer: { name: 'Deepak S.', email: 'deepak@localmate.com' }, provider: { name: 'Lakshmi Deep Clean' }, service: { title: 'Deep Home Cleaning 2BHK' }, address: 'Saravanampatti', totalAmount: 1499, bookingDate: '2026-10-12', timeSlot: '02:00 PM - 04:00 PM', status: 'pending', createdAt: '2026-10-07' },
];

const INITIAL_REPORTS = [
  { id: 'rep-1', user: 'Priya Natarajan', provider: 'Demo Worker', reason: 'Late arrival by 30 mins', date: '2026-10-01', status: 'Resolved' },
  { id: 'rep-2', user: 'Sundar K.', provider: 'Sample Plumber', reason: 'Requested extra off-platform fee', date: '2026-10-05', status: 'Under Review' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [categories, setCategories] = useState(LOCALMATE_SECTORS.map((s) => ({ _id: s.id, name: s.name, serviceCount: 15, isActive: true })));
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS_AUDIT);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');

  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [newProvName, setNewProvName] = useState('');
  const [newProvEmail, setNewProvEmail] = useState('');
  const [newProvPassword, setNewProvPassword] = useState('Welcome@123');
  const [newProvPhone, setNewProvPhone] = useState('+91 98400 00000');
  const [newProvCategory, setNewProvCategory] = useState('Home & Emergency Services');
  const [newProvSkills, setNewProvSkills] = useState('Wiring, Circuit Repair');
  const [newProvExperience, setNewProvExperience] = useState(5);
  const [newProvArea, setNewProvArea] = useState('Peelamedu');
  const [newProvBio, setNewProvBio] = useState('Experienced local service provider in Coimbatore.');
  const [newProvStatus, setNewProvStatus] = useState('APPROVED');

  const [editingProvider, setEditingProvider] = useState(null);

  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');

  const [viewingBooking, setViewingBooking] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: userData } = await API.get('/admin/users');
        if (userData.success && userData.users?.length > 0) {
          setUsers(userData.users);
        }
      } catch (err) {}

      try {
        const { data: bData } = await API.get('/admin/bookings');
        if (bData.success && bData.bookings?.length > 0) {
          setBookings(bData.bookings);
        }
      } catch (err) {}

      try {
        const { data: cData } = await API.get('/categories');
        if (cData.success && cData.categories?.length > 0) {
          setCategories(cData.categories);
        }
      } catch (err) {}
    };

    fetchAdminData();
  }, []);

  const handleUpdateProviderStatus = async (id, newStatus) => {
    if (String(id).startsWith('usr-')) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, verificationStatus: newStatus, isApproved: newStatus === 'APPROVED', isVerifiedProvider: newStatus === 'APPROVED' }
            : u
        )
      );
      toast.success(`Provider status updated to ${newStatus}.`);
      return;
    }
    try {
      await API.put(`/admin/users/${id}/status`, { verificationStatus: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, verificationStatus: newStatus, isApproved: newStatus === 'APPROVED', isVerifiedProvider: newStatus === 'APPROVED' }
            : u
        )
      );
      toast.success(`Provider status updated to ${newStatus}.`);
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, verificationStatus: newStatus, isApproved: newStatus === 'APPROVED', isVerifiedProvider: newStatus === 'APPROVED' }
            : u
        )
      );
      toast.success(`Provider status updated to ${newStatus} (Local update).`);
    }
  };

  const handleRemoveUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user account permanently?')) return;
    if (String(id).startsWith('usr-')) {
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User removed from platform.');
      return;
    }
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User removed from platform.');
    } catch (err) {
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User removed from platform (Local update).');
    }
  };

  const handleCreateProvider = async (e) => {
    e.preventDefault();
    if (!newProvName || !newProvEmail || !newProvPassword) {
      toast.error('Name, email, and password are required.');
      return;
    }

    const payload = {
      name: newProvName,
      email: newProvEmail,
      password: newProvPassword,
      phone: newProvPhone,
      skills: newProvSkills,
      experienceYears: Number(newProvExperience),
      bio: newProvBio,
      area: newProvArea,
      verificationStatus: newProvStatus,
    };

    try {
      const { data } = await API.post('/admin/providers', payload);
      if (data.success && data.provider) {
        setUsers([data.provider, ...users]);
      } else {
        setUsers([
          { _id: 'u-' + Date.now(), role: 'provider', ...payload, isApproved: newProvStatus === 'APPROVED' },
          ...users,
        ]);
      }
      toast.success(`Provider ${newProvName} created successfully! They can now log in.`);
      setShowAddProviderModal(false);
      setNewProvName('');
      setNewProvEmail('');
    } catch (err) {
      setUsers([
        { _id: 'u-' + Date.now(), role: 'provider', ...payload, isApproved: newProvStatus === 'APPROVED' },
        ...users,
      ]);
      toast.success(`Provider ${newProvName} created! (Local update)`);
      setShowAddProviderModal(false);
    }
  };

  const handleSaveEditProvider = async (e) => {
    e.preventDefault();
    if (!editingProvider) return;

    try {
      await API.put(`/admin/providers/${editingProvider._id}`, editingProvider);
      setUsers((prev) =>
        prev.map((u) => (u._id === editingProvider._id ? editingProvider : u))
      );
      toast.success('Provider profile updated.');
    } catch (err) {
      setUsers((prev) =>
        prev.map((u) => (u._id === editingProvider._id ? editingProvider : u))
      );
      toast.success('Provider updated (Local update).');
    }
    setEditingProvider(null);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const { data } = await API.post('/categories', {
        name: newCatName.trim(),
        description: newCatDescription.trim(),
      });
      if (data.success && data.category) {
        setCategories([...categories, data.category]);
      } else {
        setCategories([...categories, { _id: 'cat-' + Date.now(), name: newCatName.trim(), serviceCount: 0, isActive: true }]);
      }
      toast.success('Category added.');
    } catch (err) {
      setCategories([...categories, { _id: 'cat-' + Date.now(), name: newCatName.trim(), serviceCount: 0, isActive: true }]);
      toast.success('Category added (Local update).');
    }

    setNewCatName('');
    setNewCatDescription('');
    setShowCatModal(false);
  };

  const handleToggleCategoryActive = async (cat) => {
    const updatedStatus = !cat.isActive;
    try {
      await API.put(`/categories/${cat._id}`, { isActive: updatedStatus });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: updatedStatus } : c))
      );
      toast.success(`Category ${updatedStatus ? 'Activated' : 'Deactivated'}.`);
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, isActive: updatedStatus } : c))
      );
      toast.success(`Status updated (Local update).`);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success('Category deleted.');
    } catch (err) {
      setCategories(categories.filter((c) => c._id !== id));
      toast.success('Category removed (Local update).');
    }
  };

  const customers = users.filter((u) => u.role === 'customer');
  const providers = users.filter((u) => u.role === 'provider');
  const pendingApprovalProviders = providers.filter(
    (p) => (p.verificationStatus || p.status) === 'PENDING' || p.status === 'Pending'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> LocalMate Administrator Control Panel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Coimbatore Marketplace Administration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage service providers, approve registrations, monitor booking requests, and control categories.
          </p>
        </div>

        <button
          onClick={() => setShowAddProviderModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Provider Manually
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Total Customers"
          value={customers.length}
          trend="Coimbatore Users"
          isIncrease={true}
        />
        <StatCard
          icon={Briefcase}
          title="Service Providers"
          value={providers.length}
          trend={`${providers.filter((p) => (p.verificationStatus || p.status) === 'APPROVED' || p.status === 'Verified').length} Approved`}
          isIncrease={true}
        />
        <StatCard
          icon={Clock}
          title="Pending Approvals"
          value={pendingApprovalProviders.length}
          trend={pendingApprovalProviders.length > 0 ? 'Action required' : 'All clear'}
          isIncrease={pendingApprovalProviders.length === 0}
        />
        <StatCard
          icon={Calendar}
          title="Total Bookings"
          value={bookings.length}
          trend="Across platform"
          isIncrease={true}
        />
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'approvals', label: `Provider Approvals (${pendingApprovalProviders.length})` },
          { id: 'providers', label: `Providers (${providers.length})` },
          { id: 'customers', label: `Customers (${customers.length})` },
          { id: 'bookings', label: `Bookings (${bookings.length})` },
          { id: 'categories', label: `Categories (${categories.length})` },
          { id: 'reports', label: `Reports (${reports.length})` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Providers Pending Approval
              </h3>
              <button onClick={() => setActiveTab('approvals')} className="text-xs text-blue-600 font-bold hover:underline">
                View All ({pendingApprovalProviders.length})
              </button>
            </div>

            {pendingApprovalProviders.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No providers awaiting approval.</p>
            ) : (
              <div className="space-y-3">
                {pendingApprovalProviders.slice(0, 3).map((p) => (
                  <div key={p._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</h4>
                      <p className="text-[11px] text-slate-500">{p.email} • {p.address?.area || p.area || 'Coimbatore'}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleUpdateProviderStatus(p._id, 'APPROVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateProviderStatus(p._id, 'REJECTED')}
                        className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 text-[11px] font-bold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Recent Booking Activity
              </h3>
              <button onClick={() => setActiveTab('bookings')} className="text-xs text-blue-600 font-bold hover:underline">
                View All ({bookings.length})
              </button>
            </div>

            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div key={b._id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {b.service?.title || 'Service Booking'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Customer: {b.customer?.name || 'Customer'} → Provider: {b.provider?.name || 'Provider'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      b.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : b.status === 'accepted'
                        ? 'bg-blue-100 text-blue-700'
                        : b.status === 'rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {b.status?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Pending Provider Verification Requests
              </h3>
              <p className="text-xs text-slate-500">
                Only APPROVED providers appear publicly on the marketplace. Review credentials below.
              </p>
            </div>
          </div>

          {pendingApprovalProviders.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">All provider applications have been reviewed!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="p-3.5">Provider</th>
                    <th className="p-3.5">Area</th>
                    <th className="p-3.5">Skills / Experience</th>
                    <th className="p-3.5">Phone</th>
                    <th className="p-3.5 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {pendingApprovalProviders.map((p) => (
                    <tr key={p._id}>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.email}</div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {p.address?.area || p.area || 'Coimbatore'}
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {p.skills?.join(', ') || 'General Service'} • {p.experienceYears || 2} Years
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {p.phone || '+91 98400 00000'}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateProviderStatus(p._id, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateProviderStatus(p._id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                All Registered Service Providers
              </h3>
              <p className="text-xs text-slate-500">
                Control approval, suspend fraudulent accounts, or edit provider information.
              </p>
            </div>
            <button
              onClick={() => setShowAddProviderModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" /> Add Provider
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Area</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {providers.map((p) => {
                  const status = p.verificationStatus || (p.isApproved ? 'APPROVED' : 'PENDING');
                  return (
                    <tr key={p._id}>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.email} • {p.phone || 'No phone'}</div>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-300">
                        {p.address?.area || p.area || 'Peelamedu'}, Coimbatore
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : status === 'SUSPENDED'
                              ? 'bg-rose-100 text-rose-700'
                              : status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setEditingProvider(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                          title="Edit Provider"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {status !== 'APPROVED' && (
                          <button
                            onClick={() => handleUpdateProviderStatus(p._id, 'APPROVED')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]"
                          >
                            Approve
                          </button>
                        )}

                        {status !== 'SUSPENDED' && (
                          <button
                            onClick={() => handleUpdateProviderStatus(p._id, 'SUSPENDED')}
                            className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 text-[11px] font-bold"
                          >
                            Suspend
                          </button>
                        )}

                        {status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleUpdateProviderStatus(p._id, 'APPROVED')}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold"
                          >
                            Activate
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveUser(p._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                          title="Delete Provider"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Registered Customers in Coimbatore
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Area</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {c.name}
                      <span className="block font-normal text-slate-400 text-[11px]">{c.email}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {c.address?.area || c.area || 'Gandhipuram'}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {c.phone || '+91 98401 23456'}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleRemoveUser(c._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Delete customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Platform Service Bookings & Requests Audit
            </h3>
            <p className="text-xs text-slate-500">
              Full visibility over all customer booking requests and statuses. Note: Providers manage their own accept/reject decisions.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3.5">Booking ID</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {b._id.slice(-6)}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      {b.service?.title || 'Service'}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {b.customer?.name || 'Customer'}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      {b.provider?.name || 'Provider'}
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {b.bookingDate} • {b.timeSlot}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      ₹{b.totalAmount || b.amount || 0}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          b.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : b.status === 'accepted'
                            ? 'bg-blue-100 text-blue-700'
                            : b.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : b.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setViewingBooking(b)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Platform Service Categories
              </h3>
              <p className="text-xs text-slate-500">
                Add, edit, or deactivate categories without altering frontend code.
              </p>
            </div>
            <button
              onClick={() => setShowCatModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-5">
            {categories.map((c) => (
              <div
                key={c._id || c.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {c.serviceCount || 0} listings • {c.isActive !== false ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleCategoryActive(c)}
                    className="p-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-blue-600"
                    title={c.isActive !== false ? 'Deactivate' : 'Activate'}
                  >
                    {c.isActive !== false ? <Ban className="w-4 h-4 text-amber-500" /> : <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="glass-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Customer Reports & Grievances
            </h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{r.reason}</h4>
                  <p className="text-[11px] text-slate-500">By {r.user} against {r.provider} • {r.date}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add New Service Provider
              </h3>
              <button onClick={() => setShowAddProviderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProvider} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Provider Name *
                  </label>
                  <input
                    type="text"
                    value={newProvName}
                    onChange={(e) => setNewProvName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newProvEmail}
                    onChange={(e) => setNewProvEmail(e.target.value)}
                    placeholder="ramesh@localmate.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={newProvPassword}
                    onChange={(e) => setNewProvPassword(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newProvPhone}
                    onChange={(e) => setNewProvPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Area
                  </label>
                  <select
                    value={newProvArea}
                    onChange={(e) => setNewProvArea(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {CBE_AREAS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={newProvExperience}
                    onChange={(e) => setNewProvExperience(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={newProvSkills}
                  onChange={(e) => setNewProvSkills(e.target.value)}
                  placeholder="AC Repair, Gas Refill, Electrical"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Verification Status
                </label>
                <select
                  value={newProvStatus}
                  onChange={(e) => setNewProvStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="APPROVED">APPROVED (Active in marketplace)</option>
                  <option value="PENDING">PENDING (Requires review)</option>
                  <option value="SUSPENDED">SUSPENDED (Disabled)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Bio
                </label>
                <textarea
                  rows="2"
                  value={newProvBio}
                  onChange={(e) => setNewProvBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddProviderModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Create Provider Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit Provider Profile
              </h3>
              <button onClick={() => setEditingProvider(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProvider} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  value={editingProvider.name}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingProvider.phone || ''}
                  onChange={(e) => setEditingProvider({ ...editingProvider, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Verification Status</label>
                <select
                  value={editingProvider.verificationStatus || 'APPROVED'}
                  onChange={(e) => setEditingProvider({ ...editingProvider, verificationStatus: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Add New Service Category
              </h3>
              <button onClick={() => setShowCatModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pet Services"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Booking Information
              </h3>
              <button onClick={() => setViewingBooking(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p><strong>Booking ID:</strong> <span className="font-mono">{viewingBooking._id}</span></p>
              <p><strong>Service:</strong> {viewingBooking.service?.title}</p>
              <p><strong>Customer:</strong> {viewingBooking.customer?.name} ({viewingBooking.customer?.email})</p>
              <p><strong>Provider:</strong> {viewingBooking.provider?.name}</p>
              <p><strong>Date & Time:</strong> {viewingBooking.bookingDate} ({viewingBooking.timeSlot})</p>
              <p><strong>Address:</strong> {viewingBooking.address}</p>
              <p><strong>Amount:</strong> ₹{viewingBooking.totalAmount || viewingBooking.amount}</p>
              <p><strong>Status:</strong> {viewingBooking.status?.toUpperCase()}</p>
              {viewingBooking.notes && <p><strong>Customer Note:</strong> "{viewingBooking.notes}"</p>}
              {viewingBooking.rejectionReason && (
                <p className="text-rose-600"><strong>Declined Reason:</strong> {viewingBooking.rejectionReason}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setViewingBooking(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
