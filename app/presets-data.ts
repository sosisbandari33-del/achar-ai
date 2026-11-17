// Sample images and preset data for ACHAR AI Exhibition Showcase
export interface DemoPreset {
  label: string;
  icon: string;
  tool: "ocr" | "pdf_chat" | "qr" | "math" | "url" | "chat";
  fileName?: string;
  fileBase64?: string;
  mimeType?: string;
  filePreview?: string;
  textInput?: string;
  url?: string;
  isPdfMock?: boolean;
  getCanvasImage?: () => string;
}

// -------------------------------------------------------------
// CLIENT-SIDE REAL PNG GENERATORS (Zero Tofu, Native OS Typography)
// -------------------------------------------------------------

export function generateInvoicePng(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // White clean sheet
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 420);

  // Outer border
  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 608, 388);

  // Header Title
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 20px Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("فاکتور فروش کالا و خدمات", 320, 52);

  // Metadata
  ctx.font = "13px Tahoma, Arial, sans-serif";
  ctx.fillStyle = "#475569";
  ctx.textAlign = "right";
  ctx.fillText("شماره فاکتور: ۱۴۰۳-۸۹۲", 600, 85);
  ctx.textAlign = "left";
  ctx.fillText("تاریخ: ۱۴۰۳/۰۸/۲۵", 32, 85);

  // Table Header Bar
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(24, 105, 592, 34);
  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(24, 105, 592, 34);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 13px Tahoma, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("ردیف", 595, 127);
  ctx.fillText("شرح کالا / خدمات", 520, 127);
  ctx.fillText("تعداد", 280, 127);
  ctx.fillText("مبلغ واحد (تومان)", 180, 127);
  ctx.fillText("مبلغ کل (تومان)", 85, 127);

  // Table Row 1
  ctx.font = "13px Tahoma, Arial, sans-serif";
  ctx.fillStyle = "#334155";
  ctx.fillText("۱", 595, 162);
  ctx.fillText("وب‌کم کنفرانس ۴K Ultra HD", 520, 162);
  ctx.fillText("۱", 280, 162);
  ctx.fillText("۱۲,۵۰۰,۰۰۰", 180, 162);
  ctx.fillText("۱۲,۵۰۰,۰۰۰", 85, 162);

  // Table Row 2
  ctx.fillText("۲", 595, 202);
  ctx.fillText("میکروفون بی‌سیم یقه‌ای حرفه‌ای", 520, 202);
  ctx.fillText("۲", 280, 202);
  ctx.fillText("۴,۲۰۰,۰۰۰", 180, 202);
  ctx.fillText("۸,۴۰۰,۰۰۰", 85, 202);

  // Table Row 3
  ctx.fillText("۳", 595, 242);
  ctx.fillText("کابل اتصال پرسرعت Thunderbolt", 520, 242);
  ctx.fillText("۱", 280, 242);
  ctx.fillText("۱,۱۰۰,۰۰۰", 180, 242);
  ctx.fillText("۱,۱۰۰,۰۰۰", 85, 242);

  // Table Horizontal Dividers
  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(24, 180);
  ctx.lineTo(616, 180);
  ctx.moveTo(24, 220);
  ctx.lineTo(616, 220);
  ctx.moveTo(24, 260);
  ctx.lineTo(616, 260);
  ctx.stroke();

  // Summary Box
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(24, 275, 592, 48);
  ctx.strokeStyle = "#cbd5e1";
  ctx.strokeRect(24, 275, 592, 48);

  ctx.font = "bold 15px Tahoma, Arial, sans-serif";
  ctx.fillStyle = "#0f172a";
  ctx.fillText("جمع کل فاکتور: ۲۲,۰۰۰,۰۰۰ تومان", 580, 305);

  // Green Paid Stamp
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 345, 130, 38);
  ctx.fillStyle = "#059669";
  ctx.font = "bold 14px Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("وضعیت: پرداخت شد", 105, 369);

  return canvas.toDataURL("image/png");
}

export function generateHandwritingPng(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 420;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Soft cream paper background
  ctx.fillStyle = "#fdfbf7";
  ctx.fillRect(0, 0, 640, 420);

  // Blue notebook lines
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  for (let y = 80; y <= 380; y += 38) {
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(610, y);
    ctx.stroke();
  }

  // Margin line
  ctx.strokeStyle = "#fecdd3";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(590, 20);
  ctx.lineTo(590, 400);
  ctx.stroke();

  // Letter contents
  ctx.fillStyle = "#1e293b";
  ctx.textAlign = "center";
  ctx.font = "italic 16px Tahoma, Arial, sans-serif";
  ctx.fillText("بسمه تعالی", 320, 50);

  ctx.textAlign = "right";
  ctx.font = "14px Tahoma, Arial, sans-serif";
  ctx.fillText("تاریخ: ۱۴۰۳/۰۸/۲۵", 570, 75);
  ctx.fillText("شماره: ۳۸۲/ف", 570, 112);

  ctx.font = "bold 14px Tahoma, Arial, sans-serif";
  ctx.fillText("جناب آقای مهندس رضایی، مدیریت محترم غرفه فناوری", 570, 150);

  ctx.font = "14px Tahoma, Arial, sans-serif";
  ctx.fillText("موضوع: اعلام آمادگی همکاری در زمینه هوش مصنوعی", 570, 188);
  ctx.fillText("احتراماً عطف به مذاکرات اخیر در نمایشگاه، بدین‌وسیله آمادگی", 570, 226);
  ctx.fillText("کامل این شرکت جهت پیاده‌سازی زیرساخت‌های هوش مصنوعی سازمانی اعلام می‌گردد.", 570, 264);

  ctx.font = "bold 14px Tahoma, Arial, sans-serif";
  ctx.fillText("با احترام و تشکر - شرکت رایان سیستم", 360, 340);

  return canvas.toDataURL("image/png");
}

export function generateMathIntegralPng(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 360);

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 608, 328);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 18px Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("مسئله ریاضی: انتگرال معین مثلثاتی", 320, 55);

  ctx.fillStyle = "#475569";
  ctx.font = "14px Tahoma, Arial, sans-serif";
  ctx.fillText("مقدار دقیق انتگرال معین زیر را با ذکر مراحل تغییر متغیر محاسبه فرمایید:", 320, 95);

  // Big Formula
  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 32px 'Times New Roman', serif";
  ctx.fillText("I = ∫₀^(π/2)  sin(x) · cos(x) dx", 320, 175);

  // Hint Box
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(60, 230, 520, 80);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 230, 520, 80);

  ctx.fillStyle = "#334155";
  ctx.font = "14px Tahoma, Arial, sans-serif";
  ctx.fillText("راهنما: از تغییر متغیر u = sin(x) یا اتحاد sin(2x) = 2 sin(x) cos(x) استفاده شود.", 320, 275);

  return canvas.toDataURL("image/png");
}

export function generateCircuitPng(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 640, 360);

  ctx.strokeStyle = "#cbd5e1";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, 608, 328);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 18px Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("مسئله فیزیک: تحلیل مدار الکتریکی DC", 320, 50);

  // Circuit Wire
  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 110);
  ctx.lineTo(520, 110);
  ctx.lineTo(520, 230);
  ctx.lineTo(120, 230);
  ctx.closePath();
  ctx.stroke();

  // DC Voltage Source
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(100, 150, 40, 40);
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(105, 160);
  ctx.lineTo(135, 160);
  ctx.moveTo(112, 180);
  ctx.lineTo(128, 180);
  ctx.stroke();
  ctx.fillStyle = "#059669";
  ctx.font = "bold 15px Tahoma, Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("V = ۱۲V", 95, 175);

  // Resistor
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(270, 95, 100, 30);
  ctx.strokeStyle = "#e11d48";
  ctx.lineWidth = 2;
  ctx.strokeRect(270, 95, 100, 30);
  ctx.fillStyle = "#e11d48";
  ctx.font = "bold 14px Tahoma, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("R = ۴ Ω", 320, 116);

  // Questions
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 14px Tahoma, Arial, sans-serif";
  ctx.fillText("مطلوب است: ۱) محاسبه شدت جریان (I)  |  ۲) محاسبه توان اتلافی (P)", 320, 290);

  return canvas.toDataURL("image/png");
}

export function generateQrSamplePng(): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 400, 400);

  const drawFinder = (x: number, y: number) => {
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x, y, 70, 70);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 10, y + 10, 50, 50);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 20, y + 20, 30, 30);
  };

  drawFinder(40, 40);
  drawFinder(290, 40);
  drawFinder(40, 290);

  // Random pixel blocks
  ctx.fillStyle = "#0f172a";
  const seed = [
    [130, 40, 20, 20], [170, 40, 40, 20], [230, 40, 30, 20],
    [130, 80, 40, 20], [190, 80, 20, 20], [230, 80, 40, 20],
    [40, 130, 20, 40], [80, 130, 20, 20], [130, 130, 50, 50],
    [210, 130, 30, 20], [270, 130, 40, 40], [330, 130, 30, 30],
    [40, 190, 30, 20], [100, 190, 20, 40], [150, 200, 30, 30],
    [200, 190, 40, 20], [260, 200, 30, 40], [320, 190, 40, 20],
    [130, 270, 40, 30], [190, 270, 30, 20], [240, 270, 40, 40],
    [130, 320, 20, 40], [170, 330, 40, 20], [230, 330, 30, 30],
    [290, 310, 30, 40], [340, 320, 20, 30]
  ];

  for (const [bx, by, bw, bh] of seed) {
    ctx.fillRect(bx, by, bw, bh);
  }

  return canvas.toDataURL("image/png");
}

// -------------------------------------------------------------
// DEMO PRESETS DEFINITION
// -------------------------------------------------------------

export const ALL_DEMO_PRESETS: Record<"ocr" | "pdf_chat" | "qr" | "math" | "url" | "chat", DemoPreset[]> = {
  ocr: [
    {
      label: "🧾 فاکتور رسمی",
      icon: "🧾",
      tool: "ocr",
      fileName: "فاکتور_فروش.png",
      mimeType: "image/png",
      getCanvasImage: generateInvoicePng,
      textInput: "فاکتور فروش کالا و خدمات\nشماره: ۱۴۰۳-۸۹۲ | تاریخ: ۱۴۰۳/۰۸/۲۵\n۱. وب‌کم کنفرانس ۴K: ۱۲,۵۰۰,۰۰۰ تومان\n۲. میکروفون بی‌سیم: ۸,۴۰۰,۰۰۰ تومان\n۳. کابل رابط پرسرعت: ۱,۱۰۰,۰۰۰ تومان\nجمع کل: ۲۲,۰۰۰,۰۰۰ تومان\nوضعیت: پرداخت شد",
    },
    {
      label: "📝 نامه اداری",
      icon: "📝",
      tool: "ocr",
      fileName: "نامه_اداری.png",
      mimeType: "image/png",
      getCanvasImage: generateHandwritingPng,
      textInput: "بسمه تعالی\nتاریخ: ۱۴۰۳/۰۸/۲۵ | شماره: ۳۸۲/ف\nجناب آقای مهندس رضایی، مدیریت محترم غرفه فناوری\nموضوع: اعلام آمادگی همکاری در زمینه هوش مصنوعی\nاحتراماً عطف به مذاکرات اخیر در نمایشگاه، بدین‌وسیله آمادگی کامل جهت پیاده‌سازی سامانه‌های هوشمند اعلام می‌گردد.\nبا احترام - شرکت رایان سیستم",
    },
  ],
  math: [
    {
      label: "📐 انتگرال معین",
      icon: "📐",
      tool: "math",
      fileName: "انتگرال_مثلثاتی.png",
      mimeType: "image/png",
      getCanvasImage: generateMathIntegralPng,
      textInput: "مسئله: محاسبه مقدار دقیق انتگرال معین مثلثاتی زیر با روش تغییر متغیر:\nI = ∫₀^(π/2) sin(x) · cos(x) dx",
    },
    {
      label: "⚡ مدار الکتریکی",
      icon: "⚡",
      tool: "math",
      fileName: "مدار_الکتریکی_DC.png",
      mimeType: "image/png",
      getCanvasImage: generateCircuitPng,
      textInput: "مسئله مدار الکتریکی DC با ولتاژ منبع ۱۲ ولت و مقاومت ۴ اهم. مطلوب است: ۱) شدت جریان مدار ۲) توان اتلافی مقاومت.",
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
      mimeType: "image/png",
      getCanvasImage: generateQrSamplePng,
      textInput: "کد QR وبسایت هوش مصنوعی: https://achar.ai",
    },
    {
      label: "📶 تولید QR وای‌فای",
      icon: "📶",
      tool: "qr",
      textInput: "WIFI:S:Exhibition_VIP;T:WPA;P:Achar2026;;",
    },
  ],
  chat: [
    {
      label: "🧭 راهنمای ابزارها",
      icon: "🧭",
      tool: "chat",
      textInput: "برای خواندن و استخراج جدول از عکس فاکتور خرید، کدام بخش برنامه را پیشنهاد می‌دهید؟",
    },
    {
      label: "❓ معرفی آچار AI",
      icon: "❓",
      tool: "chat",
      textInput: "جعبه‌ابزار آچار چه امکاناتی دارد و هر بخش چه کمکی به من می‌کند؟",
    },
    {
      label: "💡 سوال فناوری",
      icon: "💡",
      tool: "chat",
      textInput: "تفاوت هوش مصنوعی پردازش تصویر با مدل‌های متنی چیست؟",
    },
  ],
};
