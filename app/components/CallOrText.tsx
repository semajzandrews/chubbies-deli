"use client";

import { useEffect, useRef, useState } from "react";
import { telHref, smsHref } from "@/app/lib/phone";
import { site } from "@/app/lib/site";

/**
 * Call OR Text — Chubbies edition.
 *
 * Half the lunch crowd is at a desk and will not dial. So the call button is a
 * chooser: tap it and the panel drops like a torn order ticket, hard square,
 * 4px charcoal rule, mustard over tomato, chalk sub-lines. Nothing rounded and
 * nothing borrowed from another build.
 *
 * tel:/sms: are always E.164 out of app/lib/phone; the visible number is always
 * "(973) 672-9620".
 */

type Tone = "mustard" | "outline" | "charcoal";

const TONE: Record<Tone, string> = {
  mustard: "bg-mustard text-charcoal hover:bg-tomato hover:text-tile",
  outline: "border-2 border-charcoal text-charcoal hover:bg-mustard",
  charcoal: "bg-charcoal text-tile hover:bg-tomato",
};

function ReceiptPhone({ className = "" }: { className?: string }) {
  // hand-drawn wall-phone glyph, drawn for this build only
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" className={className} aria-hidden="true">
      <path
        d="M4 3h4l1.6 4-2 1.4a10 10 0 0 0 4 4L13 10.4 17 12v4c0 .6-.5 1-1.1 1C8.7 16.6 3.4 11.3 3 4.1 3 3.5 3.4 3 4 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ReceiptText({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" className={className} aria-hidden="true">
      <path
        d="M3 4h14v9H8l-4 3.5V13H3V4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M6.5 7.5h7M6.5 10h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function CallOrText({
  tone = "mustard",
  label = "Call & order",
  size = "sm",
  className = "",
}: {
  tone?: Tone;
  label?: string;
  size?: "sm" | "lg";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const pad = size === "lg" ? "px-6 py-4 md:px-10 md:py-5 text-lg md:text-xl" : "px-4 py-2.5 md:px-5 text-sm";

  return (
    /* class is `cot`, never `wrap` — a global .wrap container throws the panel off-screen */
    <div className={`cot relative inline-block text-left ${className}`} ref={root}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-2 font-display uppercase transition-colors ${TONE[tone]} ${pad}`}
      >
        <ReceiptPhone />
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">{open ? "Close" : "Order"}</span>
      </button>

      <div
        role="menu"
        data-open={open}
        className="absolute right-0 top-[calc(100%+10px)] z-[70] w-[min(19rem,calc(100vw-2.5rem))] border-4 border-charcoal bg-tile stamp-ink transition-all duration-200 data-[open=false]:pointer-events-none data-[open=false]:-translate-y-1 data-[open=false]:opacity-0"
      >
        <div className="border-b-2 border-dashed border-rule-2 px-4 py-2 text-center font-chalk text-2xl text-tomato">
          — how do you want us? —
        </div>

        <a
          href={telHref(site.phoneDigits)}
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 bg-mustard px-4 py-3 text-charcoal transition-colors hover:bg-tomato hover:text-tile"
        >
          <ReceiptPhone />
          <span className="flex-1">
            <span className="block font-display text-lg uppercase leading-none">Call {site.phone}</span>
            <span className="block font-chalk text-xl leading-tight opacity-80">straight to the counter</span>
          </span>
        </a>

        <a
          href={smsHref(site.phoneDigits, site.smsBody)}
          role="menuitem"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 border-t-4 border-charcoal bg-tile px-4 py-3 text-charcoal transition-colors hover:bg-olive hover:text-tile"
        >
          <ReceiptText />
          <span className="flex-1">
            <span className="block font-display text-lg uppercase leading-none">Text your order</span>
            <span className="block font-chalk text-xl leading-tight opacity-80">we&apos;ll have it wrapped</span>
          </span>
        </a>
      </div>
    </div>
  );
}

/** Contact-block variant: both actions side by side, no tap to reveal. */
export function CallOrTextPair({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-3 ${className}`}>
      <a
        href={site.phoneHref}
        className="inline-flex items-center gap-3 bg-charcoal px-8 py-5 font-display text-lg uppercase text-tile transition-colors hover:bg-tomato md:text-xl"
      >
        <ReceiptPhone /> Call {site.phone}
      </a>
      <a
        href={site.smsHref}
        className="inline-flex items-center gap-3 border-4 border-charcoal bg-mustard px-8 py-5 font-display text-lg uppercase text-charcoal transition-colors hover:bg-olive hover:text-tile md:text-xl"
      >
        <ReceiptText /> Text your order
      </a>
    </div>
  );
}
