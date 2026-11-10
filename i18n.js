// English for visitors whose browser is not set to Arabic. Arabic stays the source; this swaps text after render.
// Override: ?lang=en / ?lang=ar, or the EN/ع button (remembered per browser).
(function () {
  let lang = null;
  try { const q = new URLSearchParams(location.search).get("lang"); if (q === "en" || q === "ar") { lang = q; localStorage.setItem("bc_lang", q); } } catch (e) {}
  if (!lang) { try { lang = localStorage.getItem("bc_lang"); } catch (e) {} }
  if (lang !== "en" && lang !== "ar") {
    const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || "ar"]);
    lang = langs.some(l => /^ar\b/i.test(l || "")) ? "ar" : "en";
  }
  window.BC_LANG = lang;

  const D = {
    // nav / hero
    "الرئيسية": "Home", "المسلسلات": "Series", "كوميديا": "Comedy", "بودكاست": "Podcast", "اللعبة": "Game",
    "كسوف الحراس": "Guardians' Eclipse", "المانجا": "Manga", "الشخصيات": "Characters", "اطلب إعلانًا": "Order an ad",
    "المتجر": "Shop", "أعمال": "", "الأصلية": "Originals",
    "شتات الذهب واليقظة": "The Scattered Gold", "الحراس الخمسة": "The Five Guardians", "دوكش وبدر": "Dokesh & Badr",
    "تبدأ الحكاية في واحة النجوم، حيث تحرس جدة أمازيغية سرًا عمره ألف عام وتنين مقيد ينتظر. ثم يستيقظ فتى معصوب العينين تسكنه روح الأيل والبرق، ودوكش بطوقه الأحمر يراقب من بعيد.":
      "It begins in the Oasis of Stars, where an Amazigh grandmother guards a thousand-year-old secret and a chained dragon waits. Then a blindfolded boy awakens, carrying the spirit of the stag and the lightning, while Dokesh in his red collar watches from afar.",
    "شاهد الحلقة 0": "Watch episode 0", "شاهد الحلقة 8": "Watch episode 8", "شاهد الحلقة 2": "Watch episode 2",
    "شاهد: الحب غالي": "Watch: Love Is Expensive", "＋ كل الحلقات": "＋ All episodes",
    // watch
    "شاهد السلاسل": "Watch the series", "اختر سلسلة أو شاهد كل شيء. الحلقات تعمل هنا مباشرة بدون أي تطبيق.": "Pick a series or watch everything. Episodes play right here, no app needed.",
    "الكل": "All", "شتات الذهب واليقظة: الحراس الخمسة": "The Scattered Gold: The Five Guardians",
    "مواقف قصيرة بين دوكش وبدر: مقابلات عمل، وصايا، وفواتير لا تنتهي.": "Short sketches with Dokesh and Badr: job interviews, wills and bills that never end.",
    "الطقس الجميل": "Lovely Weather", "دوكش يمدح الجو المشمس… والعاصفة تسمعه.": "Dokesh praises the sunshine… and the storm hears him.",
    "قصة قبل النوم": "Bedtime Story", "بدر يقرأ لدوكش قصة… لكن من ينام أولًا؟": "Badr reads Dokesh a story… but who falls asleep first?",
    "مقابلة العمل": "The Job Interview", "دوكش مدير التوظيف، وسؤاله الوحيد عن علب التونة.": "Dokesh is the hiring manager, and his only question is about tuna cans.",
    "الحب غالي": "Love Is Expensive", "عقد ألماس للونا… وبطاقة بدر هي اللي تدفع.": "A diamond necklace for Luna… paid for with Badr's card.",
    "الحلقة 7: الوصية": "Episode 7: The Will", "بدر مريض بالزكام، ودوكش جاهز بورقة الوصية.": "Badr has a cold, and Dokesh is ready with the will.",
    "دوكش يستضيف بدر في استوديو البودكاست، ويخرج دائمًا بالكلمة الأخيرة.": "Dokesh hosts Badr in the podcast studio and always gets the last word.",
    "الحلقة 2: إقراض المال": "Episode 2: Lending Money", "هل تقرض صديقك؟ دوكش عنده رأي آخر.": "Would you lend a friend money? Dokesh has other ideas.",
    "الحلقة 0: أمانة واحة النجوم": "Episode 0: The Oasis of Stars", "بداية القصة": "Where it begins",
    "عين الشمس وعين القمر وجوهرة متصدعة… المختارون يستيقظون قبل الكسوف.": "An eye of sun, an eye of moon and a cracked gem… the chosen awaken before the eclipse.",
    "الكتاب القديم يُفتح، والمختارة تستيقظ وسط الصحراء.": "The ancient book opens, and the Chosen One wakes in the desert.",
    "قاعة الحمم والجدار المنقوش… وتنين يفتح عينه.": "The lava hall and the carved wall… and a dragon opens its eye.",
    "وحش مقيد بالسلاسل، وشاب بعين زرقاء يلتقي الساحر العجوز.": "A chained beast, and a young man with a blue eye meets the old wizard.",
    "المختارة تجمع قوتها، والتنين الأسود يستيقظ.": "The Chosen One gathers her power, and the black dragon awakens.",
    "واحة الجنيات المضيئة، والتنين الأبيض ينضم إلى المختارين.": "The glowing fairy oasis, and the white dragon joins the chosen.",
    "التنين متعدد الرؤوس يستيقظ، وجيش الظلام يزحف عبر الأرض المحروقة.": "The many-headed dragon awakens, and the army of darkness marches across the scorched land.",
    "شجرة العالم تفتح الطريق، والحوت الكوني يواجه العنقاء المشتعلة.": "The World Tree opens the way, and the cosmic whale faces the burning phoenix.",
    "المعركة الكبرى في السماء والأرض… ثم يلتقي الأبطال تحت الشجرة.": "The great battle in sky and earth… then the heroes meet beneath the tree.",
    // games
    "لعبة مجانية": "Free game", "دوكش وصيد التونا": "Dokesh & the Tuna Hunt",
    "دوكش سرق تونة العشاء، وبدر يلاحقه على أسطح المدينة.": "Dokesh stole dinner's tuna, and Badr chases him across the city rooftops.",
    "كل علبة تزيد سرعتك. تجنّب السكاكين والحفر.": "Every can makes you faster. Dodge the knives and the holes.",
    "عند كل 100 علبة تظهر لونا بقبلة وروح إضافية 💗": "Every 100 cans, Luna appears with a kiss and an extra life 💗",
    "ابدأ اللعب الآن": "Play now", "قريبًا على": "Coming soon on", "لعبة سحر ومغامرة": "Magic & adventure game", "جديد": "New",
    "اختر حارسك من عالمي ECLIPSE OF THE CHOSEN والحراس الخمسة: المختارة، حارس البرق، الحارس المعصوب، أو حارس المطرقة.": "Choose your guardian from ECLIPSE OF THE CHOSEN and The Five Guardians: the Chosen One, the Storm Guardian, the Blindfolded Guardian or the Hammer Guardian.",
    "6 مراحل من الصحراء الذهبية إلى القلعة المظلمة، وزعماء مثل ملك الحمم والتنين متعدد الرؤوس.": "6 stages from the golden desert to the dark castle, with bosses like the Lava King and the many-headed dragon.",
    "دوكش يقاتل بجانبك، ولونا تشفيك بقبلة، والتنين الأبيض يلبّي النداء.": "Dokesh fights at your side, Luna heals you with a kiss, and the white dragon answers the call.",
    "معدات ونُدرة وتطوير +10، وسوق دوكش للبيع والشراء، ومهام الساحر العجوز.": "Gear, rarities and +10 upgrades, Dokesh's market, and quests from the old wizard.",
    "ادخل عالم الحراس": "Enter the Guardians' world", "لوحة الأبطال": "Hall of Heroes", "… جاري تحميل الأبطال": "… loading heroes",
    "العب «كسوف الحراس»، واكتب اسمك في الواحة، ثم ارجع لهذه الصفحة ليظهر ترتيبك.": "Play Guardians' Eclipse, enter your name in the oasis, then come back here to see your rank.",
    // manga
    "منجا black Cat": "black Cat Manga", "كسوف المختارين – المجلد الأول": "Eclipse of the Chosen – Volume 1",
    "الحلقات الثماني من ECLIPSE OF THE CHOSEN في 34 صفحة منجا بالأبيض والأسود.": "All eight episodes of ECLIPSE OF THE CHOSEN in 34 black-and-white manga pages.",
    "من الكتاب القديم في الصحراء إلى قاعة الحمم، وواحة الجنيات، وجيش الظلام، والمعركة الكبرى تحت شجرة العالم.": "From the ancient book in the desert to the lava hall, the fairy oasis, the army of darkness and the great battle beneath the World Tree.",
    "حوارات عربية، وتُقرأ من اليمين إلى اليسار على الجوال والكمبيوتر.": "Dialogue in Arabic; read right to left on phone or computer.",
    "اقرأ المانجا الآن": "Read the manga",
    // Leo e-book
    "كتاب ليو": "Leo book", "كتاب أطفال إلكتروني": "Children's e-book", "ليو: ومضة في مدينة الأدوات": "Leo: A Spark in the City of Gadgets",
    "مصباح صغير اسمه ليو ينقذ مدرسة التقنيات العليا عندما يعمّ الظلام، ويكتشف أن الشجاعة والأفكار أهم من أحدث التقنيات.": "A little lamp named Leo saves the High Tech School when the lights go out, and learns that courage and ideas matter more than the latest tech.",
    "قصة مصوّرة للأطفال من 5 إلى 9 سنوات، تأليف بدر الدين الأمين.": "An illustrated story for ages 5 to 9, written by Bader Eddine El Amine.",
    "19 صفحة PDF: قصة بأسلوب الكوميكس، وخريطة مدينة إليكتروبوليس، و4 صفحات تلوين منها صفحتان مع دوكش.": "19-page PDF: a comic-style story, a map of Electropolis and 4 colouring pages, two of them with Dokesh.",
    "اشترِ الكتاب • 10 ر.ق": "Buy the book • 10 QAR",
    "كيف التقينا": "How We Met", "شاهد: كيف التقينا": "Watch: How We Met", "قبل كل المقالب… بدر وحيد في المدينة، وقطّ أسود على مقعد في الحديقة.": "Before all the pranks… Badr alone in the city, and a black cat on a park bench.",
    // shop
    "متجر Black Cat": "Black Cat Shop", "اقتنِ دوكش وأبطال المسلسلات على ملابسك وجدرانك، أو حمّل اللوحات بدقة عالية.": "Wear Dokesh and the heroes of the series, hang them on your wall, or download high-resolution art.",
    "🛍️ تيشيرتات وبوسترات وستيكرات": "🛍️ T-shirts, posters and stickers",
    "جمل دوكش ولقطات المسلسلات مطبوعة على المنتجات، تُشحن إليك من Redbubble.": "Dokesh's lines and scenes from the series printed on products, shipped to you by Redbubble.",
    "شحن لكل العالم": "Ships worldwide", "ادخل متجر Redbubble": "Visit the Redbubble shop", "🖼️ لوحات رقمية للتحميل": "🖼️ Digital art downloads",
    "لقطات المسلسلات بدقة 300 DPI للطباعة أو خلفية للجوال والكمبيوتر، تحميل فوري بعد الشراء.": "Scenes from the series at 300 DPI for printing or as phone and desktop wallpapers. Instant download after purchase.",
    "اللوحة بـ": "Each artwork", "19 ر.ق": "QAR 19", "ادخل متجر Shopify": "Visit the Shopify store",
    // orders
    "خدمات للعلامات التجارية": "For brands", "اطلب دوكش لمنتجك": "Get Dokesh for your product",
    "فيديو قصير بأسلوب Black Cat السينمائي يعرض منتجك أو مناسبتك، بطولة دوكش وبدر، جاهز للنشر على تيك توك وإنستغرام ويوتيوب.": "A short cinematic Black Cat video featuring your product or occasion, starring Dokesh and Badr, ready for TikTok, Instagram and YouTube.",
    "اختر الخدمة وأرسل التفاصيل": "Pick a service and send the details", "نرسل لك الفكرة والسعر خلال 48 ساعة": "We send you the idea and price within 48 hours", "تدفع وتستلم الفيديو جاهزًا": "You pay and receive the finished video",
    "إعلان منتج مع دوكش": "Product ad with Dokesh", "دوكش يجرّب منتجك في موقف كوميدي من 10 إلى 15 ثانية.": "Dokesh tries your product in a 10–15 second comedy sketch.",
    "عمودي وأفقي · ترجمة عربية": "Vertical & horizontal · Arabic subtitles", "فيديو مخصص": "Custom video",
    "تهنئة، افتتاح، إعلان فعالية أو هدية لشخص تحبه بصوت دوكش.": "A greeting, an opening, an event announcement or a gift for someone you love, in Dokesh's voice.",
    "حتى 30 ثانية": "Up to 30 seconds", "رعاية حلقة": "Sponsor an episode", "ظهور منتجك داخل حلقة يومية من دوكش وبدر مع ذكر علامتك.": "Your product appears in a daily Dokesh & Badr episode, with your brand mentioned.",
    "يُنشر على حسابات Black Cat": "Published on Black Cat's channels", "الاسم أو اسم الشركة": "Name or company", "واتساب أو بريد للتواصل": "WhatsApp or email",
    "الخدمة": "Service", "رابط المنتج أو الحساب (اختياري)": "Product or account link (optional)", "ماذا تريد في الفيديو؟": "What do you want in the video?",
    "الميزانية التقريبية": "Approximate budget", "أقل من 200 ر.ق": "Under QAR 200", "200 – 500 ر.ق": "QAR 200 – 500", "500 – 1000 ر.ق": "QAR 500 – 1000",
    "أكثر من 1000 ر.ق": "Over QAR 1000", "لا أعرف بعد": "Not sure yet", "موعد التسليم المطلوب": "Delivery date", "أرسل الطلب": "Send request",
    "اطلب عبر واتساب": "Order on WhatsApp", "البريد:": "Email:", "نسخ": "Copy", "نُسخ ✓": "Copied ✓", "حدّده وانسخه": "Select and copy",
    "الطلبات الواردة (تظهر لك وحدك)": "Incoming requests (only you can see this)", "لا طلبات بعد.": "No requests yet.",
    "اكتب اسمك ووسيلة التواصل وتفاصيل الفيديو.": "Enter your name, a way to reach you and the video details.",
    "طلبك جاهز. اضغط لإرساله لنا على واتساب:": "Your request is ready. Tap to send it to us on WhatsApp:", "أرسل الطلب عبر واتساب": "Send on WhatsApp",
    // cast / footer
    "دوكش": "Dokesh", "قط Scottish Fold أسود بعينين ذهبيتين. ذكي، متعالٍ، ويعرف دائمًا أين بطاقة بدر.": "A black Scottish Fold with golden eyes. Clever, aloof, and always knows where Badr's card is.",
    "بدر": "Badr", "صاحب البيت الطيب، والضحية الدائمة لخطط دوكش ولفواتيره.": "The kind homeowner, and the permanent victim of Dokesh's schemes and bills.",
    "لونا": "Luna", "قطة فارسية بيضاء بعيون زرقاء وطوق وردي، حبيبة دوكش وسبب أغلى مشترياته.": "A white Persian with blue eyes and a pink collar, Dokesh's sweetheart and the reason for his priciest purchases.",
    "© 2026 استوديو Black Cat · حلقة جديدة كل يوم": "© 2026 Black Cat Studio · A new episode every day", "واتساب": "WhatsApp",
    "إغلاق ✕": "Close ✕", "التالي:": "Up next:",
    // manga reader
    "كسوف المختارين": "Eclipse of the Chosen", "الغلاف": "Cover", "الفصول": "Chapters", "→ السابق": "Previous", "التالي ←": "Next",
    "السابق": "Previous", "التالي": "Next", "الصفحة السابقة": "Previous page", "الصفحة التالية": "Next page",
    "الأسهم أو اسحب للتقليب": "Arrow keys or swipe to turn pages (manga reads right to left)",
    // labels / alt
    "القائمة": "Menu", "يوتيوب": "YouTube", "تيك توك": "TikTok", "فيسبوك": "Facebook", "العب لعبة دوكش": "Play the Dokesh game",
    "تطبيق دوكش للجوال": "Dokesh mobile app", "اطلب فيديو أو إعلانًا": "Order a video or ad", "تشغيل الصوت": "Sound on", "كتم الصوت": "Mute",
    "اختر السلسلة": "Choose a series", "تصفية السلاسل": "Filter series", "نوع الخدمة": "Service type", "روابط": "Links",
    "لقطة من لعبة دوكش وصيد التونا: بدر يلاحق دوكش على أسطح المدينة": "Screenshot of Dokesh & the Tuna Hunt: Badr chases Dokesh across the rooftops",
    "تطبيق اللعبة قريبًا على Google Play": "Game app coming soon on Google Play",
    "لقطة من لعبة كسوف الحراس: حارس البرق ودوكش يقاتلون أعداء الظلام في واحة الجنيات": "Screenshot of Guardians' Eclipse: the Storm Guardian and Dokesh fight the dark in the fairy oasis",
    "غلاف منجا كسوف المختارين: المختارة بشعرها الذهبي والفضي والجوهرة المتصدعة على جبينها": "Cover of the Eclipse of the Chosen manga: the Chosen One with gold and silver hair and a cracked gem on her forehead",
    "تصميم ملك النار": "Fire King design", "تصميم التنين البنفسجي": "Purple dragon design", "دوكش بالنظارة": "Dokesh in glasses",
    "تصميم أسد الصقيع": "Frost lion design", "تصميم الفتاة المختارة": "Chosen girl design", "تصميم التنين المقيد": "Chained dragon design", "لونا مع دوكش": "Luna with Dokesh",
    "+974… أو name@mail.com": "+974… or name@mail.com", "عرّفنا بمنتجك، والرسالة التي تريد إيصالها، وأي جملة يقولها دوكش…": "Tell us about your product, the message you want across, and any line Dokesh should say…",
    // leaderboard
    "لا أبطال بعد. كن أول حارس في اللوحة!": "No heroes yet. Be the first guardian on the board!", "تعذّر تحميل لوحة الأبطال.": "Couldn't load the Hall of Heroes.",
    "لوحة الأبطال غير متاحة الآن.": "The Hall of Heroes isn't available right now.",
    "لم تلعب بعد على هذا الجهاز. العب «كسوف الحراس» ثم ارجع هنا ليظهر اسمك.": "You haven't played on this device yet. Play Guardians' Eclipse, then come back to see your name.",
  };
  const RULES = [
    [/^شاهد (.+?): (.+)$/, (m) => "Watch " + tr(m[1]) + ": " + tr(m[2])],
    [/^الحلقة (\d+)$/, (m) => "Episode " + m[1]],
    [/^(.+) · (\d+) (حلقات|حلقتان|حلقة)$/, (m) => ({"كوميديا يومية": "Daily comedy", "بودكاست دوكش": "Dokesh's podcast", "فانتازيا": "Fantasy", "فانتازيا ملحمية": "Epic fantasy"}[m[1]] || m[1]) + " · " + m[2] + (m[2] === "1" ? " episode" : " episodes")],
    [/^صفحة (\d+)$/, (m) => "Page " + m[1]],
    [/^ترتيبك: (\d+)$/, (m) => "Your rank: " + m[1]],
    [/^القوة (.+)$/, (m) => "Power " + m[1]],
  ];
  function tr(s) {
    const t = s.trim(); if (!t) return s;
    if (Object.prototype.hasOwnProperty.call(D, t)) return s.replace(t, D[t]);
    for (const [re, fn] of RULES) { const m = t.match(re); if (m) return s.replace(t, fn(m)); }
    return s;
  }
  window.BC_T = (s) => (lang === "en" ? tr(s) : s);

  const AR = /[؀-ۿ]/, ATTRS = ["alt", "aria-label", "placeholder", "title"];
  function walk(root) {
    if (root.nodeType === 3) { if (AR.test(root.nodeValue)) { const v = tr(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; } return; }
    if (root.nodeType !== 1 || root.closest && root.closest("script,style,[data-no-i18n]")) return;
    for (const a of ATTRS) { const v = root.getAttribute && root.getAttribute(a); if (v && AR.test(v)) { const n = tr(v); if (n !== v) root.setAttribute(a, n); } }
    for (const c of root.childNodes) walk(c);
  }

  function toggleButton() {
    const nav = document.querySelector(".nav-end") || document.querySelector("header");
    if (!nav || document.getElementById("bcLang")) return;
    const b = document.createElement("button");
    b.id = "bcLang"; b.type = "button"; b.className = "iconbtn"; b.setAttribute("data-no-i18n", "");
    b.style.cssText = "font:700 14px system-ui,sans-serif;background:none;cursor:pointer";
    b.textContent = lang === "en" ? "ع" : "EN";
    b.setAttribute("aria-label", lang === "en" ? "العربية" : "English");
    b.onclick = () => { try { localStorage.setItem("bc_lang", lang === "en" ? "ar" : "en"); } catch (e) {} location.reload(); };
    nav.insertBefore(b, nav.firstChild);
  }

  function start() {
    toggleButton();
    if (lang !== "en") return;
    document.documentElement.lang = "en"; document.documentElement.dir = "ltr";
    document.body.style.direction = "ltr";
    const st = document.createElement("style");
    st.textContent = ".hero-copy .inner,.sec-head,.arcade .inner>div{text-align:left}.arcade ul{padding-inline-start:1.1em}"
      + "@media (min-width:901px){.picker{left:auto!important;right:max(28px,env(safe-area-inset-right,0px))}"
      + ".hero-copy{padding-right:0!important;padding-left:max(56px,env(safe-area-inset-left,0px))}"
      + ".mute{left:auto!important;right:max(28px,env(safe-area-inset-right,0px))}"
      + ".hero .shade{background:linear-gradient(to right,rgb(8 6 10 / .82) 0%,rgb(8 6 10 / .35) 38%,transparent 62%),linear-gradient(to top,var(--ink) 0%,rgb(12 10 14 / .4) 22%,transparent 45%)!important}}";
    document.head.appendChild(st);
    if (/دوكش|Black Cat/.test(document.title)) document.title = "Black Cat Studio – Dokesh & Badr, Eclipse of the Chosen, manga and games";
    walk(document.body);
    new MutationObserver(ms => { for (const m of ms) { if (m.type === "characterData") walk(m.target); else m.addedNodes.forEach(walk); if (m.type === "attributes") walk(m.target); } })
      .observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
