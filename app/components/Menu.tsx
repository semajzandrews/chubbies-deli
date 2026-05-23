"use client";
import { motion } from "motion/react";

const HEROES = [
  { n: "Italian Combo",     ing: "Ham · salami · provolone · pepperoncini",  p: "10.95" },
  { n: "Chicken Parm",      ing: "Breaded cutlet · marinara · mozz · basil", p: "11.95" },
  { n: "Roast Beef + Cheddar", ing: "Sliced thin · horseradish mayo · onion", p: "12.50" },
  { n: "Eggplant Parm",     ing: "Same as Chicken Parm but eggplant",         p: "10.95" },
  { n: "The Reuben",        ing: "Corned beef · kraut · swiss · rye · russian", p: "12.95" },
  { n: "Turkey Club",       ing: "Roast turkey · bacon · lettuce · tomato",   p: "10.95" },
];

const BREAKFAST = [
  { n: "BEC",               ing: "Bacon · egg · cheese on a roll", p: "5.50" },
  { n: "SEC",               ing: "Sausage · egg · cheese on a roll", p: "5.50" },
  { n: "PEC",               ing: "Pork roll · egg · cheese on a roll", p: "5.75" },
  { n: "Western Omelette",  ing: "Ham · peppers · onion · cheese on rye toast", p: "8.50" },
  { n: "French Toast Combo", ing: "Stack + bacon or sausage + coffee", p: "9.95" },
];

const HOT = [
  { n: "Chicken Cutlet Platter",  ing: "Two cutlets · two sides · roll", p: "13.95" },
  { n: "Meatball Hero",            ing: "House meatballs · marinara · provolone", p: "10.50" },
  { n: "Soup of the Day",          ing: "Ask at the counter", p: "5.50" },
  { n: "Mac + Cheese (qt)",        ing: "Three-cheese, baked on top", p: "8.95" },
];

function Section({ id, title, items, accent }: { id: string; title: string; items: typeof HEROES; accent: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${id === "heroes" ? "bg-tile-2" : id === "breakfast" ? "chalkboard text-tile" : "bg-olive text-tile"}`}>
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <div className="mb-10">
          <div className={`font-chalk text-3xl ${accent}`}>— the menu —</div>
          <h2 className="mt-1 font-display text-[clamp(2.5rem,6vw,5.5rem)] uppercase leading-[0.95]">{title}</h2>
        </div>
        <ul className="space-y-5">
          {items.map((it, i) => (
            <motion.li key={it.n} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.5, delay: i*0.04 }} className="flex items-baseline gap-4">
              <span className="font-display text-2xl uppercase whitespace-nowrap">{it.n}</span>
              <span className="hidden md:inline-block flex-1 border-b border-dashed border-current/30 translate-y-[-4px]"/>
              <span className="hidden md:inline text-sm opacity-70 italic">{it.ing}</span>
              <span className="font-display text-3xl tabnum ml-auto md:ml-4">${it.p}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Menu() {
  return (
    <>
      <Section id="heroes" title="THE HEROES" items={HEROES} accent="text-tomato" />
      <Section id="breakfast" title="BREAKFAST ALL DAY" items={BREAKFAST} accent="text-mustard" />
      <Section id="hot" title="HOT PLATES" items={HOT} accent="text-mustard" />
    </>
  );
}
