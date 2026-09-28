// Place names used by the checkout quick fill to pick Inside or Outside Dhaka.
// English entries are matched as whole words (case-insensitive), Bangla ones as substrings.
// Add a name to the right list if customers ever get the wrong delivery area.

// Dhaka city: thanas, neighbourhoods and common spellings. Delivery here is "Inside Dhaka".
export const DHAKA_CITY = [
  // English
  "dhaka", "dacca", "mirpur", "pallabi", "kafrul", "uttara", "dhanmondi", "dhanmandi", "gulshan", "banani", "baridhara",
  "bashundhara", "bosundhara", "mohammadpur", "mohammedpur", "motijheel", "motijhil", "paltan", "purana paltan",
  "naya paltan", "ramna", "shahbagh", "tejgaon", "farmgate", "karwan bazar", "kawran bazar", "kawranbazar",
  "mohakhali", "badda", "merul badda", "uttar badda", "rampura", "banasree", "banashree", "khilgaon", "malibagh",
  "mogbazar", "moghbazar", "magbazar", "shantinagar", "jatrabari", "demra", "sayedabad", "saidabad", "wari", "lalbagh",
  "chawkbazar", "chowkbazar", "kamrangirchar", "hazaribagh", "hazaribag", "jigatola", "zigatola", "lalmatia",
  "shyamoli", "shamoli", "kallyanpur", "kalyanpur", "gabtoli", "gabtali", "agargaon", "khilkhet", "nikunja",
  "cantonment", "dhaka cantonment", "dakshinkhan", "uttarkhan", "mugda", "mugdapara", "basabo", "bashabo", "kakrail",
  "azimpur", "nilkhet", "kalabagan", "green road", "panthapath", "hatirpool", "hatirpul", "eskaton", "niketan",
  "niketon", "aftabnagar", "mohanagar", "adabor", "bangshal", "bhashantek", "vashantek", "bhatara", "vatara",
  "bimanbandar", "airport", "darus salam", "darussalam", "gendaria", "hatirjheel", "kadamtali", "new market",
  "rupnagar", "sabujbagh", "shah ali", "shahjahanpur", "sher-e-bangla nagar", "sher e bangla nagar", "shyampur",
  "sutrapur", "turag", "ashkona", "kuril", "baily road", "bailey road", "bakshibazar", "siddheshwari", "siddeshwari",
  "mouchak", "segunbagicha", "dilkusha", "gulistan", "sadarghat", "postogola", "dholaikhal", "nawabpur", "islampur",
  "babubazar", "nazimuddin road", "bosila", "beribadh", "rayerbazar", "sobhanbag", "kazipara", "shewrapara",
  "ibrahimpur", "pirerbag", "monipur", "senpara", "taltola", "rokeya sarani", "kochukhet", "matikata", "manikdi",
  "baunia", "diabari", "abdullahpur", "azampur", "kamalapur", "arambagh", "fakirapool", "fakirapul", "tikatuli",
  "gopibagh", "manda", "madartek", "nandipara", "goran", "meradia", "shahjadpur", "notun bazar", "nadda",
  "joar sahara", "kalachandpur", "science lab", "katabon", "elephant road", "palashi", "chankharpul", "dohs",
  "mohakhali dohs", "banani dohs", "baridhara dohs", "mirpur dohs", "japan garden", "ring road", "mohammadia housing",
  "old dhaka", "puran dhaka", "tejturi bazar", "kathalbagan", "hatirjhil", "moghbazar", "shyamoli", 
  "mirpur 1", "mirpur 2", "mirpur 10", "mirpur 11", "mirpur 12", "mirpur 13", "mirpur 14",
  // Bangla
  "ঢাকা", "মিরপুর", "পল্লবী", "কাফরুল", "উত্তরা", "ধানমন্ডি", "ধানমণ্ডি", "গুলশান", "বনানী", "বারিধারা", "বসুন্ধরা",
  "মোহাম্মদপুর", "মোহাম্মাদপুর", "মতিঝিল", "পল্টন", "রমনা", "শাহবাগ", "তেজগাঁও", "ফার্মগেট", "কারওয়ান বাজার",
  "কাওরান বাজার", "মহাখালী", "বাড্ডা", "রামপুরা", "বনশ্রী", "খিলগাঁও", "মালিবাগ", "মগবাজার", "শান্তিনগর",
  "যাত্রাবাড়ী", "যাত্রাবাড়ি", "ডেমরা", "সায়েদাবাদ", "ওয়ারী", "লালবাগ", "চকবাজার", "কামরাঙ্গীরচর", "হাজারীবাগ",
  "জিগাতলা", "লালমাটিয়া", "শ্যামলী", "কল্যাণপুর", "গাবতলী", "আগারগাঁও", "খিলক্ষেত", "নিকুঞ্জ", "ক্যান্টনমেন্ট",
  "দক্ষিণখান", "উত্তরখান", "মুগদা", "বাসাবো", "কাকরাইল", "আজিমপুর", "নীলক্ষেত", "কলাবাগান", "পান্থপথ", "হাতিরপুল",
  "আফতাবনগর", "আদাবর", "বংশাল", "ভাষানটেক", "ভাটারা", "বিমানবন্দর", "দারুস সালাম", "গেন্ডারিয়া", "হাতিরঝিল",
  "কদমতলী", "নিউ মার্কেট", "নিউমার্কেট", "রূপনগর", "সবুজবাগ", "শাহ আলী", "শাহজাহানপুর", "শেরেবাংলা নগর", "শ্যামপুর",
  "সূত্রাপুর", "তুরাগ", "আশকোনা", "কুড়িল", "বেইলি রোড", "বকশীবাজার", "সিদ্ধেশ্বরী", "মৌচাক", "সেগুনবাগিচা",
  "দিলকুশা", "গুলিস্তান", "সদরঘাট", "পোস্তগোলা", "নবাবপুর", "ইসলামপুর", "বাবুবাজার", "বছিলা", "রায়েরবাজার",
  "কাজীপাড়া", "শেওড়াপাড়া", "ইব্রাহিমপুর", "কচুক্ষেত", "মাটিকাটা", "মানিকদি", "আব্দুল্লাহপুর", "আজমপুর",
  "কমলাপুর", "আরামবাগ", "ফকিরাপুল", "টিকাটুলি", "গোপীবাগ", "মান্ডা", "মাদারটেক", "গোড়ান", "শাহজাদপুর",
  "নতুন বাজার", "নর্দা", "কালাচাঁদপুর", "সায়েন্সল্যাব", "কাটাবন", "এলিফ্যান্ট রোড", "পলাশী", "চানখারপুল",
  "পুরান ঢাকা", "কাঁঠালবাগান", "মনিপুর", "সেনপাড়া", "তালতলা",
];

// Every district except Dhaka, plus Dhaka-district towns outside the city, big upazilas and
// well-known towns. Any of these means "Outside Dhaka", even if "Dhaka" also appears
// ("Savar, Dhaka" or "Dhaka division").
const OUTSIDE_RAW = [
  // Districts (English, with common spellings)
  "bagerhat", "bandarban", "barguna", "barishal", "barisal", "bhola", "bogura", "bogra", "brahmanbaria", "b.baria",
  "chandpur", "chapai nawabganj", "chapainawabganj", "chapai", "chattogram", "chittagong", "ctg", "chuadanga",
  "cox's bazar", "coxs bazar", "cox bazar", "coxsbazar", "cumilla", "comilla", "dinajpur", "faridpur", "feni",
  "gaibandha", "gazipur", "gopalganj", "habiganj", "hobiganj", "jamalpur", "jashore", "jessore", "jhalokati",
  "jhalakathi", "jhalokathi", "jhenaidah", "jhenaidaha", "joypurhat", "jaipurhat", "khagrachhari", "khagrachari",
  "khulna", "kishoreganj", "kishorganj", "kurigram", "kushtia", "lakshmipur", "laxmipur", "lalmonirhat", "madaripur",
  "magura", "manikganj", "meherpur", "moulvibazar", "maulvibazar", "moulovibazar", "munshiganj", "munshigonj",
  "mymensingh", "mymenshing", "moymonsingh", "naogaon", "narail", "narayanganj", "narayangonj", "narsingdi",
  "narshingdi", "natore", "netrokona", "netrakona", "nilphamari", "noakhali", "pabna", "panchagarh", "patuakhali",
  "pirojpur", "rajbari", "rajshahi", "rangamati", "rangpur", "satkhira", "shariatpur", "sherpur", "sirajganj",
  "sirajgonj", "sunamganj", "sylhet", "tangail", "thakurgaon",
  // Dhaka district, outside the city
  "savar", "ashulia", "hemayetpur", "dhamrai", "keraniganj", "jinjira", "dohar", "nawabganj",
  // Around Dhaka
  "tongi", "board bazar", "kaliakair", "kapasia", "kaliganj", "sreepur", "joydebpur", "konabari", "mawna",
  "siddhirganj", "fatullah", "rupganj", "araihazar", "sonargaon", "chashara", "kanchpur", "bhulta",
  "narsingdi sadar", "shibpur", "monohardi", "belabo", "raipura", "madhabdi",
  "sreenagar", "lohajang", "tongibari", "sirajdikhan", "gazaria", "mawa",
  "singair", "saturia", "shibalaya", "harirampur", "ghior", "paturia",
  "mirzapur", "madhupur", "ghatail", "kalihati", "sakhipur", "bhuapur", "basail", "delduar", "nagarpur", "dhanbari",
  "bhairab", "kuliarchar", "bajitpur", "katiadi", "pakundia", "hossainpur", "karimganj", "tarail", "itna",
  "mithamain", "austagram", "nikli",
  // Chattogram division
  "agrabad", "halishahar", "nasirabad", "pahartali", "patenga", "bahaddarhat", "hathazari", "sitakunda", "mirsharai",
  "patiya", "raozan", "rangunia", "boalkhali", "anwara", "banshkhali", "satkania", "chandanaish", "fatikchhari",
  "sandwip", "teknaf", "ukhia", "chakaria", "moheshkhali", "maheshkhali", "kutubdia", "pekua",
  "kandirpar", "laksam", "chauddagram", "daudkandi", "chandina", "debidwar", "burichang", "homna", "muradnagar",
  "barura", "nangalkot", "maijdee", "maijdi", "chowmuhani", "chaumuhani", "begumganj", "senbag", "hatiya",
  "chhagalnaiya", "daganbhuiyan", "sonagazi", "parshuram", "ashuganj", "sarail", "kasba", "akhaura", "nabinagar",
  "bancharampur", "nasirnagar", "hajiganj", "kachua", "shahrasti", "faridganj", "ramganj", "ramgati",
  "kamalnagar", "khagrachari sadar", "kaptai", "lama", "dighinala", "ramgarh",
  // Sylhet division
  "zindabazar", "ambarkhana", "beanibazar", "golapganj", "jaintiapur", "kanaighat", "bishwanath", "balaganj",
  "osmani nagar", "srimangal", "sreemangal", "kulaura", "barlekha", "kamalganj", "chunarughat", "madhabpur",
  "nabiganj", "bahubal", "chhatak", "derai", "jagannathpur", "tahirpur",
  // Khulna division
  "sonadanga", "khalishpur", "daulatpur", "rupsha", "dumuria", "batiaghata", "paikgachha", "dacope", "koyra",
  "mongla", "morrelganj", "benapole", "noapara", "jhikargachha", "manirampur", "keshabpur", "chaugachha", "kaliganj",
  "shailkupa", "kotchandpur", "maheshpur", "kumarkhali", "bheramara", "mirpur kushtia", "alamdanga", "damurhuda",
  "gangni", "mujibnagar", "shalikha", "sreepur magura", "lohagara", "kalia", "shyamnagar", "kalaroa", 
  "debhata", "assasuni",
  // Rajshahi division
  "boalia", "shaheb bazar", "saheb bazar", "paba", "godagari", "bagha", "charghat", "puthia", "tanore",
  "mohonpur", "bagmara", "durgapur", "shibganj", "dhunat", "sonatala", "sariakandi", "adamdighi", "nandigram",
  "sherpur bogura", "santahar", "ullapara", "shahjadpur sirajganj", "belkuchi", "chauhali", "raiganj", "tarash",
  "ishwardi", "ishurdi", "bera", "santhia", "chatmohar", "bhangura", "faridpur pabna", "singra", "baraigram",
  "gurudaspur", "lalpur", "bagatipara", "patnitala", "manda naogaon", "niamatpur", "dhamoirhat", "sapahar", "porsha",
  "raninagar", "atrai", "gomastapur", "nachole", "bholahat", "akkelpur", "kalai", "khetlal", "panchbibi",
  // Rangpur division
  "pirganj", "mithapukur", "badarganj", "gangachara", "kaunia", "taraganj", "saidpur", "syedpur", "domar", "dimla",
  "jaldhaka", "kishoreganj nilphamari", "birampur", "birganj", "parbatipur", "fulbari", "phulbari", "bochaganj",
  "chirirbandar", "hili", "hakimpur", "palashbari", "gobindaganj", "sundarganj", "sadullapur", "ulipur",
  "chilmari", "nageshwari", "bhurungamari", "patgram", "hatibandha", "aditmari", "tetulia", "boda", "debiganj",
  "atwari", "pirganj thakurgaon", "ranisankail", "baliadangi", "haripur",
  // Mymensingh division
  "trishal", "bhaluka", "muktagachha", "gafargaon", "phulpur", "haluaghat", "ishwarganj", "nandail", "gouripur",
  "fulbaria", "dhobaura", "tarakanda", "sarishabari", "islampur jamalpur", "dewanganj", "madarganj", "melandaha",
  "bakshiganj", "nalitabari", "jhenaigati", "nakla", "sreebardi", "mohanganj", "kendua", "atpara",
  "barhatta", "kalmakanda", "purbadhala",
  // Barishal division
  "nathullabad", "bakerganj", "babuganj", "gournadi", "muladi", "mehendiganj", "wazirpur", "banaripara",
  "agailjhara", "hizla", "kuakata", "kalapara", "galachipa", "dashmina", "bauphal", "amtali", "betagi", "patharghata",
  "bhandaria", "mathbaria", "nazirpur", "kawkhali", "nesarabad", "swarupkathi", "rajapur", "nalchity", "kathalia",
  "charfasson", "lalmohan", "borhanuddin", "tazumuddin", "daulatkhan", "manpura",
  // Dhaka division, rest
  "rajoir", "shibchar", "kalkini", "tungipara", "kotalipara", "muksudpur", "kashiani", "boalmari", "alfadanga",
  "bhanga", "nagarkanda", "sadarpur", "charbhadrasan", "madhukhali", "goalanda", "pangsha", "baliakandi",
  "kalukhali", "naria", "zanjira", "jajira", "bhedarganj", "damudya", "gosairhat",
  // Bangla
  "বাগেরহাট", "বান্দরবান", "বরগুনা", "বরিশাল", "ভোলা", "বগুড়া", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "চাঁপাইনবাবগঞ্জ",
  "চাঁপাই", "চট্টগ্রাম", "চট্রগ্রাম", "চুয়াডাঙ্গা", "কক্সবাজার", "কুমিল্লা", "দিনাজপুর", "ফরিদপুর", "ফেনী", "গাইবান্ধা",
  "গাজীপুর", "গোপালগঞ্জ", "হবিগঞ্জ", "জামালপুর", "যশোর", "ঝালকাঠি", "ঝিনাইদহ", "জয়পুরহাট", "খাগড়াছড়ি",
  "খুলনা", "কিশোরগঞ্জ", "কুড়িগ্রাম", "কুষ্টিয়া", "লক্ষ্মীপুর", "লালমনিরহাট", "মাদারীপুর", "মাগুরা", "মানিকগঞ্জ",
  "মেহেরপুর", "মৌলভীবাজার", "মুন্সিগঞ্জ", "মুন্সীগঞ্জ", "ময়মনসিংহ", "নওগাঁ", "নড়াইল", "নারায়ণগঞ্জ", "নারায়নগঞ্জ",
  "নরসিংদী", "নাটোর", "নেত্রকোনা", "নীলফামারী", "নোয়াখালী", "পাবনা", "পঞ্চগড়", "পটুয়াখালী", "পিরোজপুর",
  "রাজবাড়ী", "রাজশাহী", "রাঙ্গামাটি", "রাঙামাটি", "রংপুর", "সাতক্ষীরা", "শরীয়তপুর", "শেরপুর", "সিরাজগঞ্জ",
  "সুনামগঞ্জ", "সিলেট", "টাঙ্গাইল", "টাঙাইল", "ঠাকুরগাঁও",
  "সাভার", "আশুলিয়া", "হেমায়েতপুর", "ধামরাই", "কেরানীগঞ্জ", "জিনজিরা", "দোহার", "নবাবগঞ্জ",
  "টঙ্গী", "বোর্ড বাজার", "কালিয়াকৈর", "কাপাসিয়া", "কালীগঞ্জ", "শ্রীপুর", "জয়দেবপুর", "কোনাবাড়ী",
  "সিদ্ধিরগঞ্জ", "ফতুল্লা", "রূপগঞ্জ", "আড়াইহাজার", "সোনারগাঁও", "চাষাড়া", "কাঁচপুর", "মাধবদী", "মাওয়া",
  "মির্জাপুর", "মধুপুর", "ঘাটাইল", "ভৈরব", "আশুগঞ্জ", "আখাউড়া",
  "আগ্রাবাদ", "হালিশহর", "পাহাড়তলী", "পতেঙ্গা", "বহদ্দারহাট", "হাটহাজারী", "সীতাকুণ্ড", "মিরসরাই", "পটিয়া",
  "রাউজান", "রাঙ্গুনিয়া", "আনোয়ারা", "বাঁশখালী", "সাতকানিয়া", "সন্দ্বীপ", "টেকনাফ", "উখিয়া", 
  "চকরিয়া", "মহেশখালী", "লাকসাম", "দাউদকান্দি", "চান্দিনা", "মাইজদী", "চৌমুহনী", "বেগমগঞ্জ", "হাতিয়া",
  "ছাগলনাইয়া", "হাজীগঞ্জ", "জিন্দাবাজার", "আম্বরখানা", "বিয়ানীবাজার", "শ্রীমঙ্গল", "কুলাউড়া",
  "ছাতক", "মংলা", "বেনাপোল", "নওয়াপাড়া", "ঈশ্বরদী", "সৈয়দপুর", "সান্তাহার", "ত্রিশাল", "ভালুকা", "মুক্তাগাছা",
  "কুয়াকাটা", "কলাপাড়া", "চরফ্যাশন", "শিবচর", "ভাঙ্গা", "গোয়ালন্দ", "পাংশা", "নড়িয়া", "জাজিরা",
];

// A few upazilas share a name with a Dhaka neighbourhood (Mirpur in Kushtia, Mohammadpur in
// Magura, Gabtali in Bogura...). Those stay out of this list so "Mirpur 10" is never sent
// outside. The district name after them still marks the address as outside.
export const OUTSIDE_DHAKA = OUTSIDE_RAW.filter((p) => !DHAKA_CITY.includes(p));
