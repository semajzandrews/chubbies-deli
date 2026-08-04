/**
 * PHONE DOCTRINE — one canonical shape for every phone number on every build.
 *
 * Display is ALWAYS `(602) 461-1248`. Never `602-461-1248`, never `6024611248`,
 * never a bare `+1`. The link is ALWAYS built from E.164 digits, never from the
 * formatted string, because a `tel:` href containing spaces and parentheses is
 * a coin flip on older Android dialers.
 *
 * The same formatter drives the display, the href, and the as-you-type mask on
 * the contact form, so what a visitor reads is exactly what they type back.
 */

/** strip everything that is not a digit */
export function digitsOf(input: string): string {
  return input.replace(/\D+/g, "");
}

/**
 * Reduce any US input to its 10 significant digits.
 * Accepts `16024611248`, `+1 (602) 461-1248`, `602.461.1248`, etc.
 */
export function nationalDigits(input: string): string {
  const d = digitsOf(input);
  if (d.length === 11 && d.startsWith("1")) return d.slice(1);
  return d.slice(0, 10);
}

/** The one display format: `(602) 461-1248`. */
export function formatPhone(input: string): string {
  const d = nationalDigits(input);
  if (d.length !== 10) return input;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Progressive mask for a live <input>. Formats only as far as the digits go, so
 * the caret never fights the user mid-entry.
 *   ""        -> ""
 *   "602"     -> "(602)"
 *   "6024"    -> "(602) 4"
 *   "6024611" -> "(602) 461-1"
 */
export function formatAsYouType(input: string): string {
  const d = nationalDigits(input);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length === 4) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

/** E.164, the only form that belongs inside a tel: or sms: href. */
export function e164(input: string, country = "1"): string {
  return `+${country}${nationalDigits(input)}`;
}

export function telHref(input: string): string {
  return `tel:${e164(input)}`;
}

/**
 * `sms:` with a prefilled body.
 *
 * The separator is the gotcha: iOS historically wanted `&body=` after a recipient
 * while Android wanted `?body=`. `?&body=` is the belt-and-braces form that both
 * parse, and is what we emit. Keep bodies short; some carriers truncate.
 */
export function smsHref(input: string, body?: string): string {
  const base = `sms:${e164(input)}`;
  return body ? `${base}?&body=${encodeURIComponent(body)}` : base;
}

/** true once the input holds a complete US number */
export function isCompletePhone(input: string): boolean {
  return nationalDigits(input).length === 10;
}
