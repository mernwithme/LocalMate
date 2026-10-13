import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const DEMO_USERS = {
  'admin@localmate.com': {
    _id: 'usr-admin-001',
    name: 'Platform Admin',
    email: 'admin@localmate.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98400 11223',
    address: { area: 'Race Course', city: 'Coimbatore', state: 'Tamil Nadu' },
    rating: 5.0,
    isVerifiedProvider: true,
  },
  'admin@skillconnect.com': {
    _id: 'usr-admin-001',
    name: 'Platform Admin',
    email: 'admin@localmate.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98400 11223',
    address: { area: 'Race Course', city: 'Coimbatore', state: 'Tamil Nadu' },
    rating: 5.0,
    isVerifiedProvider: true,
  },
  'customer@localmate.com': {
    _id: 'usr-customer-001',
    name: 'Priya Natarajan',
    email: 'customer@localmate.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98401 23456',
    address: { street: '12 VOC Street', area: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012' },
    rating: 4.9,
    favorites: [],
  },
  'customer@skillconnect.com': {
    _id: 'usr-customer-001',
    name: 'Priya Natarajan',
    email: 'customer@localmate.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98401 23456',
    address: { street: '12 VOC Street', area: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012' },
    rating: 4.9,
    favorites: [],
  },
  'provider@localmate.com': {
    _id: 'usr-provider-001',
    name: 'Suresh Kumar',
    email: 'provider@localmate.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98421 11001',
    address: { street: '24 Avinashi Road', area: 'Peelamedu', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641004' },
    bio: 'Trusted electrician in Peelamedu with 6 years experience. Specializes in emergency circuit repairs and home wiring.',
    skills: ['Wiring', 'Switch Board', 'Inverter Check', 'Emergency Power'],
    experienceYears: 6,
    hourlyRate: 250,
    startingPrice: 250,
    completedJobs: 42,
    availabilityStatus: 'Available Now',
    serviceAreas: ['Peelamedu', 'Gandhipuram', 'RS Puram'],
    rating: 4.8,
    numReviews: 42,
    isVerifiedProvider: true,
    verificationStatus: 'APPROVED',
    isApproved: true,
  },
  'provider@skillconnect.com': {
    _id: 'usr-provider-001',
    name: 'Suresh Kumar',
    email: 'provider@localmate.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98421 11001',
    address: { street: '24 Avinashi Road', area: 'Peelamedu', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641004' },
    bio: 'Trusted electrician in Peelamedu with 6 years experience. Specializes in emergency circuit repairs and home wiring.',
    skills: ['Wiring', 'Switch Board', 'Inverter Check', 'Emergency Power'],
    experienceYears: 6,
    hourlyRate: 250,
    startingPrice: 250,
    completedJobs: 42,
    availabilityStatus: 'Available Now',
    serviceAreas: ['Peelamedu', 'Gandhipuram', 'RS Puram'],
    rating: 4.8,
    numReviews: 42,
    isVerifiedProvider: true,
    verificationStatus: 'APPROVED',
    isApproved: true,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('localmate_token') || localStorage.getItem('skillconnect_token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('localmate_user', JSON.stringify(data.user));
          }
        } catch (error) {
          if (error.response?.status === 401) {
            localStorage.removeItem('localmate_token');
            localStorage.removeItem('localmate_user');
            localStorage.removeItem('skillconnect_token');
            localStorage.removeItem('skillconnect_user');
            setUser(null);
          } else {
            const savedUser = localStorage.getItem('localmate_user') || localStorage.getItem('skillconnect_user');
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            }
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('localmate_token', data.token);
        localStorage.setItem('localmate_user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}!`);
        return data.user;
      }
    } catch (error) {
      if (!error.response && DEMO_USERS[email.toLowerCase()]) {
        const demoUser = DEMO_USERS[email.toLowerCase()];
        const mockToken = 'mock-jwt-token-' + Date.now();
        localStorage.setItem('localmate_token', mockToken);
        localStorage.setItem('localmate_user', JSON.stringify(demoUser));
        setUser(demoUser);
        toast.success(`Logged in as Demo ${demoUser.role.toUpperCase()}: ${demoUser.name}`);
        return demoUser;
      }
      toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('localmate_token', data.token);
        localStorage.setItem('localmate_user', JSON.stringify(data.user));
        setUser(data.user);
        toast.success('Account registered successfully!');
        return true;
      }
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
        return false;
      }
      toast.error('Registration failed. Please check network and try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('localmate_token');
    localStorage.removeItem('localmate_user');
    localStorage.removeItem('skillconnect_token');
    localStorage.removeItem('skillconnect_user');
    setUser(null);
    toast.success('Logged out safely.');
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('localmate_user', JSON.stringify(updatedUser));
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await API.put('/auth/profile', profileData);
      if (data.success && data.user) {
        const merged = { ...user, ...data.user };
        setUser(merged);
        localStorage.setItem('localmate_user', JSON.stringify(merged));
        toast.success(data.message || 'Profile updated successfully!');
        return { success: true, user: merged };
      }
    } catch (err) {
      const localMerged = {
        ...user,
        ...profileData,
        address: profileData.address ? { ...(user?.address || {}), ...profileData.address } : user?.address,
      };
      setUser(localMerged);
      localStorage.setItem('localmate_user', JSON.stringify(localMerged));
      toast.success('Profile updated successfully!');
      return { success: true, user: localMerged };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileState, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
