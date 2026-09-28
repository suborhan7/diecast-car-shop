// Checks the checkout quick fill against real-style pastes.
// Run: npx esbuild scripts/test-quick-fill.mts --bundle --platform=node --outfile=/tmp/qf-test.mjs --format=esm && node /tmp/qf-test.mjs
import { parseDetails, type ParsedDetails } from "../lib/parseDetails";

const cases: [string, ParsedDetails][] = [
  ["Rahim Uddin, 01712345678, House 12, Road 5, Mirpur 10, Dhaka", { name: "Rahim Uddin", phone: "01712345678", address: "House 12, Road 5, Mirpur 10, Dhaka", area: "inside" }],
  ["Name: Sadia Islam\nPhone: +880 1812-345678\nAddress: Flat 4B, Road 11, Banani, Dhaka 1213", { name: "Sadia Islam", phone: "01812345678", address: "Flat 4B, Road 11, Banani, Dhaka 1213", area: "inside" }],
  ["নাম: রহিম উদ্দিন\nমোবাইল: ০১৭১২৩৪৫৬৭৮\nঠিকানা: বাসা ১২, রোড ৫, মিরপুর ১০, ঢাকা", { name: "রহিম উদ্দিন", phone: "01712345678", address: "বাসা ১২, রোড ৫, মিরপুর ১০, ঢাকা", area: "inside" }],
  ["rahim 01712345678 mirpur 10 dhaka", { name: "Rahim", phone: "01712345678", address: "mirpur 10 dhaka", area: "inside" }],
  ["Rahim Uddin House 12 Road 5 Mirpur 01712345678", { name: "Rahim Uddin", phone: "01712345678", address: "House 12 Road 5 Mirpur", area: "inside" }],
  ["Karim\n01912345678\nVill: Rampur, Post: Sadar, Chattogram", { name: "Karim", phone: "01912345678", area: "outside" }],
  ["Tanvir Ahmed\n01612345678\nHouse 3, College Road, Gazipur Sadar, Gazipur", { name: "Tanvir Ahmed", area: "outside" }],
  ["মোঃ কামাল হোসেন, ০১৫১২৩৪৫৬৭৮, সিলেট সদর, সিলেট", { name: "মোঃ কামাল হোসেন", phone: "01512345678", area: "outside" }],
  ["Nusrat, 8801712345678, Sector 7, Uttara", { name: "Nusrat", phone: "01712345678", area: "inside" }],
  ["Assalamualaikum\nMy name is Farhan Hossain\n01711-223344\nSavar, Dhaka", { name: "Farhan Hossain", phone: "01711223344", area: "outside" }],
  ["ami Nabila. number 01822334455. address: Road 2, Dhanmondi", { name: "Nabila", phone: "01822334455", area: "inside" }],
  ["Uttara Rahman, 01733445566, House 5, Road 7, Sector 4, Uttara", { name: "Uttara Rahman", area: "inside" }],
  ["Namira Khan, 01744556677, Mohammadpur, Dhaka", { name: "Namira Khan", area: "inside" }],
  ["Md. Abdul Karim\n1712345678\nKushtia sadar, Kushtia", { name: "Md. Abdul Karim", phone: "01712345678", area: "outside" }],
  ["Sumon 01912345678, 01812345678 Agrabad, CTG", { name: "Sumon", phone: "01912345678", area: "outside", note: "Other number: 01812345678" }],
  ["Name - Tania Akter\nMobile no - 01555667788\nThana - Kotwali\nDistrict - Cumilla", { name: "Tania Akter", phone: "01555667788", area: "outside" }],
  ["Rafiq, 01700000001, Keraniganj, Dhaka", { area: "outside" }],
  ["Joy, 01700000002, H-10, R-3, Block C, Bashundhara R/A", { name: "Joy", area: "inside" }],
  ["SHAKIL AHMED 01700000003 NARAYANGANJ", { name: "Shakil Ahmed", area: "outside" }],
  ["আমার নাম সাকিব, ০১৯০০০০০০০১, যাত্রাবাড়ী, ঢাকা। ধন্যবাদ", { name: "সাকিব", phone: "01900000001", area: "inside" }],
  ["Mim\n01300000004\nDhaka-1340", { name: "Mim", area: "outside" }],
  ["Rashed, 01300000005, Rupnagar R/A, Dhaka 1216", { name: "Rashed", area: "inside" }],
  ["Order #1234567890123\nName: Lipi\nPhone: 01400000006\nAddress: Barishal Sadar\nNote: call before coming", { name: "Lipi", phone: "01400000006", area: "outside", note: "call before coming" }],
  ["hello, amar nam Rakib, 01600000007, 3rd floor, Kazipara, Mirpur", { name: "Rakib", area: "inside" }],
  ["Bhola Mia, 01600000008, Gulshan 2", { name: "Bhola Mia", area: "inside" }],
  ["Sabbir Hossain, 01600000009, Mirpur 12, Pallabi, Dhaka-1216, email: sabbir@gmail.com", { name: "Sabbir Hossain", area: "inside", address: "Mirpur 12, Pallabi, Dhaka-1216" }],
  ["Farhana\n01712345678\nBogura sadar, Bogura", { name: "Farhana", area: "outside" }],
  ["Hasan, 01712345678, Mirpur, Kushtia", { name: "Hasan", area: "outside" }],
  ["Liton, 01712345678, Mohammadpur, Magura", { name: "Liton", area: "outside" }],
  ["House 5 Road 3 Banani, Dhaka. Name Rina. 01712345678", { name: "Rina", phone: "01712345678", area: "inside" }],
  ["Arif\n01712345678\nMirpur-10, Dhaka-1216\nNote: 3rd floor, call first", { name: "Arif", area: "inside", note: "3rd floor. call first" }],
  ["rina akter mirpur 11 dhaka 01712345678", { name: "Rina Akter", phone: "01712345678", area: "inside" }],
  ["Sohel, basa 12, road 4, mirpur 11, 01712345678", { name: "Sohel", area: "inside" }],
  ["নাম- সুমাইয়া। মোবাইল- ০১৭১২৩৪৫৬৭৮। ঠিকানা- রাজশাহী সদর, রাজশাহী।", { name: "সুমাইয়া", phone: "01712345678", area: "outside" }],
  ["Imran 01712345678 Chattogram", { name: "Imran", area: "outside" }],
  ["Dr. Nasrin Sultana\n+8801712345678\nApt 3C, Gulshan Avenue, Gulshan 1", { name: "Dr. Nasrin Sultana", area: "inside" }],
];

let fail = 0;
for (const [input, want] of cases) {
  const got = parseDetails(input);
  const bad = (Object.keys(want) as (keyof ParsedDetails)[]).filter((k) => got[k] !== want[k]);
  if (bad.length) {
    fail++;
    console.log(`FAIL ${JSON.stringify(input)}\n  want ${JSON.stringify(want)}\n  got  ${JSON.stringify(got)}`);
  }
}
console.log(`${cases.length - fail}/${cases.length} passed`);
process.exit(fail ? 1 : 0);
