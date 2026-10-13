import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';

dotenv.config();

const categories = [
  { name: 'Home & Emergency Services', slug: 'home-emergency', icon: 'Home', description: 'Electricians, plumbers, carpenters, painters & AC repairs', isPopular: true },
  { name: 'Vehicle Services', slug: 'vehicle-services', icon: 'Wrench', description: 'Bike & car mechanics, puncture repair, doorstep wash & battery boost', isPopular: true },
  { name: 'Rentals', slug: 'rentals', icon: 'Bike', description: 'Bikes, scooters, cars, laptops, cameras & sound systems for rent', isPopular: true },
  { name: 'Cleaning & Pest Control', slug: 'cleaning-pest-control', icon: 'Sparkles', description: 'Deep house cleaning, sofa washing, water tank & termite control', isPopular: true },
  { name: 'Moving & Transport', slug: 'moving-transport', icon: 'Truck', description: 'House shifting, furniture transport & mini truck booking', isPopular: true },
  { name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Home tutors, coding tutors, music teachers & spoken English', isPopular: true },
  { name: 'IT & Digital', slug: 'it-digital', icon: 'Laptop', description: 'Web development, computer repair, UI/UX & graphic design', isPopular: true },
  { name: 'Events', slug: 'events', icon: 'Calendar', description: 'Wedding photography, catering, DJ, stage setup & decorators', isPopular: true },
  { name: 'Health & Fitness', slug: 'health-fitness', icon: 'Activity', description: 'Personal trainers, yoga instructors, home nurse & physiotherapist', isPopular: false },
  { name: 'Household Help', slug: 'household-help', icon: 'Users', description: 'Home cooks, house maids, babysitters & elder care assistance', isPopular: false },
  { name: 'Garden & Outdoor', slug: 'garden-outdoor', icon: 'Trees', description: 'Lawn maintenance, plant care, terrace gardening & outdoor lights', isPopular: false },
  { name: 'Pet Services', slug: 'pet-services', icon: 'HeartHandshake', description: 'Pet grooming, dog walking, pet boarding & aquarium cleaning', isPopular: false },
  { name: 'Business Services', slug: 'business-services', icon: 'Briefcase', description: 'GST filing, tax consultants, legal advice & office sanitation', isPopular: false },
];

export const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/localmate');
    console.log('[Seed] Connected to MongoDB for LocalMate Coimbatore seeding...');

    await User.deleteMany({});
    await Category.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});

    const admin = await User.create({
      name: 'LocalMate Admin',
      email: 'admin@localmate.com',
      password: 'Password123!',
      role: 'admin',
      phone: '+91 98400 11223',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      address: { street: 'Race Course Road', area: 'Race Course', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641018' },
      isVerifiedProvider: true,
    });

    const customer = await User.create({
      name: 'Priya Natarajan',
      email: 'customer@localmate.com',
      password: 'Password123!',
      role: 'customer',
      phone: '+91 98401 23456',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      address: { street: '12 VOC Street', area: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012' },
    });

    const provider1 = await User.create({
      name: 'Suresh Kumar',
      email: 'provider@localmate.com',
      password: 'Password123!',
      role: 'provider',
      phone: '+91 98421 11001',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Trusted local electrician in Peelamedu with 6 years experience. Specializes in emergency repairs and wiring.',
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
      address: { street: '24 Avinashi Road', area: 'Peelamedu', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641004' },
    });

    const provider2 = await User.create({
      name: 'Karthik Raja',
      email: 'karthik@localmate.com',
      password: 'Password123!',
      role: 'provider',
      phone: '+91 98422 22002',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'Affordable electrician based near Gandhipuram. Honest pricing and prompt visits.',
      skills: ['Fan Repair', 'Switch Replacement', 'Earthing Test'],
      experienceYears: 4,
      hourlyRate: 200,
      startingPrice: 200,
      completedJobs: 35,
      availabilityStatus: 'Available Now',
      serviceAreas: ['Gandhipuram', 'Ramnagar', 'Town Hall'],
      rating: 4.5,
      numReviews: 35,
      isVerifiedProvider: true,
      address: { street: '7 Cross Cut Road', area: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012' },
    });

    const provider3 = await User.create({
      name: 'Muruganandam K.',
      email: 'murugan@localmate.com',
      password: 'Password123!',
      role: 'provider',
      phone: '+91 98423 33003',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      bio: 'Licensed electrical contractor serving RS Puram and Saibaba Colony. Over 65 completed jobs.',
      skills: ['Inverter Repair', 'Distribution Box', 'Earthing', 'Home Inspection'],
      experienceYears: 8,
      hourlyRate: 300,
      startingPrice: 300,
      completedJobs: 67,
      availabilityStatus: 'Busy',
      serviceAreas: ['RS Puram', 'Saibaba Colony', 'Vadavalli'],
      rating: 4.9,
      numReviews: 67,
      isVerifiedProvider: true,
      address: { street: '18 DB Road', area: 'RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002' },
    });

    const provider4 = await User.create({
      name: 'Kovai Wheels Rental',
      email: 'rentals@localmate.com',
      password: 'Password123!',
      role: 'provider',
      phone: '+91 98431 22011',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Popular two-wheeler rental agency in Gandhipuram. Sanitized helmets and documents included.',
      skills: ['Bike Rental', 'Scooter Hire', 'Helmet Provided'],
      experienceYears: 5,
      hourlyRate: 60,
      startingPrice: 450,
      completedJobs: 54,
      availabilityStatus: 'Available Now',
      serviceAreas: ['Gandhipuram', 'Peelamedu'],
      rating: 4.8,
      numReviews: 54,
      isVerifiedProvider: true,
      address: { street: 'Gandhipuram Bus Stand', area: 'Gandhipuram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641012' },
    });

    await Category.insertMany(categories);

    const srv1 = await Service.create({
      title: 'Emergency Electrical Repair & Circuit Fix',
      description: 'Fast help for power cut, tripped breaker, switchboard spark, and fuse repair in Peelamedu.',
      category: 'Home & Emergency Services',
      price: 250,
      duration: '45-60 Mins',
      provider: provider1._id,
      images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'],
      location: 'Peelamedu, Coimbatore',
      area: 'Peelamedu',
      distanceKm: 1.2,
      experienceRequired: '6 Years experience',
      availability: 'Available Now',
      rating: 4.8,
      numReviews: 42,
      tags: ['Electrician', 'Power Problem', 'Wiring'],
    });

    const srv2 = await Service.create({
      title: 'Switch Board & Fan Wiring Repair',
      description: 'Replacing damaged switches, ceiling fan regulators, and light fixtures around Gandhipuram.',
      category: 'Home & Emergency Services',
      price: 200,
      duration: '30-45 Mins',
      provider: provider2._id,
      images: ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
      location: 'Gandhipuram, Coimbatore',
      area: 'Gandhipuram',
      distanceKm: 2.1,
      experienceRequired: '4 Years experience',
      availability: 'Available Now',
      rating: 4.5,
      numReviews: 35,
      tags: ['Electrician', 'Fan Repair', 'Switch'],
    });

    const srv3 = await Service.create({
      title: 'Royal Enfield & Daily Commute Bike Rental',
      description: 'Clean bikes for daily rental near Gandhipuram. Classic 350 and Honda Shine available.',
      category: 'Rentals',
      price: 450,
      duration: 'Per Day',
      provider: provider4._id,
      images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
      location: 'Gandhipuram, Coimbatore',
      area: 'Gandhipuram',
      distanceKm: 1.8,
      experienceRequired: 'Fleet Agency',
      availability: 'Available Now',
      isRental: true,
      hourlyPrice: 60,
      dailyPrice: 450,
      securityDeposit: 1000,
      pickupLocation: 'Gandhipuram Bus Stand, Coimbatore',
      helmetAvailable: true,
      rating: 4.8,
      numReviews: 54,
      tags: ['Bike Rental', 'Scooter', 'Travel'],
    });

    const booking1 = await Booking.create({
      customer: customer._id,
      provider: provider1._id,
      service: srv1._id,
      bookingDate: '2026-10-09',
      timeSlot: '11:00 AM - 01:00 PM',
      address: '18 DB Road, RS Puram, Coimbatore',
      totalAmount: 250,
      status: 'completed',
      paymentStatus: 'paid',
      paymentId: 'PAY-DEMO-001',
    });

    await Booking.create({
      customer: customer._id,
      provider: provider1._id,
      service: srv1._id,
      bookingDate: '2026-10-15',
      timeSlot: '10:00 AM - 12:00 PM',
      address: '12 VOC Street, Gandhipuram, Coimbatore',
      notes: 'Circuit breaker trips when AC is turned on.',
      totalAmount: 250,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await Booking.create({
      customer: customer._id,
      provider: provider1._id,
      service: srv1._id,
      bookingDate: '2026-10-15',
      timeSlot: '02:00 PM - 04:00 PM',
      address: '45 Avinashi Road, Peelamedu, Coimbatore',
      notes: 'Need sediment and carbon filter replacement.',
      totalAmount: 349,
      status: 'accepted',
      paymentStatus: 'pending',
    });

    await Review.create({
      user: customer._id,
      provider: provider1._id,
      service: srv1._id,
      booking: booking1._id,
      rating: 5,
      comment: 'Suresh arrived right on time at our Gandhipuram home and fixed our tripping breaker in 30 minutes! Very honest and clear.',
    });

    console.log('[Seed] LocalMate Coimbatore database successfully seeded with demo accounts & services.');
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
