import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getAllShortLinks,
  createShortLink,
  deleteShortLink,
  sanitizeSlug,
} from "@/lib/short-links-store";

export const dynamic = "force-dynamic";

function isForbiddenOrPrivateHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase().trim();
  if (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "0.0.0.0" ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  ) {
    return true;
  }
  return false;
}

// Fallback smart slug generator without external API
function fallbackSlugFromUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] || parsed.hostname.replace(/^www\./, "").split(".")[0];
    const cleaned = lastPart
      .replace(/\.[a-z0-9]+$/i, "")
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase()
      .slice(0, 15);
    return sanitizeSlug(cleaned) || "link";
  } catch {
    return "link";
  }
}

// GET: Retrieve all shortened links
export async function GET() {
  try {
    const links = getAllShortLinks();
    return NextResponse.json({ success: true, links });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "خطا در دریافت پیوندها" },
      { status: 500 }
    );
  }
}

// POST: Create a shortened link (with optional AI smart slug & description)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawUrl = (body.url || "").trim();
    let customSlug = (body.customSlug || "").trim();
    const useAi = Boolean(body.aiSlug || body.generateAiMeta);
    const clientApiKey = (body.apiKey || "").trim();
    const modelName = (body.model || "gemini-3.1-flash-lite").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, error: "لطفاً نشانی اینترنتی (URL) را وارد کنید." },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      const formatted = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
      parsedUrl = new URL(formatted);
    } catch {
      return NextResponse.json(
        { success: false, error: "ساختار نشانی وب نامعتبر است." },
        { status: 400 }
      );
    }

    if (isForbiddenOrPrivateHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { success: false, error: "کوتاه‌سازی نشانی‌های محلی یا خصوصی مجاز نیست." },
        { status: 400 }
      );
    }

    let metaTitle = "";
    let metaDescription = "";

    // Optional AI smart slug & meta generation
    if (useAi) {
      const activeApiKey = clientApiKey || process.env.GEMINI_API_KEY || "";
      if (activeApiKey) {
        try {
          const genAI = new GoogleGenerativeAI(activeApiKey);
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          });

          const prompt = `You are a URL metadata and slug generator.
Analyze this destination URL: "${parsedUrl.toString()}".
Generate:
1. "slug": a catchy, memorable, lowercase Latin slug with hyphens (max 14 chars, e.g. "github-repo", "tehran-news", "ai-paper").
2. "title": a very short Persian title for this page (max 5 words).
3. "description": a 1-sentence Persian summary of what this link contains.

Respond strictly with valid JSON schema:
{"slug": "string", "title": "string", "description": "string"}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text();
          if (rawText) {
            const parsedJson = JSON.parse(rawText);
            if (parsedJson.slug && !customSlug) {
              customSlug = sanitizeSlug(parsedJson.slug);
            }
            if (parsedJson.title) metaTitle = parsedJson.title;
            if (parsedJson.description) metaDescription = parsedJson.description;
          }
        } catch (aiErr) {
          console.warn("[Shorten] AI slug generation failed, falling back to local slug:", aiErr);
        }
      }

      if (!customSlug) {
        customSlug = fallbackSlugFromUrl(parsedUrl.toString());
      }
    }

    // Default title fallback
    if (!metaTitle) {
      metaTitle = parsedUrl.hostname.replace(/^www\./, "");
    }

    const { link, isNew } = createShortLink(parsedUrl.toString(), customSlug, {
      title: metaTitle,
      description: metaDescription,
    });

    // Determine host origin
    const host = req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const shortUrl = `${proto}://${host}/s/${link.code}`;

    return NextResponse.json({
      success: true,
      link,
      shortUrl,
      isNew,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "خطا در پردازش کوتاه‌سازی لینک" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a short link
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) {
      return NextResponse.json(
        { success: false, error: "کد پیوند مشخص نشده است." },
        { status: 400 }
      );
    }

    const deleted = deleteShortLink(code);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "خطا در حذف پیوند" },
      { status: 500 }
    );
  }
}
