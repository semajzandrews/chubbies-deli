"use client";

/**
 * Chubbie's Deli — order at the counter.
 *
 * SPINE (identical across every build): menu -> ticket -> pickup -> confirm
 *
 * SKIN (the seventeenth archetype, and the only TICKET one):
 *   - the order IS a deli ticket. A narrow tape of paper on the right, monospace,
 *     torn top and bottom, that prints a new line every time you add something.
 *     No cart panel, no cart icon, no step counter — you watch the ticket grow
 *     the way you watch the guy behind the counter write it.
 *
 * BESPOKE — TODAY'S SPECIAL is real data. Hero.tsx sells "CHICKEN PARM HERO,
 * $11.95, incl. fries · cold drink" on a stamped mustard card. That is the
 * kitchen's own headline offer, so it gets a one-tap row at the top of the
 * ticket flow with the combo spelled out. No other build has a named daily
 * special to lead with.
 *
 * REAL HOURS (Visit.tsx): Mon–Sat 6:00 AM – 6:00 PM, Sunday CLOSED.
 * A 6 AM deli is a before-work deli, so the slot list starts at 6 and Sunday
 * is not offerable.
 *
 * NOTE FOR THE BUILD OWNER: Nav.tsx and Visit.tsx both ship `href="tel:"` with
 * no number, so the site's own call buttons currently do nothing. Not fixed here
 * (out of scope for this component) but it needs the real number.
 *
 * All prices read from Menu.tsx. Static export: nothing is charged.
 */

import { useEffect, useMemo, useState } from "react";



/**
 * US phone formatting + validation, shared behaviour across every build.
 * Progressively formats to (xxx) xxx-xxxx as the customer types, hard-caps at
 * 10 digits so nothing longer can be entered, and exposes a completeness check
 * the submit gate uses. Non-digits are dropped rather than rejected, so paste
 * of "973-555-0123" or "+1 973 555 0123" still lands correctly.
 */
export function formatPhone(input: string): string {
  const d = input.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
export const isPhoneComplete = (v: string) => v.replace(/\D/g, "").length === 10;

type Item = { id: string; n: string; ing: string; p: number; sect: string };

const HEROES: [string, string, string][] = [
  ["Italian Combo", "Ham · salami · provolone · pepperoncini", "10.95"],
  ["Chicken Parm", "Breaded cutlet · marinara · mozz · basil", "11.95"],
  ["Roast Beef + Cheddar", "Sliced thin · horseradish mayo · onion", "12.50"],
  ["Eggplant Parm", "Same as Chicken Parm but eggplant", "10.95"],
  ["The Reuben", "Corned beef · kraut · swiss · rye · russian", "12.95"],
  ["Turkey Club", "Roast turkey · bacon · lettuce · tomato", "10.95"],
];
const BREAKFAST: [string, string, string][] = [
  ["BEC", "Bacon · egg · cheese on a roll", "5.50"],
  ["SEC", "Sausage · egg · cheese on a roll", "5.50"],
  ["PEC", "Pork roll · egg · cheese on a roll", "5.75"],
  ["Western Omelette", "Ham · peppers · onion · cheese on rye toast", "8.50"],
  ["French Toast Combo", "Stack + bacon or sausage + coffee", "9.95"],
];
const HOT: [string, string, string][] = [
  ["Chicken Cutlet Platter", "Two cutlets · two sides · roll", "13.95"],
  ["Meatball Hero", "House meatballs · marinara · provolone", "10.50"],
  ["Soup of the Day", "Ask at the counter", "5.50"],
  ["Mac + Cheese (qt)", "Three-cheese, baked on top", "8.95"],
];

/** the kitchen's own headline offer, from Hero.tsx */
const SPECIAL = { n: "Chicken Parm Hero", ing: "Today's special · incl. fries + cold drink", p: 11.95 };

const SECTIONS: [string, [string, string, string][]][] = [
  ["Breakfast", BREAKFAST], ["Heroes", HEROES], ["Hot Off the Griddle", HOT],
];
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const ITEMS: Item[] = SECTIONS.flatMap(([sect, rows]) =>
  rows.map(([n, ing, p]) => ({ id: slug(sect + "-" + n), n, ing, p: parseFloat(p), sect }))
);
const SPECIAL_ITEM: Item = { id: "special", n: SPECIAL.n, ing: SPECIAL.ing, p: SPECIAL.p, sect: "Special" };

const NJ_TAX = 0.06625;
const money = (n: number) => `$${n.toFixed(2)}`;

/* real hours: Mon–Sat 6:00–18:00, Sunday closed */
const OPEN_HOUR = 6, CLOSE_HOUR = 18;
const closedOn = (d: Date) => d.getDay() === 0;

function days(n = 7) {
  const out: { key: string; label: string; closed: boolean }[] = [];
  const d = new Date();
  for (let i = 0; i <= n; i++) {
    const x = new Date(d); x.setDate(d.getDate() + i);
    out.push({
      key: x.toISOString().slice(0, 10),
      label: i === 0 ? "Today" : x.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
      closed: closedOn(x),
    });
  }
  return out;
}
function slotsFor(key: string) {
  const out: string[] = [];
  const now = new Date();
  const today = key === now.toISOString().slice(0, 10);
  if (closedOn(new Date(key + "T12:00:00"))) return out;
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (const m of [0, 15, 30, 45]) {
      if (today && (h < now.getHours() || (h === now.getHours() && m <= now.getMinutes() + 10))) continue;
      const t = new Date(); t.setHours(h, m, 0, 0);
      out.push(t.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    }
  }
  return out;
}

export default function CounterTicket() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<{ item: Item; qty: number }[]>([]);
  const [stage, setStage] = useState<"order" | "when" | "done">("order");
  const [dayKey, setDayKey] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  /**
   * Ticket number is generated CLIENT-SIDE ONLY, after mount.
   * Math.random() in a useState initializer runs on the server during SSR *and*
   * again on the client, so the two disagree and React throws a hydration
   * mismatch ("server rendered 28, client rendered 32"). Starting empty and
   * filling it in an effect means the server and the first client render agree.
   */
  const [ticketNo, setTicketNo] = useState("");
  useEffect(() => {
    setTicketNo(String(Math.floor(Math.random() * 89) + 11));
  }, []);

  const D = useMemo(() => days(7), []);
  const S = useMemo(() => (dayKey ? slotsFor(dayKey) : []), [dayKey]);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener("chubbies:order", on as EventListener);
    return () => window.removeEventListener("chubbies:order", on as EventListener);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const subtotal = lines.reduce((n, l) => n + l.item.p * l.qty, 0);
  const tax = subtotal * NJ_TAX;
  const total = subtotal + tax;
  const count = lines.reduce((n, l) => n + l.qty, 0);

  function bump(item: Item, d: number) {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.item.id === item.id);
      if (i < 0) return d > 0 ? [...prev, { item, qty: 1 }] : prev;
      const q = prev[i].qty + d;
      if (q <= 0) return prev.filter((_, k) => k !== i);
      const nx = [...prev]; nx[i] = { ...nx[i], qty: q }; return nx;
    });
  }
  const qtyOf = (id: string) => lines.find((l) => l.item.id === id)?.qty ?? 0;
  function reset() { setLines([]); setStage("order"); setDayKey(""); setSlot(""); setName(""); setPhone(""); }

  const torn = {
    background:
      "repeating-linear-gradient(90deg, var(--color-tile) 0 6px, transparent 6px 12px)",
    height: 8, flexShrink: 0,
  } as const;

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Order at the counter"
        style={{
          position: "fixed", zIndex: 330, bottom: 20, right: 20, display: "flex", alignItems: "center", gap: 10,
          padding: "15px 24px", background: "var(--color-mustard)", color: "var(--color-charcoal)",
          border: "3px solid var(--color-charcoal)", fontFamily: "var(--font-display)",
          fontSize: 16, textTransform: "uppercase", letterSpacing: "0.02em",
          boxShadow: "5px 5px 0 var(--color-charcoal)",
          opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto", transition: "opacity .25s ease",
        }}>
        Order ahead
        {count > 0 && (
          <span style={{ display: "grid", placeItems: "center", minWidth: 24, height: 24, padding: "0 5px",
            background: "var(--color-tomato)", color: "var(--color-tile)", fontSize: 13 }}>{count}</span>
        )}
      </button>

      <div onClick={() => setOpen(false)} aria-hidden={!open}
        style={{ position: "fixed", inset: 0, zIndex: 340, background: "rgba(34,28,19,0.74)",
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s ease" }} />

      <div role="dialog" aria-modal="true" aria-label="Order at the counter"
        style={{ position: "fixed", inset: 0, zIndex: 350, display: "grid", placeItems: "center", padding: 14,
          pointerEvents: open ? "auto" : "none", opacity: open ? 1 : 0, transition: "opacity .3s ease" }}>
        <div className="ct-wrap" style={{
          width: "100%", maxWidth: 880, maxHeight: "90vh", display: "flex", gap: 0,
          transform: open ? "translateY(0)" : "translateY(12px)",
          transition: "transform .4s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {/* ── the board ─────────────────────────────── */}
          <div style={{
            flex: "1 1 60%", minWidth: 0, overflowY: "auto",
            background: "var(--color-tile)", border: "4px solid var(--color-charcoal)",
            borderRight: "none", padding: "22px clamp(16px,3vw,26px)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
              <div>
                <p style={{ fontFamily: "var(--font-chalk)", fontSize: 26, color: "var(--color-tomato)", lineHeight: 1 }}>
                  what&apos;ll it be?
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2.1rem)", textTransform: "uppercase", color: "var(--color-charcoal)", marginTop: 4, lineHeight: 0.95 }}>
                  Chubbie&apos;s Deli
                </h2>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"
                style={{ width: 34, height: 34, display: "grid", placeItems: "center", border: "3px solid var(--color-charcoal)", background: "var(--color-tile)", color: "var(--color-charcoal)", flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* today's special — the kitchen's own headline */}
            <div style={{ marginTop: 18, background: "var(--color-mustard)", border: "3px solid var(--color-charcoal)", padding: "14px 16px" }}>
              <p style={{ fontFamily: "var(--font-chalk)", fontSize: 20, color: "var(--color-charcoal)", lineHeight: 1 }}>today&apos;s special</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, marginTop: 5 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 20, textTransform: "uppercase", color: "var(--color-charcoal)", lineHeight: 1.05 }}>{SPECIAL.n}</p>
                  <p style={{ fontFamily: "var(--font-chalk)", fontSize: 17, color: "var(--color-tomato)", marginTop: 2 }}>incl. fries + cold drink</p>
                </div>
                <button onClick={() => bump(SPECIAL_ITEM, 1)} aria-label="Add today's special"
                  style={{ flexShrink: 0, padding: "9px 15px", background: "var(--color-charcoal)", color: "var(--color-tile)", fontFamily: "var(--font-display)", fontSize: 14, textTransform: "uppercase" }}>
                  Add {money(SPECIAL.p)}
                </button>
              </div>
            </div>

            {SECTIONS.map(([sect]) => (
              <section key={sect} style={{ marginTop: 22 }}>
                <p style={{ fontFamily: "var(--font-chalk)", fontSize: 21, color: "var(--color-olive)", lineHeight: 1 }}>{sect}</p>
                <ul style={{ marginTop: 8 }}>
                  {ITEMS.filter((i) => i.sect === sect).map((i) => {
                    const q = qtyOf(i.id);
                    return (
                      <li key={i.id} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "9px 0", borderBottom: "1px dashed var(--color-rule)" }}>
                        <span style={{ minWidth: 0, flexGrow: 1 }}>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 16, textTransform: "uppercase", color: "var(--color-charcoal)" }}>{i.n}</span>
                          <span style={{ display: "block", fontSize: 12, color: "var(--color-graphite)", marginTop: 1 }}>{i.ing}</span>
                        </span>
                        <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, color: "var(--color-charcoal)" }}>{money(i.p)}</span>
                          {q === 0 ? (
                            <button onClick={() => bump(i, 1)} aria-label={`Add ${i.n}`}
                              style={{ width: 28, height: 28, background: "var(--color-charcoal)", color: "var(--color-tile)", fontSize: 17, lineHeight: 1 }}>+</button>
                          ) : (
                            <>
                              <button onClick={() => bump(i, -1)} aria-label={`One fewer ${i.n}`}
                                style={{ width: 26, height: 26, border: "2px solid var(--color-charcoal)", color: "var(--color-charcoal)" }}>−</button>
                              <span style={{ width: 15, textAlign: "center", fontFamily: "var(--font-display)" }}>{q}</span>
                              <button onClick={() => bump(i, 1)} aria-label={`One more ${i.n}`}
                                style={{ width: 26, height: 26, background: "var(--color-charcoal)", color: "var(--color-tile)" }}>+</button>
                            </>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          {/* ── the ticket tape ──────────────────────── */}
          <aside className="ct-tape" style={{
            flex: "0 0 40%", minWidth: 0, display: "flex", flexDirection: "column",
            background: "#fffdf6", borderTop: "4px solid var(--color-charcoal)",
            borderBottom: "4px solid var(--color-charcoal)", borderRight: "4px solid var(--color-charcoal)",
          }}>
            <div style={torn} aria-hidden />
            <div style={{ padding: "14px 18px 10px", borderBottom: "2px dashed var(--color-rule)", textAlign: "center" }}>
              <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.2em", color: "var(--color-graphite)" }}>
                CHUBBIE&apos;S DELI
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--color-charcoal)", lineHeight: 1, marginTop: 3 }}>
                No. {ticketNo || "—"}
              </p>
            </div>

            <div style={{ flexGrow: 1, overflowY: "auto", padding: "12px 18px", fontFamily: "ui-monospace, monospace", fontSize: 12.5, color: "var(--color-charcoal)" }}>
              {lines.length === 0 && (
                <p style={{ color: "var(--color-graphite)", lineHeight: 1.7 }}>
                  Nothing on the ticket yet.<br />Add something from the board.
                </p>
              )}
              {lines.map((l) => (
                <div key={l.item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 7 }}>
                  <span style={{ minWidth: 0 }}>{l.qty} {l.item.n.toUpperCase()}</span>
                  <span style={{ flexShrink: 0 }}>{money(l.item.p * l.qty)}</span>
                </div>
              ))}

              {lines.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "2px dashed var(--color-rule)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>SUBTOTAL</span><span>{money(subtotal)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-graphite)" }}><span>NJ TAX</span><span>{money(tax)}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "var(--font-display)", fontSize: 18 }}>
                    <span>TOTAL</span><span>{money(total)}</span>
                  </div>
                </div>
              )}

              {stage === "when" && (
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: "2px dashed var(--color-rule)" }}>
                  <p style={{ fontFamily: "var(--font-chalk)", fontSize: 18, color: "var(--color-olive)" }}>pickup</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {D.map((d) => (
                      <button key={d.key} disabled={d.closed}
                        onClick={() => { if (!d.closed) { setDayKey(d.key); setSlot(""); } }}
                        style={{
                          padding: "6px 9px", fontSize: 11, fontFamily: "ui-monospace, monospace",
                          border: `2px solid ${dayKey === d.key ? "var(--color-tomato)" : "var(--color-rule)"}`,
                          background: dayKey === d.key ? "var(--color-tomato)" : "transparent",
                          color: dayKey === d.key ? "var(--color-tile)" : d.closed ? "var(--color-rule)" : "var(--color-charcoal)",
                          cursor: d.closed ? "not-allowed" : "pointer",
                        }}>{d.label}{d.closed ? " ✕" : ""}</button>
                    ))}
                  </div>
                  {dayKey && (
                    S.length === 0
                      ? <p style={{ marginTop: 9, fontSize: 11.5, color: "var(--color-graphite)" }}>Counter&apos;s closed for the day.</p>
                      : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(62px,1fr))", gap: 4, marginTop: 9, maxHeight: 168, overflowY: "auto" }}>
                          {S.map((s) => (
                            <button key={s} onClick={() => setSlot(s)}
                              style={{ padding: "5px 0", fontSize: 10.5, fontFamily: "ui-monospace, monospace",
                                border: `2px solid ${slot === s ? "var(--color-tomato)" : "var(--color-rule)"}`,
                                background: slot === s ? "var(--color-tomato)" : "transparent",
                                color: slot === s ? "var(--color-tile)" : "var(--color-charcoal)" }}>{s}</button>
                          ))}
                        </div>
                  )}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="NAME" aria-label="Name"
                      style={{ background: "transparent", border: "2px solid var(--color-rule)", padding: "8px 10px", fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--color-charcoal)" }} />
                    <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} inputMode="tel" maxLength={14} placeholder="PHONE" aria-label="Phone"
                      style={{ background: "transparent", border: "2px solid var(--color-rule)", padding: "8px 10px", fontFamily: "ui-monospace, monospace", fontSize: 12, color: "var(--color-charcoal)" }} />
                  </div>
                </div>
              )}

              {stage === "done" && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: "2px dashed var(--color-rule)", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-chalk)", fontSize: 22, color: "var(--color-tomato)" }}>order in!</p>
                  <p style={{ marginTop: 6, fontSize: 12, lineHeight: 1.65 }}>
                    {name.split(" ")[0].toUpperCase()} — ready {slot} on{" "}
                    {new Date(dayKey + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}.
                  </p>
                  <p style={{ marginTop: 10, fontSize: 10.5, color: "var(--color-graphite)" }}>Demo — nothing was charged.</p>
                  <button onClick={reset} style={{ marginTop: 10, fontSize: 11.5, textDecoration: "underline", color: "var(--color-olive)" }}>
                    New ticket
                  </button>
                </div>
              )}
            </div>

            {stage !== "done" && (
              <div style={{ padding: 14, borderTop: "2px dashed var(--color-rule)" }}>
                <button
                  disabled={stage === "order" ? count === 0 : !dayKey || !slot || !name.trim() || !isPhoneComplete(phone)}
                  onClick={() => setStage(stage === "order" ? "when" : "done")}
                  style={{
                    width: "100%", padding: "12px", background: "var(--color-tomato)", color: "var(--color-tile)",
                    fontFamily: "var(--font-display)", fontSize: 15, textTransform: "uppercase",
                    opacity: (stage === "order" ? count === 0 : !dayKey || !slot || !name.trim() || !isPhoneComplete(phone)) ? 0.33 : 1,
                  }}>
                  {stage === "order" ? (count === 0 ? "Add something" : "Pickup →") : "Send it"}
                </button>
              </div>
            )}
            <div style={torn} aria-hidden />
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .ct-wrap { flex-direction: column !important; }
          .ct-tape { flex: 1 1 auto !important; border-left: 4px solid var(--color-charcoal) !important; border-top: none !important; }
        }
      `}</style>
    </>
  );
}
