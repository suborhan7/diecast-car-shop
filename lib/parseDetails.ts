// Reads a pasted blob like "Rahim, 01712345678, House 12, Road 5, Mirpur, Dhaka"
// (English, Bangla, Banglish or a mix) and pulls out name, phone, address, delivery area and
// a note. Plain rules, no AI: the customer checks the boxes before placing the order.

import { DHAKA_CITY, OUTSIDE_DHAKA } from "./bdPlaces";

export type ParsedDetails = {
  name?: string;
  phone?: string;
  address?: string;
  area?: "inside" | "outside";
  note?: string;
};

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toAsciiDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

// 01XXXXXXXXX with optional +88 / 88 and any spaces or dashes; the lookarounds stop it
// matching inside a longer number such as an order ID.
const PHONE_RE = /(?<!\d)(?:\+?\s*8\s*8[\s-]*)?0\s*1[3-9](?:[\s-]*\d){8}(?![\s-]*\d)/g;
// Same number typed without the leading 0 ("1712345678").
const PHONE_NO_ZERO_RE = /(?<!\d)1[3-9]\d{8}(?!\d)/g;
const EMAIL_RE = /\S+@\S+\.\S+/g;
// A full stop after a word ends a sentence ("ami Nabila. number ...") unless the word is a
// short form people put in names and addresses ("Md. Karim", "Rd. 5").
const SENTENCE_END_RE = /(\p{L}+)\.(?=\s)/gu;
const ABBREVIATIONS = new Set(
  "md mst mrs mr ms dr sk sm mohd engr prof capt col lt maj h hno r rd st ave apt no sec blk bldg p o po ps vill vil dist nr opp govt ltd co".split(" "),
);

const SEP = "\\s*(?:[:：=\\-–—>]+|\\bis\\b|\\bholo\\b|হলো|হচ্ছে)?\\s*";
// The lookahead stops "nam" from matching the start of "Namira".
const label = (words: string) => new RegExp(`^(?:${words})(?![a-z\\u0980-\\u09FF])${SEP}`, "i");
const NAME_LABEL = label("full\\s*name|customer\\s*name|receiver(?:'?s)?\\s*name|my\\s*name|name|amar\\s*nam|nam|নাম|আমার\\s*নাম|গ্রাহকের\\s*নাম");
const PHONE_LABEL = label(
  "phone(?:\\s*(?:no\\.?|number))?|mobile(?:\\s*(?:no\\.?|number))?|mob(?:\\s*no\\.?)?|ph(?:\\s*no\\.?)?|phn|cell|contact(?:\\s*(?:no\\.?|number))?|number|num|whatsapp|bkash|nagad|amar\\s*number|ফোন(?:\\s*নম্বর)?|মোবাইল(?:\\s*নম্বর|\\s*নাম্বার)?|নাম্বার|নম্বর|যোগাযোগ",
);
const ADDRESS_LABEL = label(
  "full\\s*address|delivery\\s*address|shipping\\s*address|present\\s*address|address|addr|location|thikana|amar\\s*address|ঠিকানা|পূর্ণ\\s*ঠিকানা|ডেলিভারি\\s*ঠিকানা",
);
const PLACE_LABEL = label("area|thana|upazila|district|zila|zilla|city|থানা|উপজেলা|জেলা|এলাকা");
const NOTE_LABEL = label("note|notes|comment|instruction|special\\s*instruction|নোট|মন্তব্য");

// Words that only ever appear in an address, never in a person's name.
const ADDRESS_WORDS = [
  "house", "h", "road", "rd", "flat", "block", "blk", "sector", "sec", "lane", "avenue", "ave", "holding", "village",
  "vill", "vil", "post", "p.o", "po", "thana", "upazila", "zilla", "zila", "district", "apartment", "apt", "floor",
  "bazar", "bazaar", "para", "more", "mor", "tower", "building", "bldg", "plaza", "market", "housing", "colony",
  "sadar", "city", "town", "division", "street", "st", "near", "opposite", "beside", "behind", "level", "lift",
  "gate", "school", "college", "mosque", "masjid", "madrasa", "hospital", "bank", "office", "union", "ward",
  "residential", "area", "no", "tala", "basa", "basha", "barir", "gram", "rasta", "goli", "bazar",
  "বাসা", "বাড়ি", "রোড", "সড়ক", "ফ্ল্যাট", "ব্লক", "সেক্টর", "লেন", "গ্রাম", "পোস্ট", "ডাকঘর", "থানা", "উপজেলা",
  "জেলা", "তলা", "বাজার", "পাড়া", "মোড়", "সদর", "বিভাগ", "মসজিদ", "স্কুল", "কলেজ", "হাসপাতাল", "মার্কেট",
  "টাওয়ার", "ভবন", "সংলগ্ন", "পাশে", "বিপরীতে", "ওয়ার্ড", "ইউনিয়ন", "হাউজিং", "আবাসিক", "নং",
];

// Pieces that carry no details at all ("Hi", "Assalamualaikum", "Thanks").
const CHATTER = new RegExp(
  "^(?:hi|hello|hey|salam|salaam|assalamu?\\s*alaikum|asslamualaikum|as-?salamu\\s*alaikum|thanks?|thank\\s*you|tnx|ok|okay|please|pls|plz|order|i\\s*want\\s*to\\s*order|dhonnobad|e-?mail|email\\s*(?:id|address)?|gmail|ইমেইল|ধন্যবাদ|আসসালামু\\s*আলাইকুম|সালাম|হ্যালো|অর্ডার)[\\s!.]*$",
  "i",
);
// Lead-ins in front of a name ("My name is Rahim", "ami Rahim", "আমি রহিম").
const NAME_LEAD = /^(?:my\s*name\s*is|this\s*is|i\s*am|i'm|ami|amar\s*nam|আমার\s*নাম|আমি)\s+/i;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const termRe = new Map<string, RegExp>();
// Latin words need word edges ("feni" must not match inside "fenix"); Bangla is matched as a plain substring.
const hasTerm = (text: string, term: string) => {
  if (!/[a-z]/.test(term)) return text.includes(term);
  let re = termRe.get(term);
  if (!re) termRe.set(term, (re = new RegExp(`(^|[^a-z])${escape(term)}($|[^a-z])`, "i")));
  return re.test(text);
};
const hasAny = (text: string, terms: string[]) => terms.some((t) => hasTerm(text, t));

// Dhaka city postcodes run 1000-1236; anything from 1300 up is outside the city.
function areaFromPostcode(t: string): "inside" | "outside" | undefined {
  const m = t.match(/(?:dhaka|ঢাকা|post\s*code|postcode|zip|p\.?o\.?)\s*[-–:]?\s*(\d{4})(?!\d)/i) ?? t.match(/[-–]\s*(\d{4})\s*$/);
  if (!m) return undefined;
  const n = Number(m[1]);
  if (n >= 1000 && n <= 1236) return "inside";
  if (n >= 1300 && n <= 9999) return "outside";
  return undefined;
}

export function areaFor(address: string): "inside" | "outside" | undefined {
  const t = toAsciiDigits(address.toLowerCase());
  if (hasAny(t, OUTSIDE_DHAKA)) return "outside";
  const post = areaFromPostcode(t);
  if (post) return post;
  if (hasAny(t, DHAKA_CITY)) return "inside";
  return undefined;
}

// Strip every known place name out of a piece; whatever is left tells us if it is more than a place.
const withoutPlaces = (s: string) => {
  let t = ` ${s.toLowerCase()} `;
  for (const p of [...DHAKA_CITY, ...OUTSIDE_DHAKA]) {
    if (!hasTerm(t, p)) continue;
    t = /[a-z]/.test(p) ? t.replace(new RegExp(`(^|[^a-z])${escape(p)}(?=$|[^a-z])`, "gi"), "$1 ") : t.split(p).join(" ");
  }
  return t.replace(/\s+/g, " ").trim();
};

const isAddressy = (s: string) => /\d/.test(s) || hasAny(s.toLowerCase(), ADDRESS_WORDS);

const looksLikeName = (s: string) => {
  if (s.length < 2 || s.length > 45 || isAddressy(s)) return false;
  const words = s.split(/\s+/);
  if (words.length > 5) return false;
  // "Uttara" alone is a place; "Uttara Rahman" is a person.
  return withoutPlaces(s).replace(/[^\p{L}]/gu, "").length >= 2;
};

const tidy = (s: string) =>
  s
    .replace(/\s+/g, " ")
    .replace(/^[\s,;:.\-–—|*•>#()]+|[\s,;:\-–—|*•>#(]+$/g, "")
    .trim();

const titleCase = (s: string) =>
  s === s.toLowerCase() || s === s.toUpperCase()
    ? s.toLowerCase().replace(/(^|[\s.(-])([a-z])/g, (_, a, b) => a + b.toUpperCase())
    : s;

export function parseDetails(raw: string): ParsedDetails {
  const out: ParsedDetails = {};
  // Bangla digits are one character each, so positions in `text` line up with `raw`
  // and the address keeps whatever digits the customer typed.
  const text = toAsciiDigits(raw);

  // Phones: every mobile number is cut out of the text. The first is the customer's number,
  // any others go in the note. Cutting leaves a line break so "rahim 01712345678 mirpur"
  // still separates the name from the address.
  const phones: string[] = [];
  const cuts: [number, number][] = [];
  for (const re of [PHONE_RE, PHONE_NO_ZERO_RE]) {
    for (const m of text.matchAll(re)) {
      const start = m.index ?? 0;
      if (cuts.some(([a, b]) => start < b && start + m[0].length > a)) continue;
      const digits = m[0].replace(/\D/g, "");
      phones.push(digits.length === 10 ? `0${digits}` : digits.slice(-11));
      cuts.push([start, start + m[0].length]);
    }
  }
  cuts.sort((a, b) => a[0] - b[0]);
  let rest = "";
  let at = 0;
  for (const [a, b] of cuts) (rest += `${raw.slice(at, a)}\n`), (at = b);
  rest += raw.slice(at);
  rest = rest.replace(EMAIL_RE, "\n").replace(SENTENCE_END_RE, (m, w: string) => (ABBREVIATIONS.has(w.toLowerCase()) ? m : `${w}\n`));
  if (phones[0]) out.phone = phones[0];

  const pieces = rest
    .split(/[\n,;|।]+|\s[-–—]\s/)
    .map(tidy)
    .filter((p) => p && !CHATTER.test(p));

  const addressParts: string[] = [];
  const noteParts: string[] = [];
  let mode: "free" | "address" | "note" = "free";

  for (let p of pieces) {
    if (NAME_LABEL.test(p) && !PHONE_LABEL.test(p)) {
      const v = tidy(p.replace(NAME_LABEL, ""));
      if (v && !isAddressy(v)) out.name = v;
      else if (v) addressParts.push(v);
      mode = "free";
      continue;
    }
    if (ADDRESS_LABEL.test(p)) {
      const v = tidy(p.replace(ADDRESS_LABEL, ""));
      if (v) addressParts.push(v);
      mode = "address";
      continue;
    }
    if (NOTE_LABEL.test(p)) {
      const v = tidy(p.replace(NOTE_LABEL, ""));
      if (v) noteParts.push(v);
      mode = "note";
      continue;
    }
    if (PLACE_LABEL.test(p)) {
      const v = tidy(p.replace(PLACE_LABEL, ""));
      if (v) addressParts.push(v);
      continue;
    }
    if (PHONE_LABEL.test(p)) {
      // "Phone:" left behind after the number was cut out. Anything after it is not a phone.
      p = tidy(p.replace(PHONE_LABEL, ""));
      if (!p) continue;
    }
    if (mode === "note") {
      noteParts.push(p);
      continue;
    }
    const lead = p.replace(NAME_LEAD, "");
    if (mode === "free" && !out.name && lead !== p && lead && !isAddressy(lead.split(/\s+/)[0])) {
      // "My name is Rahim Uddin" or "ami Rahim, Mirpur".
      p = lead;
    }
    if (mode === "free" && !out.name && looksLikeName(p)) {
      out.name = p;
      continue;
    }
    addressParts.push(p);
  }

  // No name yet: take the leading words of the first address piece, up to the first number,
  // address word or place ("Rahim Uddin House 12 Road 5 Mirpur" -> "Rahim Uddin").
  if (!out.name && addressParts.length) {
    const words = addressParts[0].split(/\s+/);
    let n = 0;
    while (n < words.length && n < 4 && !isAddressy(words[n]) && withoutPlaces(words[n]).length >= 2) n++;
    if (n > 0 && n < words.length) {
      out.name = words.slice(0, n).join(" ");
      addressParts[0] = words.slice(n).join(" ");
    }
  }

  if (out.name) out.name = titleCase(out.name.replace(NAME_LEAD, ""));
  if (addressParts.length) out.address = addressParts.join(", ");
  if (out.address) out.area = areaFor(out.address);
  if (phones.length > 1) noteParts.push(`Other number: ${phones.slice(1).join(", ")}`);
  if (noteParts.length) out.note = noteParts.join(". ");
  return out;
}
