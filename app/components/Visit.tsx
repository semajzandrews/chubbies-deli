"use client";
import { motion } from "motion/react";
import { CallOrTextPair } from "./CallOrText";

export default function Visit() {
  return (
    <section id="visit" className="py-24 md:py-32">
      <div className="h-6 awning border-y-4 border-charcoal mb-12"/>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10 text-center">
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <div className="font-chalk text-3xl text-tomato">— come thru —</div>
          <h2 className="mt-1 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] text-charcoal">
            CENTRAL AVE.
          </h2>
          <div className="mt-2 font-chalk text-3xl text-olive">orange, new jersey</div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { k: "Mon – Sat", v: "6 AM – 6 PM", bg: "bg-mustard text-charcoal" },
            { k: "Sunday",    v: "Closed",      bg: "bg-charcoal text-tile" },
            { k: "Catering",  v: "Call ahead",  bg: "bg-tomato text-tile" },
          ].map((s) => (
            <div key={s.k} className={`${s.bg} p-6 border-4 border-charcoal stamp-ink`}>
              <div className="font-chalk text-2xl">{s.k}</div>
              <div className="mt-2 font-display text-3xl uppercase">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <CallOrTextPair />
        </div>
      </div>
      <div className="h-6 awning border-y-4 border-charcoal mt-12"/>
    </section>
  );
}
