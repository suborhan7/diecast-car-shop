// Reads a pasted blob like "Rahim, 01712345678, House 12, Road 5, Mirpur, Dhaka"
// (English, Bangla or both) and pulls out name, phone, address and delivery area.
// Plain rules, no AI: the customer checks the boxes before placing the order.

export type ParsedDetails = { name?: string; phone?: string; address?: string; area?: "inside" | "outside" };

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toAsciiDigits = (s: string) => s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

const PHONE_RE = /(?:\+?\s*8\s*8[\s-]*)?0\s*1[3-9](?:[\s-]*\d){8}/;

const NAME_LABEL = /^(?:full\s*name|name|nam|নাম)\s*[:：=\-–]\s*/i;
const PHONE_LABEL = /^(?:phone|mobile|mob|cell|number|contact|whatsapp|ফোন|মোবাইল|নাম্বার|নম্বর)(?:\s*(?:no\.?|number))?\s*[:：=\-–]?\s*/i;
const ADDRESS_LABEL = /^(?:full\s*address|address|addr|thikana|ঠিকানা)\s*[:：=\-–]\s*/i;

const ADDRESS_WORDS = [
  "house", "road", "rd", "flat", "block", "sector", "lane", "avenue", "holding", "village", "vill", "post", "p.o",
  "thana", "upazila", "zilla", "district", "apartment", "apt", "floor", "bazar", "para", "more", "tower", "building",
  "বাসা", "বাড়ি", "রোড", "সড়ক", "ফ্ল্যাট", "ব্লক", "সেক্টর", "লেন", "গ্রাম", "পোস্ট", "থানা", "উপজেলা", "জেলা", "তলা",
  "বাজার", "পাড়া", "মোড়",
];

const DHAKA_AREAS = [
  "dhaka", "mirpur", "pallabi", "kafrul", "uttara", "dhanmondi", "gulshan", "banani", "baridhara", "bashundhara",
  "mohammadpur", "motijheel", "paltan", "ramna", "shahbagh", "tejgaon", "farmgate", "karwan bazar", "kawran bazar",
  "mohakhali", "badda", "rampura", "banasree", "banashree", "khilgaon", "malibagh", "mogbazar", "moghbazar",
  "shantinagar", "jatrabari", "demra", "sayedabad", "wari", "lalbagh", "chawkbazar", "kamrangirchar", "hazaribagh",
  "jigatola", "lalmatia", "shyamoli", "kallyanpur", "kalyanpur", "gabtoli", "agargaon", "khilkhet", "nikunja",
  "cantonment", "dakshinkhan", "uttarkhan", "mugda", "basabo", "kakrail", "azimpur", "nilkhet", "kalabagan",
  "green road", "panthapath", "hatirpool", "eskaton", "niketon", "aftabnagar", "mohanagar",
  "ঢাকা", "মিরপুর", "পল্লবী", "কাফরুল", "উত্তরা", "ধানমন্ডি", "গুলশান", "বনানী", "বারিধারা", "বসুন্ধরা", "মোহাম্মদপুর",
  "মতিঝিল", "পল্টন", "রমনা", "শাহবাগ", "তেজগাঁও", "ফার্মগেট", "কারওয়ান বাজার", "মহাখালী", "বাড্ডা", "রামপুরা", "বনশ্রী",
  "খিলগাঁও", "মালিবাগ", "মগবাজার", "শান্তিনগর", "যাত্রাবাড়ী", "ডেমরা", "সায়েদাবাদ", "ওয়ারী", "লালবাগ", "চকবাজার",
  "কামরাঙ্গীরচর", "হাজারীবাগ", "জিগাতলা", "লালমাটিয়া", "শ্যামলী", "কল্যাণপুর", "গাবতলী", "আগারগাঁও", "খিলক্ষেত",
  "নিকুঞ্জ", "ক্যান্টনমেন্ট", "দক্ষিণখান", "উত্তরখান", "মুগদা", "বাসাবো", "কাকরাইল", "আজিমপুর", "নীলক্ষেত", "কলাবাগান",
  "পান্থপথ", "হাতিরপুল", "আফতাবনগর",
];

// Every district except Dhaka, in English (with common spellings) and Bangla.
const OTHER_DISTRICTS = [
  "bagerhat", "bandarban", "barguna", "barishal", "barisal", "bhola", "bogura", "bogra", "brahmanbaria", "chandpur",
  "chapai nawabganj", "chapainawabganj", "chattogram", "chittagong", "ctg", "chuadanga", "cox's bazar", "coxs bazar",
  "cox bazar", "cumilla", "comilla", "dinajpur", "faridpur", "feni", "gaibandha", "gazipur", "tongi", "gopalganj",
  "habiganj", "jamalpur", "jashore", "jessore", "jhalokati", "jhalakathi", "jhenaidah", "joypurhat", "khagrachhari",
  "khagrachari", "khulna", "kishoreganj", "kurigram", "kushtia", "lakshmipur", "laxmipur", "lalmonirhat", "madaripur",
  "magura", "manikganj", "meherpur", "moulvibazar", "maulvibazar", "munshiganj", "mymensingh", "naogaon", "narail",
  "narayanganj", "narsingdi", "natore", "netrokona", "nilphamari", "noakhali", "pabna", "panchagarh", "patuakhali",
  "pirojpur", "rajbari", "rajshahi", "rangamati", "rangpur", "satkhira", "shariatpur", "sherpur", "sirajganj",
  "sunamganj", "sylhet", "tangail", "thakurgaon", "savar", "keraniganj",
  "বাগেরহাট", "বান্দরবান", "বরগুনা", "বরিশাল", "ভোলা", "বগুড়া", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "চাঁপাইনবাবগঞ্জ", "চট্টগ্রাম",
  "চুয়াডাঙ্গা", "কক্সবাজার", "কুমিল্লা", "দিনাজপুর", "ফরিদপুর", "ফেনী", "গাইবান্ধা", "গাজীপুর", "টঙ্গী", "গোপালগঞ্জ",
  "হবিগঞ্জ", "জামালপুর", "যশোর", "ঝালকাঠি", "ঝিনাইদহ", "জয়পুরহাট", "খাগড়াছড়ি", "খুলনা", "কিশোরগঞ্জ", "কুড়িগ্রাম",
  "কুষ্টিয়া", "লক্ষ্মীপুর", "লালমনিরহাট", "মাদারীপুর", "মাগুরা", "মানিকগঞ্জ", "মেহেরপুর", "মৌলভীবাজার", "মুন্সিগঞ্জ",
  "ময়মনসিংহ", "নওগাঁ", "নড়াইল", "নারায়ণগঞ্জ", "নরসিংদী", "নাটোর", "নেত্রকোনা", "নীলফামারী", "নোয়াখালী", "পাবনা",
  "পঞ্চগড়", "পটুয়াখালী", "পিরোজপুর", "রাজবাড়ী", "রাজশাহী", "রাঙ্গামাটি", "রংপুর", "সাতক্ষীরা", "শরীয়তপুর", "শেরপুর",
  "সিরাজগঞ্জ", "সুনামগঞ্জ", "সিলেট", "টাঙ্গাইল", "ঠাকুরগাঁও", "সাভার", "কেরানীগঞ্জ",
];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Latin words need word edges ("feni" must not match inside "fenix"); Bangla is matched as a plain substring.
const hasTerm = (text: string, term: string) =>
  /[a-z]/.test(term) ? new RegExp(`(^|[^a-z])${escape(term)}($|[^a-z])`, "i").test(text) : text.includes(term);

export function areaFor(address: string): "inside" | "outside" | undefined {
  const t = address.toLowerCase();
  if (OTHER_DISTRICTS.some((d) => hasTerm(t, d))) return "outside";
  if (DHAKA_AREAS.some((d) => hasTerm(t, d))) return "inside";
  return undefined;
}

const looksLikeName = (s: string) =>
  s.length >= 2 &&
  s.length <= 40 &&
  !/\d/.test(s) &&
  s.split(/\s+/).length <= 4 &&
  !ADDRESS_WORDS.some((w) => hasTerm(s.toLowerCase(), w)) &&
  !areaFor(s);

const tidy = (s: string) => s.replace(/\s+/g, " ").replace(/^[\s,;:.\-–|]+|[\s,;:\-–|]+$/g, "").trim();

export function parseDetails(raw: string): ParsedDetails {
  const text = toAsciiDigits(raw);
  const out: ParsedDetails = {};

  // Phone: first Bangladeshi mobile number anywhere in the text. Split around it so
  // "rahim 01712345678 mirpur dhaka" still separates the name from the address.
  // Bangla digits are one character each, so indices in `text` line up with `raw`
  // and the address keeps whatever digits the customer typed.
  let rest = raw;
  const m = text.match(PHONE_RE);
  if (m && m.index !== undefined) {
    out.phone = m[0].replace(/\D/g, "").slice(-11);
    rest = `${raw.slice(0, m.index)}\n${raw.slice(m.index + m[0].length)}`;
  }

  const pieces = rest
    .split(/[\n,;|।]+/)
    .map(tidy)
    .filter(Boolean);

  const addressParts: string[] = [];
  let mode: "free" | "address" = "free";
  for (const p of pieces) {
    if (NAME_LABEL.test(p)) {
      const v = tidy(p.replace(NAME_LABEL, ""));
      if (v) out.name = v;
      mode = "free";
    } else if (ADDRESS_LABEL.test(p)) {
      const v = tidy(p.replace(ADDRESS_LABEL, ""));
      if (v) addressParts.push(v);
      mode = "address";
    } else if (PHONE_LABEL.test(p) && !tidy(p.replace(PHONE_LABEL, ""))) {
      // A bare "Phone:" left behind after the number was taken out.
    } else if (mode === "free" && !out.name && looksLikeName(p)) {
      out.name = p;
    } else {
      addressParts.push(p);
    }
  }

  // "rahim uddin" -> "Rahim Uddin"; names typed with capitals or in Bangla are left alone.
  if (out.name && out.name === out.name.toLowerCase()) out.name = out.name.replace(/(^|\s)([a-z])/g, (_, a, b) => a + b.toUpperCase());
  if (addressParts.length) out.address = addressParts.join(", ");
  if (out.address) out.area = areaFor(out.address);
  return out;
}
