"use client";
import { motion } from "motion/react";

// Layout grammar: super-tall hero with stacked chalkboard menu below.
// Heavy slab type + handwritten chalk script accent.

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col pt-16">
      {/* Awning band at the top */}
      <div className="h-8 awning border-b-4 border-charcoal" />

      <div className="flex-1 flex items-center pt-12 pb-16 relative">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-10 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-8">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="font-chalk text-4xl text-tomato wave inline-block">
              hello, sandwich.
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1 }} className="mt-2 font-display text-[clamp(4rem,11vw,11rem)] text-charcoal leading-[0.88] uppercase tracking-tight">
              CHUBBIES <br/>
              <span className="text-tomato">DELI.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="mt-6 max-w-xl text-lg text-graphite leading-relaxed">
              Heroes, breakfast sandwiches, hot platters, and the deli
              stuff your day needs. Central Ave, Orange NJ. Open six to
              six, six days a week.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45 }} className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#heroes" className="bg-tomato text-tile px-8 py-4 font-display text-lg uppercase hover:bg-charcoal transition-colors">
                SEE HEROES →
              </a>
              <a href="tel:" className="border-2 border-charcoal text-charcoal px-8 py-4 font-display text-lg uppercase hover:bg-mustard transition-colors">
                CALL AHEAD
              </a>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 4 }} animate={{ opacity: 1, scale: 1, rotate: 2 }} transition={{ duration: 1.0, delay: 0.4 }} className="col-span-12 md:col-span-4 wave">
            <div className="stamp-ink bg-mustard p-6 border-4 border-charcoal text-charcoal text-center">
              <div className="font-chalk text-2xl">today&apos;s special</div>
              <div className="mt-2 font-display text-4xl uppercase leading-none">CHICKEN PARM HERO</div>
              <div className="mt-3 font-display text-3xl">$11.95</div>
              <div className="mt-2 font-chalk text-xl text-tomato">incl. fries · cold drink</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-8 awning border-t-4 border-charcoal" />
    </section>
  );
}
