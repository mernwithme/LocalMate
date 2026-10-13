import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wrench,
  Sparkles,
  GraduationCap,
  Scissors,
  Camera,
  Laptop,
  Palette,
  HeartPulse,
  Dumbbell,
  Car,
  Utensils,
  Calendar,
  Briefcase,
  TrendingUp,
  Snowflake,
  Paintbrush,
  Shield,
} from 'lucide-react';

const ICON_MAP = {
  Wrench,
  Sparkles,
  GraduationCap,
  Scissors,
  Camera,
  Laptop,
  Palette,
  HeartPulse,
  Dumbbell,
  Car,
  Utensils,
  Calendar,
  Briefcase,
  TrendingUp,
  Snowflake,
  Paintbrush,
};

export default function CategoryCard({ category }) {
  const { name, icon, serviceCount, description } = category;
  const IconComponent = ICON_MAP[icon] || Shield;

  return (
    <Link to={`/services?category=${encodeURIComponent(name)}`}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className="glass-card p-5 rounded-2xl flex flex-col justify-between h-full border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-md shadow-blue-500/10">
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-950 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {serviceCount || Math.floor(Math.random() * 20 + 5)} Pros
          </span>
        </div>

        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {description || `Professional verified ${name.toLowerCase()} experts available.`}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
