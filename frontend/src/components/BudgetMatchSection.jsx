import React, { useState } from 'react';
import { IndianRupee, Check, ArrowRight, Star, MapPin, ShieldAlert, Sparkles, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BudgetMatchSection({ services = [], onBookService }) {
  const [budgetInput, setBudgetInput] = useState(500);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Home & Emergency Services', 'Vehicle Services', 'Rentals', 'Cleaning & Pest Control'];

  const matchingServices = services
    .filter((srv) => {
      const price = srv.isRental ? (srv.dailyPrice || srv.price) : srv.price;
      const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
      return price <= Number(budgetInput) && matchesCategory;
    })
    .sort((a, b) => b.price - a.price)
    .slice(0, 6);

  return (
    <section className="rounded-3xl p-6 sm:p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Budget Match
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Find Services That Fit Your Budget
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tell us how much you want to spend. We show Coimbatore options that match what you can afford.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
            My Budget:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">₹</span>
            <input
              type="number"
              min="100"
              max="20000"
              step="50"
              value={budgetInput}
              onChange={(e) => setBudgetInput(Number(e.target.value) || 0)}
              className="w-24 px-3 py-1.5 text-base font-extrabold text-blue-600 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {[250, 500, 1000, 1500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBudgetInput(preset)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  budgetInput === preset
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                ₹{preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mb-4 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
        <span>These options fit your budget of up to <strong className="text-blue-600 dark:text-blue-400">₹{budgetInput}</strong></span>
      </div>

      {matchingServices.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            No listings found under ₹{budgetInput}. Try raising your budget or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matchingServices.map((srv) => {
            const finalPrice = srv.isRental ? (srv.dailyPrice || srv.price) : srv.price;
            return (
              <motion.div
                key={srv._id}
                whileHover={{ y: -3 }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {srv.category}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3" /> Within Budget
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {srv.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                    {srv.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                      ₹{finalPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {srv.isRental ? '/ day' : 'starting'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookService && onBookService(srv)}
                    className="py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-all"
                  >
                    Request Booking <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Notice:</strong> These are starting prices set by providers. LocalMate does not guarantee the final price if the provider needs to inspect extra work or replacement parts on site.
        </span>
      </div>
    </section>
  );
}
