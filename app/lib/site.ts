import { formatPhone, telHref, smsHref } from "./phone";

/**
 * PHONE DOCTRINE — one digits-only constant, everything else derived.
 * Display is always "(973) 672-9620"; every tel:/sms: href is E.164.
 * Number is Chubbies Deli's real listed line — do not alter.
 */
const PHONE = "9736729620";

/** A deli text should start the order, not just say hello. */
export const smsBody = "Hi Chubbies! I'd like to order for pickup: ";

export const site = {
  name: "Chubbies Deli",
  phoneDigits: PHONE,
  phone: formatPhone(PHONE),
  phoneHref: telHref(PHONE),
  smsHref: smsHref(PHONE, smsBody),
  smsBody,
};
