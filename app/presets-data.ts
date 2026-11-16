// Sample images and preset data for ACHAR AI Exhibition Showcase
export interface DemoPreset {
  label: string;
  icon: string;
  tool: "ocr" | "pdf_chat" | "qr" | "math" | "url";
  fileName?: string;
  fileBase64?: string;
  mimeType?: string;
  filePreview?: string;
  textInput?: string;
  url?: string;
  isPdfMock?: boolean;
}

// 1. Invoice Sample (فاکتور رسمی)
const invoiceSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="280" viewBox="0 0 460 280">
  <rect width="460" height="280" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="230" y="35" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">فاکتور رسمی فروش تجهیزات هوشمند</text>
  <text x="420" y="65" font-family="Arial, sans-serif" font-size="12" fill="#64748b" text-anchor="end">شماره فاکتور: ۹۸۲۱</text>
  <text x="40" y="65" font-family="Arial, sans-serif" font-size="12" fill="#64748b">تاریخ: ۱۴۰۳/۰۸/۲۵</text>
  <line x1="30" y1="78" x2="430" y2="78" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="420" y="105" font-family="Arial, sans-serif" font-size="13" fill="#1e293b" text-anchor="end">۱. وبکم کنفرانس ۴K: ۱۲,۰۰۰,۰۰۰ تومان</text>
  <text x="420" y="135" font-family="Arial, sans-serif" font-size="13" fill="#1e293b" text-anchor="end">۲. میکروفون بی‌سیم: ۴,۵۰۰,۰۰۰ تومان</text>
  <text x="420" y="165" font-family="Arial, sans-serif" font-size="13" fill="#1e293b" text-anchor="end">۳. کابل رابط پرسرعت: ۸۵۰,۰۰۰ تومان</text>
  <line x1="30" y1="185" x2="430" y2="185" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="420" y="215" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="end">جمع کل: ۱۷,۳۵۰,۰۰۰ تومان</text>
  <text x="230" y="255" font-family="Arial, sans-serif" font-size="12" fill="#059669" font-weight="bold" text-anchor="middle">وضعیت پرداخت: موفق</text>
</svg>`;

// 2. Handwritten Letter Sample (نامه اداری)
const handwritingSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="260" viewBox="0 0 460 260">
  <rect width="460" height="260" fill="#fdfbf7" stroke="#e2e8f0" stroke-width="2" rx="8"/>
  <text x="230" y="32" font-family="Arial, sans-serif" font-size="14" font-style="italic" fill="#475569" text-anchor="middle">بسمه تعالی</text>
  <text x="420" y="65" font-family="Arial, sans-serif" font-size="13" fill="#334155" text-anchor="end">تاریخ: ۱۴۰۳/۰۸/۲۵</text>
  <text x="420" y="95" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="end">مدیریت محترم غرفه فناوری</text>
  <text x="420" y="130" font-family="Arial, sans-serif" font-size="13" fill="#334155" text-anchor="end">احتراماً، عطف به مذاکرات اخیر، آمادگی این مجموعه جهت پیاده‌سازی</text>
  <text x="420" y="155" font-family="Arial, sans-serif" font-size="13" fill="#334155" text-anchor="end">زیرساخت هوش مصنوعی و اتوماسیون سازمانی اعلام می‌گردد.</text>
  <text x="100" y="220" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#0f172a">با احترام - شرکت رایان سیستم</text>
</svg>`;

// 3. Math Integral Formula Sample
const mathIntegralSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="200" viewBox="0 0 460 200">
  <rect width="460" height="200" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="230" y="45" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">مسئله انتگرال معین مثلثاتی</text>
  <text x="230" y="110" font-family="Times New Roman, serif" font-size="28" font-style="italic" fill="#2563eb" text-anchor="middle">I = ∫₀^(π/2)  sin(x) · cos(x) dx</text>
  <text x="230" y="160" font-family="Arial, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">محاسبه مقدار دقیق با روش تغییر متغیر</text>
</svg>`;

// 4. Circuit Diagram Sample
const circuitSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="220" viewBox="0 0 460 220">
  <rect width="460" height="220" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="8"/>
  <text x="230" y="35" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">مدار الکتریکی DC (قانون اهم)</text>
  <rect x="70" y="65" width="320" height="110" fill="none" stroke="#2563eb" stroke-width="2.5" rx="4"/>
  <text x="60" y="125" font-family="Arial" font-size="14" font-weight="bold" fill="#059669" text-anchor="end">منبع: ۱۲ ولت</text>
  <rect x="200" y="55" width="60" height="20" fill="#ffffff" stroke="#e11d48" stroke-width="2"/>
  <text x="230" y="70" font-family="Arial" font-size="11" font-weight="bold" fill="#e11d48" text-anchor="middle">R = ۴ Ω</text>
  <text x="230" y="195" font-family="Arial, sans-serif" font-size="13" fill="#334155" text-anchor="middle">محاسبه شدت جریان (I) و توان اتلافی (P)</text>
</svg>`;

// 5. QR Barcode Sample
const qrSampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
  <rect width="220" height="220" fill="#ffffff"/>
  <rect x="20" y="20" width="50" height="50" fill="#0f172a" rx="4"/>
  <rect x="30" y="30" width="30" height="30" fill="#ffffff"/>
  <rect x="36" y="36" width="18" height="18" fill="#0f172a"/>

  <rect x="150" y="20" width="50" height="50" fill="#0f172a" rx="4"/>
  <rect x="160" y="30" width="30" height="30" fill="#ffffff"/>
  <rect x="166" y="36" width="18" height="18" fill="#0f172a"/>

  <rect x="20" y="150" width="50" height="50" fill="#0f172a" rx="4"/>
  <rect x="30" y="160" width="30" height="30" fill="#ffffff"/>
  <rect x="36" y="166" width="18" height="18" fill="#0f172a"/>

  <rect x="85" y="25" width="12" height="12" fill="#0f172a"/>
  <rect x="115" y="25" width="12" height="12" fill="#0f172a"/>
  <rect x="85" y="55" width="12" height="12" fill="#0f172a"/>
  <rect x="85" y="85" width="12" height="12" fill="#0f172a"/>
  <rect x="115" y="85" width="22" height="22" fill="#0f172a"/>
  <rect x="150" y="85" width="12" height="12" fill="#0f172a"/>
  <rect x="25" y="85" width="15" height="15" fill="#0f172a"/>
  <rect x="55" y="115" width="15" height="15" fill="#0f172a"/>
  <rect x="85" y="115" width="15" height="15" fill="#0f172a"/>
  <rect x="120" y="125" width="15" height="15" fill="#0f172a"/>
  <rect x="160" y="125" width="20" height="20" fill="#0f172a"/>
  <rect x="85" y="155" width="15" height="15" fill="#0f172a"/>
  <rect x="120" y="155" width="20" height="20" fill="#0f172a"/>
  <rect x="160" y="165" width="25" height="25" fill="#0f172a"/>
</svg>`;

function svgToBase64(svg: string): string {
  if (typeof window !== "undefined") {
    return btoa(unescape(encodeURIComponent(svg)));
  }
  return Buffer.from(svg).toString("base64");
}

export const INVOICE_BASE64 = svgToBase64(invoiceSvg);
export const HANDWRITING_BASE64 = svgToBase64(handwritingSvg);
export const MATH_INTEGRAL_BASE64 = svgToBase64(mathIntegralSvg);
export const CIRCUIT_BASE64 = svgToBase64(circuitSvg);
export const QR_SAMPLE_BASE64 = svgToBase64(qrSampleSvg);

export const ALL_DEMO_PRESETS: Record<"ocr" | "pdf_chat" | "qr" | "math" | "url", DemoPreset[]> = {
  ocr: [
    {
      label: "🧾 فاکتور رسمی",
      icon: "🧾",
      tool: "ocr",
      fileName: "فاکتور_تجهیزات.png",
      fileBase64: INVOICE_BASE64,
      mimeType: "image/svg+xml",
      textInput: "استخراج اقلام، قیمت‌ها و جمع کل فاکتور در جدول مرتب",
    },
    {
      label: "📝 نامه اداری",
      icon: "📝",
      tool: "ocr",
      fileName: "نامه_اداری.png",
      fileBase64: HANDWRITING_BASE64,
      mimeType: "image/svg+xml",
      textInput: "استخراج دقیق متن نامه، تاریخ و فرستنده",
    },
  ],
  math: [
    {
      label: "📐 انتگرال معین",
      icon: "📐",
      tool: "math",
      fileName: "فرمول_انتگرال.png",
      fileBase64: MATH_INTEGRAL_BASE64,
      mimeType: "image/svg+xml",
      textInput: "حل تشریحی انتگرال معین با ذکر مراحل تغییر متغیر",
    },
    {
      label: "⚡ مدار الکتریکی",
      icon: "⚡",
      tool: "math",
      fileName: "مدار_الکتریکی.png",
      fileBase64: CIRCUIT_BASE64,
      mimeType: "image/svg+xml",
      textInput: "محاسبه جریان مدار و توان مصرفی مقاومت با فرمول",
    },
  ],
  pdf_chat: [
    {
      label: "📜 قرارداد محرمانگی",
      icon: "📜",
      tool: "pdf_chat",
      isPdfMock: true,
      fileName: "قرارداد_NDA.pdf",
      textInput: "مفاد کلیدی توافق‌نامه عدم افشا (NDA): طرفین متعهد می‌شوند کلیه اسرار تجاری و کدهای منبع را تا ۳ سال پس از نمایشگاه نزد خود محفوظ دارند. در صورت نقض، خسارت ۵۰ میلیون تومان تعیین شده است. پرسش: تعهدات اصلی و ضمانت اجرا را خلاصه کن.",
    },
    {
      label: "📊 گزارش استارتاپ",
      icon: "📊",
      tool: "pdf_chat",
      isPdfMock: true,
      fileName: "گزارش_رشد.pdf",
      textInput: "گزارش سالانه: تعداد کاربران فعال به ۱۲۰,۰۰۰ نفر رسید، درآمد سالانه ۱۸۰٪ رشد کرد و هزینه جذب کاربر ۳۵٪ کاهش یافت. پرسش: شاخص‌های رشد را استخراج کن.",
    },
  ],
  url: [
    {
      label: "🌐 دانشنامه هوش مصنوعی",
      icon: "🌐",
      tool: "url",
      url: "https://fa.wikipedia.org/wiki/هوش_مصنوعی",
    },
    {
      label: "🚀 وبلاگ تکنولوژی",
      icon: "🚀",
      tool: "url",
      url: "https://blog.google/technology/ai",
    },
  ],
  qr: [
    {
      label: "📱 اسکن QR نمونه",
      icon: "📱",
      tool: "qr",
      fileName: "بارکد_نمونه.png",
      fileBase64: QR_SAMPLE_BASE64,
      mimeType: "image/svg+xml",
      textInput: "تحلیل سلامت لینک و محتوای بارکد",
    },
    {
      label: "📶 تولید QR وای‌فای",
      icon: "📶",
      tool: "qr",
      textInput: "WIFI:S:Exhibition_VIP;T:WPA;P:Achar2026;;",
    },
  ],
};
