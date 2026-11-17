"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  ScanText,
  FileText,
  QrCode,
  Calculator,
  Globe,
  Settings,
  Lock,
  Key,
  Check,
  Copy,
  Upload,
  X,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronRight,
  FileUp,
  CheckCircle2,
  Download,
  Share2,
  Volume2,
  Square,
  History,
  Trash2,
  Camera,
  ShieldCheck,
  Clock,
  Palette,
  Mic,
  MicOff,
  Smartphone,
  Zap,
  MessageSquareText,
  Link2,
  ExternalLink,
  Scissors,
  MousePointerClick,
  BarChart3,
} from "lucide-react";

// ==========================================
// Types & Constants
// ==========================================
type ToolId = "ocr" | "pdf_chat" | "qr" | "math" | "url" | "chat" | "shortener";

interface ToolItem {
  id: ToolId;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  accept: string;
}

interface HistoryItem {
  id: string;
  tool: ToolId;
  toolName: string;
  timestamp: number;
  previewInput: string;
  result: string;
  durationMs?: number;
  modelUsed?: string;
}

import { ALL_DEMO_PRESETS, DemoPreset } from "./presets-data";

// 1. Five Core Tools
const TOOLS: ToolItem[] = [
  {
    id: "ocr",
    name: "AI OCR",
    subtitle: "استخراج متن",
    description: "تبدیل اسناد، فاکتورها و تصاویر به متن با حفظ قالب.",
    icon: ScanText,
    tag: "Vision",
    dropzoneTitle: "تصویر یا سند را اینجا رها کنید",
    dropzoneSubtitle: "JPG، PNG یا WEBP تا ۱۵ مگابایت",
    accept: "image/*",
  },
  {
    id: "pdf_chat",
    name: "Chat with PDF",
    subtitle: "تحلیل اسناد",
    description: "پرسش، پاسخ و استخراج نکات از اسناد PDF و متنی.",
    icon: FileText,
    tag: "Document",
    dropzoneTitle: "فایل PDF یا TXT را اینجا رها کنید",
    dropzoneSubtitle: "تحلیل معنایی و گفت‌وگو درباره سند",
    accept: ".pdf,.txt,application/pdf,text/plain",
  },
  {
    id: "qr",
    name: "AI QR Code",
    subtitle: "بارکد و QR",
    description: "رمزگشایی، بررسی سلامت لینک و ساخت کد QR دلخواه.",
    icon: QrCode,
    tag: "Utility",
    dropzoneTitle: "تصویر کد QR را رها کنید",
    dropzoneSubtitle: "رمزگشایی فوری یا ساخت کد جدید",
    accept: "image/*",
  },
  {
    id: "math",
    name: "Math Solver",
    subtitle: "حل مسئله",
    description: "حل گام‌به‌گام معادلات، انتگرال و مسائل فیزیک.",
    icon: Calculator,
    tag: "Reasoning",
    dropzoneTitle: "تصویر فرمول یا مسئله را آپلود کنید",
    dropzoneSubtitle: "دست‌نویس یا چاپی با حل تشریحی",
    accept: "image/*",
  },
  {
    id: "url",
    name: "URL Summarizer",
    subtitle: "خلاصه وب",
    description: "خلاصه‌سازی فوری صفحات وب در ۳ نکته کلیدی.",
    icon: Globe,
    tag: "Synthesis",
    dropzoneTitle: "نشانی وب را وارد کنید",
    dropzoneSubtitle: "استخراج سریع نکات مهم صفحه",
    accept: "",
  },
  {
    id: "chat",
    name: "AI Concierge",
    subtitle: "دستیار و راهنما",
    description: "پاسخ به سوالات و هدایت هوشمند مشتری به ابزارهای برنامه.",
    icon: MessageSquareText,
    tag: "Guide",
    dropzoneTitle: "گفت‌وگو با دستیار راهنما",
    dropzoneSubtitle: "پرسش و راهنمایی مستقیم درباره امکانات جعبه‌ابزار",
    accept: "",
  },
  {
    id: "shortener",
    name: "URL Shortener",
    subtitle: "کوتاه‌کننده لینک",
    description: "کوتاه‌سازی سریع پیوندها با نام مستعار هوشمند، بارکد QR و آمار کلیک.",
    icon: Link2,
    tag: "Utility",
    dropzoneTitle: "نشانی وب را برای کوتاه‌سازی وارد کنید",
    dropzoneSubtitle: "تبدیل لینک‌های طولانی به پیوندهای کوتاه، شیک و قابل رهگیری",
    accept: "",
  },
];

// 2. Instant Demo Presets (نمونه‌های غنی و تصویری آماده تست سریع)
const DEMO_PRESETS = ALL_DEMO_PRESETS;

const STORAGE_API_KEY = "achar_api_key";
const STORAGE_MODEL_KEY = "achar_model";
const STORAGE_ADMIN_PIN = "achar_admin_pin";
const STORAGE_HISTORY = "achar_history_v1";

const DEFAULT_PIN = "1234";
const DEFAULT_MODEL = "gemini-3.1-flash-lite";

// Simple Markdown Renderer for Apple Minimalist Output
function FormattedOutput({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-right leading-relaxed select-text" dir="rtl">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Heading 3 / 2
        if (trimmed.startsWith("### ")) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm sm:text-base mt-4 mb-1">
              {trimmed.replace(/^###\s+/, "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3 key={idx} className="font-bold text-slate-900 text-base sm:text-lg mt-5 mb-1.5 border-b border-slate-200/60 pb-1">
              {trimmed.replace(/^##\s+/, "")}
            </h3>
          );
        }

        // Horizontal Rule
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={idx} className="my-3 border-slate-200/80" />;
        }

        // Bullet list
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
          const bulletText = trimmed.replace(/^[\*\-•]\s+/, "");
          const parts = bulletText.split(/(\*\*[^*]+\*\*)/g);
          return (
            <div key={idx} className="flex items-start gap-2 pr-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
              <p className="text-slate-700 text-xs sm:text-sm">
                {parts.map((p, pIdx) => {
                  if (p.startsWith("**") && p.endsWith("**")) {
                    return (
                      <strong key={pIdx} className="font-semibold text-slate-900">
                        {p.slice(2, -2)}
                      </strong>
                    );
                  }
                  return p;
                })}
              </p>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Normal paragraph with bold support
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={idx} className="text-slate-700 text-xs sm:text-sm">
            {parts.map((p, pIdx) => {
              if (p.startsWith("**") && p.endsWith("**")) {
                return (
                  <strong key={pIdx} className="font-semibold text-slate-900">
                    {p.slice(2, -2)}
                  </strong>
                );
              }
              return p;
            })}
          </p>
        );
      })}

      {/* Pulsing cursor while streaming */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-blue-600 rounded-sm ml-1 animate-pulse align-middle" />
      )}
    </div>
  );
}

// ==========================================
// Main Page Component
// ==========================================
export default function AcharAIPage() {
  // Navigation & Tool Selection
  const [activeTool, setActiveTool] = useState<ToolId>("ocr");

  // Admin Modal & BYOK State
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>(DEFAULT_PIN);
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [isPinAuthenticated, setIsPinAuthenticated] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);
  const [failedPinAttempts, setFailedPinAttempts] = useState<number>(0);
  const [lockoutRemainingSec, setLockoutRemainingSec] = useState<number>(0);

  const [storedApiKey, setStoredApiKey] = useState<string>("");
  const [customKeyInput, setCustomKeyInput] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [tempModel, setTempModel] = useState<string>(DEFAULT_MODEL);
  const [newPinInput, setNewPinInput] = useState<string>("");
  const [showKeySecret, setShowKeySecret] = useState<boolean>(false);
  const [keySaveSuccess, setKeySaveSuccess] = useState<boolean>(false);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  const [testKeyFeedback, setTestKeyFeedback] = useState<string | null>(null);

  // File & Input State
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [textInput, setTextInput] = useState<string>("");
  const [urlInput, setUrlInput] = useState<string>("");
  const [qrMode, setQrMode] = useState<"scan" | "generate">("scan");
  const [qrContent, setQrContent] = useState<string>("https://achar.ai");
  const [qrColor, setQrColor] = useState<string>("0f172a");

  // URL Shortener State
  const [shortenerUrl, setShortenerUrl] = useState<string>("");
  const [shortenerCustomSlug, setShortenerCustomSlug] = useState<string>("");
  const [shortenerCreatedLink, setShortenerCreatedLink] = useState<{
    code: string;
    originalUrl: string;
    title?: string;
    description?: string;
    clicks: number;
    shortUrl: string;
  } | null>(null);
  const [shortenerRecentLinks, setShortenerRecentLinks] = useState<any[]>([]);
  const [isShortening, setIsShortening] = useState<boolean>(false);
  const [isAiSlugLoading, setIsAiSlugLoading] = useState<boolean>(false);
  const [copiedShortUrl, setCopiedShortUrl] = useState<string | null>(null);

  // Output & Execution State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [usedModelBadge, setUsedModelBadge] = useState<string | null>(null);
  const [durationMsBadge, setDurationMsBadge] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Audio TTS State
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);

  // Speech-to-Text (Voice Input) State
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);

  // Send to Mobile QR Modal
  const [isMobileQrOpen, setIsMobileQrOpen] = useState<boolean>(false);

  // History Drawer State
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Load persistent configurations on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedKey = localStorage.getItem(STORAGE_API_KEY) || "";
      let savedModel = localStorage.getItem(STORAGE_MODEL_KEY) || DEFAULT_MODEL;
      // Upgrade from slow/throttled 3.5-flash to ultra-fast 3.1-flash-lite
      if (savedModel === "gemini-3.5-flash") {
        savedModel = DEFAULT_MODEL;
        localStorage.setItem(STORAGE_MODEL_KEY, DEFAULT_MODEL);
      }
      const savedPin = localStorage.getItem(STORAGE_ADMIN_PIN) || DEFAULT_PIN;
      setStoredApiKey(savedKey);
      setCustomKeyInput(savedKey);
      setSelectedModel(savedModel);
      setTempModel(savedModel);
      setAdminPin(savedPin);

      try {
        const savedHistory = localStorage.getItem(STORAGE_HISTORY);
        if (savedHistory) {
          setHistoryItems(JSON.parse(savedHistory));
        }
      } catch (err) {
        console.warn("Could not read history", err);
      }

      fetchShortLinks();
    }
  }, []);

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockoutRemainingSec <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemainingSec((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemainingSec]);

  // Handle Tool Change
  const handleSelectTool = (toolId: ToolId) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setActiveTool(toolId);
    setFile(null);
    setFilePreview(null);
    setFileBase64(null);
    setTextInput("");
    setErrorMessage(null);
    stopSpeech();
    setIsStreaming(false);
    if (toolId === "shortener") {
      fetchShortLinks();
    }
  };

  // Convert uploaded File to Base64 data
  const handleProcessFile = (selectedFile: File) => {
    setFile(selectedFile);
    setErrorMessage(null);
    const resolvedMime = selectedFile.type || "application/octet-stream";
    setMimeType(resolvedMime);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (resolvedMime.startsWith("image/")) {
        setFilePreview(dataUrl);
      } else {
        setFilePreview(null);
      }
      const base64Clean = dataUrl.split(",")[1] || dataUrl;
      setFileBase64(base64Clean);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Drag and Drop Events
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  }, []);

  // Admin PIN Submit with Brute-Force Lockout Defense
  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (lockoutRemainingSec > 0) return;

    if (enteredPin.trim() === adminPin) {
      setIsPinAuthenticated(true);
      setPinError(false);
      setEnteredPin("");
      setFailedPinAttempts(0);
    } else {
      const newAttempts = failedPinAttempts + 1;
      setFailedPinAttempts(newAttempts);
      setPinError(true);
      setEnteredPin("");

      if (newAttempts >= 4) {
        setLockoutRemainingSec(30);
      }
    }
  };

  // Save Custom Key, Model & optional new PIN to LocalStorage
  const handleSaveCustomKey = () => {
    const trimmedKey = customKeyInput.trim();
    if (trimmedKey) {
      localStorage.setItem(STORAGE_API_KEY, trimmedKey);
      setStoredApiKey(trimmedKey);
    } else {
      localStorage.removeItem(STORAGE_API_KEY);
      setStoredApiKey("");
    }

    localStorage.setItem(STORAGE_MODEL_KEY, tempModel);
    setSelectedModel(tempModel);

    if (newPinInput.trim().length >= 4) {
      localStorage.setItem(STORAGE_ADMIN_PIN, newPinInput.trim());
      setAdminPin(newPinInput.trim());
      setNewPinInput("");
    }

    setKeySaveSuccess(true);
    setTimeout(() => {
      setKeySaveSuccess(false);
      setIsAdminOpen(false);
      setIsPinAuthenticated(false);
    }, 750);
  };

  // Test API Key Live
  const handleTestKey = async () => {
    setIsTestingKey(true);
    setTestKeyFeedback(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "url",
          url: "https://example.com",
          apiKey: customKeyInput.trim() || undefined,
          model: tempModel,
          stream: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTestKeyFeedback("اتصال با موفقیت تأیید شد.");
      } else {
        setTestKeyFeedback(`خطا: ${data.error}`);
      }
    } catch {
      setTestKeyFeedback("خطا در برقراری ارتباط با سرور.");
    } finally {
      setIsTestingKey(false);
    }
  };

  // Clear Custom Key
  const handleClearCustomKey = () => {
    localStorage.removeItem(STORAGE_API_KEY);
    setStoredApiKey("");
    setCustomKeyInput("");
  };

  // Copy Result Text
  const handleCopy = () => {
    if (responseOutput) {
      navigator.clipboard.writeText(responseOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Download Output as .txt File
  const handleDownloadTxt = () => {
    if (!responseOutput) return;
    const blob = new Blob([responseOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ACHAR-AI_${activeTool}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Native Web Share API
  const handleShare = async () => {
    if (!responseOutput) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ACHAR AI (${activeTool})`,
          text: responseOutput,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  // Persian Text-to-Speech (TTS)
  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("مرورگر شما از پخش صوتی پشتیبانی نمی‌کند.");
      return;
    }

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    if (!responseOutput) return;

    window.speechSynthesis.cancel();
    const cleanSpeechText = responseOutput
      .replace(/[#*`_~]/g, "")
      .replace(/https?:\/\/\S+/g, "لینک وب");

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = "fa-IR";
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingTTS(true);
  };

  const stopSpeech = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTTS(false);
  };

  // Voice Input / Speech-to-Text
  const handleToggleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("تشخیص گفتار در این مرورگر پشتیبانی نمی‌شود. لطفاً از مرورگر Chrome استفاده کنید.");
      return;
    }

    if (isListeningVoice) {
      setIsListeningVoice(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "fa-IR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          if (activeTool === "url") {
            setUrlInput(transcript);
          } else if (activeTool === "shortener") {
            setShortenerUrl(transcript);
          } else {
            setTextInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        }
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch {
      setIsListeningVoice(false);
    }
  };

  // ITEM 2: Apply Instant Demo Preset (اعمال نمونه‌های آماده با رندر Canvas واقعی و بدون خطا)
  const handleApplyPreset = (preset: DemoPreset) => {
    setErrorMessage(null);
    stopSpeech();

    let resolvedBase64: string | null = preset.fileBase64 || null;
    let resolvedMime = preset.mimeType || "image/png";
    let previewUrl: string | null = preset.filePreview || null;

    // Generate real PNG directly from browser canvas to guarantee 100% Persian font readability
    if (preset.getCanvasImage && typeof window !== "undefined") {
      try {
        const canvasDataUrl = preset.getCanvasImage();
        if (canvasDataUrl && canvasDataUrl.startsWith("data:image/png")) {
          previewUrl = canvasDataUrl;
          resolvedBase64 = canvasDataUrl.split(",")[1];
          resolvedMime = "image/png";
        }
      } catch (err) {
        console.warn("Canvas generation error", err);
      }
    }

    // 1. Visually and logically attach file/image so user sees it in dropzone
    if (resolvedBase64) {
      setFileBase64(resolvedBase64);
      setMimeType(resolvedMime);
      setFilePreview(previewUrl || `data:${resolvedMime};base64,${resolvedBase64}`);
      setFile({ name: preset.fileName || "سند_نمونه.png", size: 48000 } as any);
    } else if (preset.isPdfMock) {
      setFile({ name: preset.fileName || "قرارداد_نمونه.pdf", size: 84200 } as any);
      setFilePreview(null);
      setFileBase64(null);
    } else {
      setFile(null);
      setFilePreview(null);
      setFileBase64(null);
    }

    if (preset.textInput !== undefined) {
      setTextInput(preset.textInput);
    } else {
      setTextInput("");
    }

    if (preset.url !== undefined) {
      setUrlInput(preset.url);
    } else {
      setUrlInput("");
    }

    if (activeTool === "qr") {
      if (resolvedBase64) {
        setQrMode("scan");
      } else {
        setQrMode("generate");
        if (preset.textInput) setQrContent(preset.textInput);
      }
    }

    if (activeTool === "shortener") {
      const targetUrl = preset.url || "";
      const targetSlug = preset.textInput || "";
      setShortenerUrl(targetUrl);
      setShortenerCustomSlug(targetSlug);
      setTimeout(() => {
        handleCreateShortLink(targetUrl, targetSlug);
      }, 100);
      return;
    }

    // 2. Execute analysis immediately with full data
    setTimeout(() => {
      handleAnalyzeWithCustomData({
        url: preset.url || "",
        textInput: preset.textInput || "",
        fileBase64: resolvedBase64,
        mimeType: resolvedMime,
        label: preset.label,
      });
    }, 120);
  };

  // Add Item to History
  const saveToHistory = (item: HistoryItem) => {
    setHistoryItems((prev) => {
      const updated = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 15);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_HISTORY, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_HISTORY);
    }
  };

  // URL Shortener Handlers
  const fetchShortLinks = async () => {
    try {
      const res = await fetch("/api/shorten");
      const data = await res.json();
      if (data.success && Array.isArray(data.links)) {
        setShortenerRecentLinks(data.links);
      }
    } catch (err) {
      console.warn("Could not fetch short links", err);
    }
  };

  const handleCreateShortLink = async (overrideUrl?: string, overrideSlug?: string) => {
    const targetUrl = (overrideUrl !== undefined ? overrideUrl : shortenerUrl).trim();
    const targetSlug = (overrideSlug !== undefined ? overrideSlug : shortenerCustomSlug).trim();

    if (!targetUrl) {
      setErrorMessage("لطفاً نشانی اینترنتی (URL) را وارد کنید.");
      return;
    }

    setIsShortening(true);
    setErrorMessage(null);

    try {
      const clientKey = typeof window !== "undefined" ? localStorage.getItem(STORAGE_API_KEY) || "" : "";
      const modelToUse = typeof window !== "undefined" ? localStorage.getItem(STORAGE_MODEL_KEY) || DEFAULT_MODEL : DEFAULT_MODEL;

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          customSlug: targetSlug || undefined,
          aiSlug: !targetSlug,
          generateAiMeta: true,
          apiKey: clientKey,
          model: modelToUse,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "خطا در ساخت پیوند کوتاه");
      }

      const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
      const proto = typeof window !== "undefined" ? window.location.protocol : "http:";
      const fullShortUrl = `${proto}//${host}/s/${data.link.code}`;

      const created = {
        code: data.link.code,
        originalUrl: data.link.originalUrl,
        title: data.link.title,
        description: data.link.description,
        clicks: data.link.clicks || 0,
        shortUrl: fullShortUrl,
      };

      setShortenerCreatedLink(created);
      fetchShortLinks();

      const summaryText = `پیوند با موفقیت کوتاه‌سازی شد.\n\n🔗 پیوند کوتاه: ${fullShortUrl}\n🌐 پیوند اصلی: ${data.link.originalUrl}${data.link.title ? `\n📌 عنوان: ${data.link.title}` : ""}${data.link.description ? `\n📝 توضیح: ${data.link.description}` : ""}\n\nجهت کپی یا اسکن کد QR از بخش زیر استفاده کنید.`;
      setResponseOutput(summaryText);
      setUsedModelBadge("URL Shortener");
      setDurationMsBadge(120);

      saveToHistory({
        id: String(Date.now()),
        tool: "shortener",
        toolName: "URL Shortener",
        timestamp: Date.now(),
        previewInput: targetUrl,
        result: summaryText,
        durationMs: 120,
        modelUsed: "ACHAR Shortener",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "خطا در ساخت پیوند کوتاه.");
    } finally {
      setIsShortening(false);
    }
  };

  const handleGenerateAiSlug = async () => {
    const targetUrl = shortenerUrl.trim();
    if (!targetUrl) {
      setErrorMessage("لطفاً ابتدا نشانی وب را وارد کنید تا نام مستعار هوشمند تولید شود.");
      return;
    }

    setIsAiSlugLoading(true);
    setErrorMessage(null);

    try {
      const clientKey = typeof window !== "undefined" ? localStorage.getItem(STORAGE_API_KEY) || "" : "";
      const modelToUse = typeof window !== "undefined" ? localStorage.getItem(STORAGE_MODEL_KEY) || DEFAULT_MODEL : DEFAULT_MODEL;

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          aiSlug: true,
          generateAiMeta: true,
          apiKey: clientKey,
          model: modelToUse,
        }),
      });

      const data = await res.json();
      if (data.success && data.link) {
        setShortenerCustomSlug(data.link.code);
        const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
        const proto = typeof window !== "undefined" ? window.location.protocol : "http:";
        setShortenerCreatedLink({
          ...data.link,
          shortUrl: `${proto}//${host}/s/${data.link.code}`,
        });
        fetchShortLinks();
      }
    } catch (err: any) {
      setErrorMessage("خطا در ایجاد نام مستعار هوشمند.");
    } finally {
      setIsAiSlugLoading(false);
    }
  };

  const handleDeleteShortLink = async (code: string) => {
    try {
      const res = await fetch(`/api/shorten?code=${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        if (shortenerCreatedLink?.code === code) {
          setShortenerCreatedLink(null);
        }
        fetchShortLinks();
      }
    } catch (err) {
      console.warn("Could not delete short link", err);
    }
  };

  const handleCopyShortUrl = (url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedShortUrl(url);
      setTimeout(() => setCopiedShortUrl(null), 2000);
    }
  };

  // ITEM 1: Live Typewriter Streaming Execution
  const handleAnalyzeWithCustomData = async (customOverrides?: {
    url?: string;
    textInput?: string;
    fileBase64?: string | null;
    mimeType?: string;
    label?: string;
  }) => {
    stopSpeech();

    const currentUrl = customOverrides?.url !== undefined ? customOverrides.url : urlInput;
    const currentText = customOverrides?.textInput !== undefined ? customOverrides.textInput : textInput;
    const currentBase64 = customOverrides?.fileBase64 !== undefined ? customOverrides.fileBase64 : fileBase64;
    const currentMime = customOverrides?.mimeType || mimeType;

    // Validation
    if (activeTool === "url" && !currentUrl.trim()) {
      setErrorMessage("لطفاً نشانی وب یا متن را وارد کنید.");
      return;
    }

    if (activeTool === "chat" && !currentText.trim()) {
      setErrorMessage("لطفاً سوال یا پیام خود را برای دستیار بنویسید.");
      return;
    }

    if (activeTool !== "url" && activeTool !== "qr" && activeTool !== "chat" && activeTool !== "shortener" && !currentBase64 && !currentText.trim()) {
      setErrorMessage("لطفاً فایلی بارگذاری کنید یا متنی بنویسید.");
      return;
    }

    if (activeTool === "qr" && qrMode === "scan" && !currentBase64) {
      setErrorMessage("لطفاً تصویر کد QR را بارگذاری کنید.");
      return;
    }

    if (activeTool === "qr" && qrMode === "generate") {
      const qrResult = `کد QR با موفقیت ایجاد شد.\nمحتوا:\n${qrContent}\n\nجهت ذخیره تصویر از دکمه دانلود استفاده کنید.`;
      setResponseOutput(qrResult);
      setUsedModelBadge("مرورگر");
      setDurationMsBadge(25);
      return;
    }

    setIsLoading(true);
    setIsStreaming(true);
    setErrorMessage(null);
    setResponseOutput("");
    setUsedModelBadge(null);
    setDurationMsBadge(null);

    // Prepare abort controller for cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const clientKey = typeof window !== "undefined" ? localStorage.getItem(STORAGE_API_KEY) || "" : "";
      const modelToUse = typeof window !== "undefined" ? localStorage.getItem(STORAGE_MODEL_KEY) || DEFAULT_MODEL : DEFAULT_MODEL;

      const payload = {
        tool: activeTool,
        fileBase64: currentBase64 || null,
        mimeType: currentMime,
        apiKey: clientKey,
        model: modelToUse,
        prompt: currentText.trim(),
        textInput: currentText.trim(),
        url: currentUrl.trim(),
        stream: true, // Enable SSE Live Typewriter Streaming
      };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(clientKey ? { "x-api-key": clientKey } : {}),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `خطا در برقراری ارتباط با سرویس (${res.status})`);
      }

      // Check if response is stream
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let finalModel = modelToUse;
        let finalDuration = 0;

        // Smooth scroll to output card once stream starts
        setTimeout(() => {
          outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(line.replace(/^data:\s*/, ""));
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setResponseOutput(accumulatedText);
                }
                if (parsed.done) {
                  if (parsed.modelUsed) finalModel = parsed.modelUsed;
                  if (parsed.durationMs) finalDuration = parsed.durationMs;
                }
                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch {
                // Ignore SSE framing artifacts
              }
            }
          }
        }

        setUsedModelBadge(finalModel);
        if (finalDuration) setDurationMsBadge(finalDuration);

        // Save to History
        if (accumulatedText) {
          saveToHistory({
            id: String(Date.now()),
            tool: activeTool,
            toolName: TOOLS.find((t) => t.id === activeTool)?.name || activeTool,
            timestamp: Date.now(),
            previewInput: customOverrides?.label || file?.name || currentUrl || currentText || "ورودی مستقیم",
            result: accumulatedText,
            durationMs: finalDuration,
            modelUsed: finalModel,
          });
        }
      } else {
        // Fallback for regular JSON
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        setResponseOutput(data.result);
        setUsedModelBadge(data.modelUsed || modelToUse);
        if (data.durationMs) setDurationMsBadge(data.durationMs);
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        setErrorMessage("پردازش متوقف شد.");
      } else {
        setErrorMessage(err.message || "خطا در پردازش رخ داد.");
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const currentTool = TOOLS.find((t) => t.id === activeTool)!;
  const currentPresets = DEMO_PRESETS[activeTool] || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600/10 selection:text-blue-700 antialiased flex flex-col justify-between">
      {/* ============================================================
          1. Header (Apple-Style Minimalist Bar with Telemetry)
      ============================================================ */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-50/80 border-b border-slate-200/70 transition-all">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5">
              <Wrench className="w-5 h-5 text-blue-400 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-slate-900">ACHAR AI</span>
                <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600">
                  Toolbox
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">جعبه‌ابزار هوشمند</p>
            </div>
          </div>

          {/* Right Action Icons: Key, History, Settings */}
          <div className="flex items-center gap-2.5">
            {/* History Pill */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200/80 shadow-sm transition-colors text-slate-700"
              title="تاریخچه تحلیل‌ها"
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">تاریخچه</span>
              {historyItems.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {historyItems.length}
                </span>
              )}
            </button>

            {/* Key Status Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                storedApiKey
                  ? "bg-blue-50 text-blue-700 border-blue-200/60"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  storedApiKey ? "bg-blue-600" : "bg-emerald-500 animate-pulse"
                }`}
              />
              <span className="hidden sm:inline">
                {storedApiKey ? "کلید اختصاصی" : "متصل به Gemini"}
              </span>
              <span className="sm:hidden">{storedApiKey ? "کلید" : "Gemini"}</span>
            </div>

            {/* Gear (Settings) Icon Button */}
            <button
              onClick={() => {
                setIsAdminOpen(true);
                setIsPinAuthenticated(false);
                setPinError(false);
                setEnteredPin("");
                setTestKeyFeedback(null);
              }}
              aria-label="Admin Settings"
              title="تنظیمات ادمین"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200/80 transition-all duration-150"
            >
              <Settings className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================
          2. Hero Section
      ============================================================ */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/80 text-slate-600 text-xs shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">هوش مصنوعی چندحالته</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            ابزارهای هوشمند، ساده و بی‌نقص
          </h1>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-slate-500 leading-relaxed">
            پردازش اسناد، تصاویر، کد QR، کوتاه‌سازی لینک، معادلات و گفت‌وگو با دستیار راهنما با استریمینگ لحظه‌ای.
          </p>
        </motion.div>
      </section>

      {/* ============================================================
          3. Tools Grid (7 Selectable Tools)
      ============================================================ */}
      <section className="max-w-6xl mx-auto px-6 py-4 w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeTool === tool.id;

            return (
              <motion.button
                key={tool.id}
                onClick={() => handleSelectTool(tool.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`relative text-left p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between h-44 ${
                  isSelected
                    ? "bg-white border-2 border-blue-600 shadow-sm ring-4 ring-blue-600/5"
                    : "bg-white/90 hover:bg-white border border-slate-200/80 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {tool.tag}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm">{tool.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{tool.subtitle}</p>
                </div>

                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {tool.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ============================================================
          ITEM 2: Instant Demo Presets Bar (نمونه‌های آماده تست سریع)
      ============================================================ */}
      {currentPresets.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pt-2 pb-1 w-full" dir="rtl">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              نمونه‌ها:
            </span>
            <div className="flex gap-2 shrink-0">
              {currentPresets.map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
                >
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          4. Universal Dropzone & Active Tool Card
      ============================================================ */}
      <main className="max-w-3xl mx-auto px-6 py-4 w-full space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          {/* Header of Active Tool */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <currentTool.icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentTool.name}</span>
                  <span className="text-xs font-normal text-slate-300">|</span>
                  <span className="text-xs font-medium text-slate-500">{currentTool.subtitle}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{currentTool.description}</p>
              </div>
            </div>

            {/* Special QR Mode Switch */}
            {activeTool === "qr" && (
              <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center text-xs">
                <button
                  type="button"
                  onClick={() => setQrMode("scan")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    qrMode === "scan"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  اسکن و تحلیل
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode("generate")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    qrMode === "generate"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  ساخت QR
                </button>
              </div>
            )}
          </div>

          {/* DYNAMIC INPUTS ACCORDING TO TOOL */}

          {/* A. QR Generator View with Color Selector */}
          {activeTool === "qr" && qrMode === "generate" ? (
            <div className="space-y-5">
              <div className="space-y-2 text-right" dir="rtl">
                <label className="text-xs font-semibold text-slate-700 block">
                  پیوند یا متن دلخواه:
                </label>
                <input
                  type="text"
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                  placeholder="https://achar.ai یا متن دلخواه..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-left"
                />
              </div>

              {/* Color Customizer */}
              <div className="flex items-center justify-between text-xs px-1" dir="rtl">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-600" />
                  رنگ:
                </span>
                <div className="flex gap-2">
                  {[
                    { label: "مشکی", hex: "0f172a", bg: "bg-slate-900" },
                    { label: "آبی", hex: "2563eb", bg: "bg-blue-600" },
                    { label: "زمردی", hex: "059669", bg: "bg-emerald-600" },
                    { label: "یاقوتی", hex: "e11d48", bg: "bg-rose-600" },
                  ].map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setQrColor(color.hex)}
                      className={`w-6 h-6 rounded-full ${color.bg} transition-transform ${
                        qrColor === color.hex ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Instant QR Display */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-50/70 border border-slate-200/70 rounded-2xl space-y-4">
                <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-slate-200">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=${qrColor}&data=${encodeURIComponent(
                      qrContent || "ACHAR AI"
                    )}`}
                    alt="Generated Smart QR"
                    className="w-44 h-44 rounded-lg object-contain"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xs font-medium text-slate-700">پیش‌نمایش کد</p>
                  <p className="text-[11px] text-slate-400">آماده برای اسکن</p>
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&color=${qrColor}&data=${encodeURIComponent(
                      qrContent || "ACHAR AI"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>دانلود QR</span>
                  </a>
                </div>
              </div>
            </div>
          ) : activeTool === "url" ? (
            /* B. URL Summarizer View with Voice Input */
            <div className="space-y-3 text-right" dir="rtl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 block">
                  پیوند صفحه وب یا متن:
                </label>
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`text-xs font-medium flex items-center gap-1 px-2.5 py-0.5 rounded-lg border transition-all ${
                    isListeningVoice
                      ? "bg-rose-50 text-rose-600 border-rose-300 animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent"
                  }`}
                  title="ورودی صوتی فارسی"
                >
                  {isListeningVoice ? <MicOff className="w-3 h-3 text-rose-600" /> : <Mic className="w-3 h-3 text-blue-600" />}
                  <span>{isListeningVoice ? "در حال ضبط..." : "صدا"}</span>
                </button>
              </div>

              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com یا نشانی مقاله..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-left"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                خلاصه‌سازی فوری در ۳ نکته کلیدی.
              </p>
            </div>
          ) : activeTool === "chat" ? (
            /* C. AI Concierge & Smart Guide View with Quick Tool Navigation */
            <div className="space-y-4 text-right" dir="rtl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 block">
                  پرسش، راهنمایی یا سوال درباره ابزارها:
                </label>
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  className={`text-xs font-medium flex items-center gap-1 px-2.5 py-0.5 rounded-lg border transition-all ${
                    isListeningVoice
                      ? "bg-rose-50 text-rose-600 border-rose-300 animate-pulse"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent"
                  }`}
                  title="ورودی صوتی فارسی"
                >
                  {isListeningVoice ? <MicOff className="w-3 h-3 text-rose-600" /> : <Mic className="w-3 h-3 text-blue-600" />}
                  <span>{isListeningVoice ? "در حال ضبط..." : "صدا"}</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  rows={3}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="مثال: من عکس یک فاکتور دارم، چطور متنش رو استخراج کنم؟ یا امکانات این جعبه‌ابزار چیست؟"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                />
              </div>

              {/* Direct Navigation Quick Chips */}
              <div className="pt-1">
                <p className="text-[11px] font-medium text-slate-400 mb-2">هدایت سریع به ابزارهای تخصصی:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "ocr", label: "استخراج متن (OCR)", icon: ScanText },
                    { id: "pdf_chat", label: "تحلیل اسناد و PDF", icon: FileText },
                    { id: "qr", label: "بارکد و کد QR", icon: QrCode },
                    { id: "math", label: "حل ریاضی و فیزیک", icon: Calculator },
                    { id: "url", label: "خلاصه‌ساز وب", icon: Globe },
                    { id: "shortener", label: "کوتاه‌کننده لینک", icon: Link2 },
                  ].map((t) => {
                    const TIcon = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTool(t.id as ToolId)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
                      >
                        <TIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : activeTool === "shortener" ? (
            /* E. URL Shortener View with AI Smart Slug & QR Code */
            <div className="space-y-5 text-right" dir="rtl">
              {/* Long URL Input with Paste & Voice Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    نشانی اینترنتی اصلی (URL):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          if (navigator.clipboard) {
                            const text = await navigator.clipboard.readText();
                            if (text) setShortenerUrl(text.trim());
                          }
                        } catch {
                          // Clipboard permission not granted
                        }
                      }}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      title="جای‌گذاری از کلیپ‌بورد"
                    >
                      جای‌گذاری
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleVoiceInput}
                      className={`text-xs font-medium flex items-center gap-1 px-2.5 py-0.5 rounded-lg border transition-all ${
                        isListeningVoice
                          ? "bg-rose-50 text-rose-600 border-rose-300 animate-pulse"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent"
                      }`}
                      title="ورودی صوتی فارسی"
                    >
                      {isListeningVoice ? <MicOff className="w-3 h-3 text-rose-600" /> : <Mic className="w-3 h-3 text-blue-600" />}
                      <span>{isListeningVoice ? "در حال ضبط..." : "صدا"}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={shortenerUrl}
                    onChange={(e) => setShortenerUrl(e.target.value)}
                    placeholder="https://example.com/very/long/article/path..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-left"
                  />
                  {shortenerUrl && (
                    <button
                      type="button"
                      onClick={() => setShortenerUrl("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Custom Slug / Alias Input with AI Generator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    نام مستعار دلخواه (اختیاری):
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiSlug}
                    disabled={isAiSlugLoading || !shortenerUrl.trim()}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition-colors disabled:opacity-50"
                  >
                    {isAiSlugLoading ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-blue-600" />
                    )}
                    <span>{isAiSlugLoading ? "تولید نام هوشمند..." : "نام مستعار هوشمند AI"}</span>
                  </button>
                </div>

                <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/20 focus-within:border-blue-600 transition-all" dir="ltr">
                  <span className="px-3.5 py-3 text-xs font-mono text-slate-400 bg-slate-100/70 border-r border-slate-200 select-none">
                    /s/
                  </span>
                  <input
                    type="text"
                    value={shortenerCustomSlug}
                    onChange={(e) => setShortenerCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                    placeholder="my-link (یا خالی بگذارید)"
                    className="w-full px-3 py-3 text-sm text-slate-900 bg-transparent focus:outline-none font-mono"
                  />
                  {shortenerCustomSlug && (
                    <button
                      type="button"
                      onClick={() => setShortenerCustomSlug("")}
                      className="px-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  می‌توانید کلمه دلخواه بنویسید یا دکمه هوشمند را بزنید تا هوش مصنوعی نام کوتاه انگلیسی بسازد.
                </p>
              </div>

              {/* Created Short Link Showcase Card */}
              {shortenerCreatedLink && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-200/80 shadow-xs space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      پیوند کوتاه شما آماده است:
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      کد: {shortenerCreatedLink.code}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-white border border-slate-200" dir="ltr">
                    <span className="font-mono text-sm sm:text-base font-bold text-blue-600 select-all truncate">
                      {shortenerCreatedLink.shortUrl}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0" dir="rtl">
                      <button
                        type="button"
                        onClick={() => handleCopyShortUrl(shortenerCreatedLink.shortUrl)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          copiedShortUrl === shortenerCreatedLink.shortUrl
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                      >
                        {copiedShortUrl === shortenerCreatedLink.shortUrl ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>کپی شد!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>کپی</span>
                          </>
                        )}
                      </button>

                      <a
                        href={shortenerCreatedLink.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>تست لینک</span>
                      </a>
                    </div>
                  </div>

                  {/* QR Code and Metadata */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-blue-100/60">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&color=0f172a&data=${encodeURIComponent(
                          shortenerCreatedLink.shortUrl
                        )}`}
                        alt="QR Code"
                        className="w-20 h-20 rounded-md"
                      />
                    </div>
                    <div className="space-y-1 text-right w-full">
                      {shortenerCreatedLink.title && (
                        <p className="text-xs font-bold text-slate-800">
                          {shortenerCreatedLink.title}
                        </p>
                      )}
                      {shortenerCreatedLink.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">
                          {shortenerCreatedLink.description}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 font-mono truncate" dir="ltr">
                        {shortenerCreatedLink.originalUrl}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Short Links & Analytics Table */}
              {shortenerRecentLinks.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                      پیوندهای اخیر و آمار بازدید ({shortenerRecentLinks.length})
                    </span>
                    <button
                      type="button"
                      onClick={fetchShortLinks}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>بروزرسانی آمار</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                    {shortenerRecentLinks.map((item) => {
                      const host = typeof window !== "undefined" ? window.location.host : "localhost:3000";
                      const proto = typeof window !== "undefined" ? window.location.protocol : "http:";
                      const itemShortUrl = `${proto}//${host}/s/${item.code}`;

                      return (
                        <div
                          key={item.code}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition-colors"
                        >
                          <div className="space-y-0.5 overflow-hidden text-right">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-blue-600" dir="ltr">
                                /s/{item.code}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                <MousePointerClick className="w-2.5 h-2.5" />
                                {item.clicks || 0} کلیک
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md font-mono" dir="ltr">
                              {item.originalUrl}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopyShortUrl(itemShortUrl)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors"
                              title="کپی لینک"
                            >
                              {copiedShortUrl === itemShortUrl ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <a
                              href={itemShortUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white transition-colors"
                              title="باز کردن لینک"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteShortLink(item.code)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* D. Universal Dropzone for OCR, PDF, MATH, and QR Scan */
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={currentTool.accept}
                onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
                className="hidden"
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files?.[0] && handleProcessFile(e.target.files[0])}
                className="hidden"
              />

              {!file && !filePreview ? (
                <div
                  onDragEnter={onDragOver}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 ${
                    isDragging
                      ? "border-blue-600 bg-blue-50/50 scale-[0.99]"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                  }`}
                >
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center mx-auto text-blue-600 mb-4">
                      <Upload className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm sm:text-base">
                      {currentTool.dropzoneTitle}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      {currentTool.dropzoneSubtitle}
                    </p>
                  </div>

                  {/* Actions: Choose File or Camera Snapshot */}
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      انتخاب فایل
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {currentTool.accept.includes("image") && (
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-sm transition-colors"
                        title="عکاسی مستقیم با دوربین"
                      >
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>دوربین</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Selected File Preview Box */
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <FileUp className="w-6 h-6" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {file?.name || "فایل انتخابی"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {file ? `${(file.size / 1024).toFixed(1)} کیلوبایت` : "آماده"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                      setFileBase64(null);
                      setTextInput("");
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-white transition-colors"
                    title="حذف"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Optional Text Guidance with Voice Input Support */}
              {(activeTool === "pdf_chat" || activeTool === "math" || activeTool === "ocr") && (
                <div className="space-y-1.5 pt-2 text-right" dir="rtl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-600 block">
                      {activeTool === "pdf_chat"
                        ? "پرسش درباره سند:"
                        : activeTool === "math"
                        ? "توضیح یا سوال مسئله:"
                        : "راهنما یا دستور دلخواه (اختیاری):"}
                    </label>

                    {/* Speech Recognition Button */}
                    <button
                      type="button"
                      onClick={handleToggleVoiceInput}
                      className={`text-xs font-medium flex items-center gap-1 px-2 py-0.5 rounded-lg border transition-all ${
                        isListeningVoice
                          ? "bg-rose-50 text-rose-600 border-rose-300 animate-pulse"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent"
                      }`}
                      title="ورودی صوتی فارسی"
                    >
                      {isListeningVoice ? <MicOff className="w-3 h-3 text-rose-600" /> : <Mic className="w-3 h-3 text-blue-600" />}
                      <span>{isListeningVoice ? "در حال ضبط..." : "صدا"}</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={
                      activeTool === "pdf_chat"
                        ? "مثال: تعهدات طرفین چیست؟"
                        : activeTool === "math"
                        ? "مثال: روش حل را گام‌به‌گام توضیح بده."
                        : "مثال: خروجی به شکل جدول باشد."
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              )}
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center justify-between gap-3 text-right"
              dir="rtl"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            </motion.div>
          )}

          {/* Action Trigger Button with Stop Streaming Support */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={() => (activeTool === "shortener" ? handleCreateShortLink() : handleAnalyzeWithCustomData())}
              disabled={(isLoading && !isStreaming) || isShortening}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                (isLoading && !isStreaming) || isShortening
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-[0.99]"
              }`}
            >
              {isLoading || isShortening ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال پردازش...</span>
                </>
              ) : (
                <>
                  {activeTool === "shortener" ? (
                    <Scissors className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {activeTool === "chat"
                      ? "ارسال پیام"
                      : activeTool === "shortener"
                      ? "کوتاه‌سازی پیوند"
                      : "شروع پردازش"}
                  </span>
                </>
              )}
            </button>

            {isStreaming && (
              <button
                type="button"
                onClick={() => abortControllerRef.current?.abort()}
                className="px-4 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium text-xs border border-rose-200 transition-colors"
                title="توقف استریم"
              >
                توقف
              </button>
            )}
          </div>
        </div>

        {/* ============================================================
            5. Output Box with Audio TTS, Send to Mobile QR, Share & Copy
        ============================================================ */}
        <AnimatePresence>
          {(responseOutput || isStreaming) && (
            <motion.div
              ref={outputRef}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">نتیجه پردازش</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-slate-400">{currentTool.name}</span>
                      {usedModelBadge && (
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {usedModelBadge}
                        </span>
                      )}
                      {durationMsBadge && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(durationMsBadge / 1000).toFixed(1)} ثانیه
                        </span>
                      )}
                      {isStreaming && (
                        <span className="text-[10px] text-blue-600 font-semibold animate-pulse">
                          ● لحظه‌ای
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Multifunctional Action Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* ITEM 4: Send to Mobile via QR */}
                  <button
                    onClick={() => setIsMobileQrOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 transition-colors"
                    title="انتقال به موبایل"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>موبایل</span>
                  </button>

                  {/* TTS Audio Speech Button */}
                  <button
                    onClick={handleToggleSpeech}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      isPlayingTTS
                        ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                    }`}
                    title={isPlayingTTS ? "توقف صدا" : "پخش صوتی"}
                  >
                    {isPlayingTTS ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>توقف</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>صدا</span>
                      </>
                    )}
                  </button>

                  {/* Download as TXT */}
                  <button
                    onClick={handleDownloadTxt}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
                    title="دانلود"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Web Share */}
                  <button
                    onClick={handleShare}
                    className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors"
                    title="اشتراک"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>کپی</span>
                      </>
                    )}
                  </button>

                  {/* Dismiss */}
                  <button
                    onClick={() => {
                      stopSpeech();
                      setResponseOutput(null);
                    }}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="بستن"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Formatted Output Presentation with Streaming Typewriter Support */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100/80">
                <FormattedOutput content={responseOutput || ""} isStreaming={isStreaming} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ============================================================
          ITEM 4: Send to Mobile Modal (کد QR انتقال نتیجه به گوشی)
      ============================================================ */}
      <AnimatePresence>
        {isMobileQrOpen && responseOutput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileQrOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/90 text-center space-y-4"
              dir="rtl"
            >
              <button
                onClick={() => setIsMobileQrOpen(false)}
                className="absolute top-5 left-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 pt-2">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">انتقال به موبایل</h3>
                <p className="text-xs text-slate-500">
                  این کد را با دوربین گوشی اسکن کنید تا نتیجه منتقل شود.
                </p>
              </div>

              {/* Scannable Output QR Code */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                    responseOutput.slice(0, 900)
                  )}`}
                  alt="Result QR Code"
                  className="w-48 h-48 rounded-xl object-contain mx-auto"
                />
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-[11px] text-slate-400">
                  متن و نکات کلیدی استخراج‌شده
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleCopy();
                    setIsMobileQrOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
                >
                  کپی و بستن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          6. Exhibition Recent History Drawer
      ============================================================ */}
      <AnimatePresence>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm h-full bg-white shadow-2xl border-l border-slate-200/90 p-6 flex flex-col justify-between overflow-y-auto"
              dir="rtl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-900 text-sm">تاریخچه تحلیل‌ها</h3>
                  </div>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {historyItems.length === 0 ? (
                    <div className="text-center py-16 space-y-2">
                      <History className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-400">موردی در تاریخچه ثبت نشده است.</p>
                    </div>
                  ) : (
                    historyItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setActiveTool(item.tool);
                          setResponseOutput(item.result);
                          setUsedModelBadge(item.modelUsed || "سوابق");
                          if (item.durationMs) setDurationMsBadge(item.durationMs);
                          setIsHistoryOpen(false);
                          setTimeout(() => {
                            outputRef.current?.scrollIntoView({ behavior: "smooth" });
                          }, 100);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 cursor-pointer transition-all space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.toolName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleTimeString("fa-IR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium truncate">{item.previewInput}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.result}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {historyItems.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={handleClearHistory}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>پاکسازی تاریخچه</span>
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          7. Admin Modal (Hardened Security, PIN Changer & Live Key Test)
      ============================================================ */}
      <AnimatePresence>
        {isAdminOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 overflow-hidden"
            >
              <button
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {!isPinAuthenticated ? (
                <div className="space-y-5 pt-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mx-auto border border-slate-200">
                    <Lock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">ورود ادمین</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      رمز عبور مدیریت را وارد کنید.
                    </p>
                  </div>

                  {lockoutRemainingSec > 0 ? (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      <p className="font-bold">قفل موقت</p>
                      <p className="mt-1">لطفاً {lockoutRemainingSec} ثانیه صبر کنید.</p>
                    </div>
                  ) : (
                    <form onSubmit={handlePinSubmit} className="space-y-4">
                      <div className="flex justify-center gap-2">
                        <input
                          type="password"
                          maxLength={6}
                          autoFocus
                          value={enteredPin}
                          onChange={(e) => {
                            setEnteredPin(e.target.value);
                            setPinError(false);
                          }}
                          placeholder={adminPin === DEFAULT_PIN ? "1234" : "••••"}
                          className={`w-44 text-center tracking-widest text-lg font-mono py-2.5 rounded-2xl bg-slate-50 border transition-all ${
                            pinError
                              ? "border-rose-400 bg-rose-50/50 text-rose-700 animate-shake"
                              : "border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-slate-800"
                          }`}
                        />
                      </div>

                      {pinError && (
                        <p className="text-[11px] text-rose-600 font-medium">
                          رمز اشتباه است ({failedPinAttempts} از ۴)
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        ورود
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="space-y-4 pt-1 text-right max-h-[80vh] overflow-y-auto pl-1" dir="rtl">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">تنظیمات ادمین</h3>
                      <p className="text-[11px] text-slate-400">مدیریت کلید و مدل هوش مصنوعی</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* API Key Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        کلید Gemini API:
                      </label>
                      <div className="relative">
                        <input
                          type={showKeySecret ? "text" : "password"}
                          value={customKeyInput}
                          onChange={(e) => setCustomKeyInput(e.target.value)}
                          placeholder="AQ... یا AIzaSy... (خالی = پیش‌فرض)"
                          className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-left"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKeySecret(!showKeySecret)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showKeySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Test Key Connection Live */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleTestKey}
                        disabled={isTestingKey}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50"
                      >
                        {isTestingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        <span>تست اتصال</span>
                      </button>
                    </div>

                    {testKeyFeedback && (
                      <p className={`text-[11px] p-2 rounded-xl border ${
                        testKeyFeedback.includes("موفقیت")
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-rose-50 border-rose-200 text-rose-700"
                      }`}>
                        {testKeyFeedback}
                      </p>
                    )}

                    {/* Model Selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        مدل هوش مصنوعی:
                      </label>
                      <select
                        value={tempModel}
                        onChange={(e) => setTempModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-left font-mono"
                      >
                        <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (پیش‌فرض - فوق‌العاده سریع و پایدار)</option>
                        <option value="gemini-3.5-flash">gemini-3.5-flash (استاندارد)</option>
                        <option value="gemini-3.8-flash">gemini-3.8-flash (استدلال پیشرفته)</option>
                      </select>
                    </div>

                    {/* Change Admin PIN */}
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <label className="text-xs font-semibold text-slate-700 block">
                        رمز عبور جدید (اختیاری):
                      </label>
                      <input
                        type="password"
                        maxLength={8}
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="حداقل ۴ رقم..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-left"
                      />
                    </div>

                    {/* Save Notice */}
                    {keySaveSuccess && (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5">
                        <Check className="w-4 h-4" />
                        <span>تنظیمات با موفقیت ذخیره شد.</span>
                      </div>
                    )}

                    {/* Save & Reset Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveCustomKey}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm"
                      >
                        ذخیره
                      </button>
                      {storedApiKey && (
                        <button
                          onClick={handleClearCustomKey}
                          className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-medium transition-colors"
                        >
                          حذف کلید
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          8. Minimalist Footer
      ============================================================ */}
      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-slate-400 border-t border-slate-200/60 w-full mt-12 space-y-1">
        <p className="font-medium text-slate-500">ACHAR AI — Smart All-in-One AI Toolbox</p>
        <p className="text-[11px]">
          طراحی مینیمال • پردازش در مرورگر و حریم خصوصی امن
        </p>
      </footer>
    </div>
  );
}
