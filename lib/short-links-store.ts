import fs from "fs";
import path from "path";

export interface ShortLink {
  code: string;
  originalUrl: string;
  title?: string;
  description?: string;
  clicks: number;
  createdAt: number;
  lastVisited?: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "short_links.json");

// In-memory cache
let cache: Map<string, ShortLink> | null = null;

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      // Pre-populate with initial exhibition demo links
      const initialLinks: ShortLink[] = [
        {
          code: "achar-git",
          originalUrl: "https://github.com/sosisbandari33-del/achar-ai",
          title: "ریپازیتوری رسمی ACHAR AI",
          description: "کد منبع و مستندات جعبه‌ابزار هوش مصنوعی در گیت‌هاب",
          clicks: 14,
          createdAt: Date.now() - 3600000 * 2,
        },
        {
          code: "ai-demo",
          originalUrl: "https://ai.google.dev",
          title: "پلتفرم توسعه‌دهندگان Google AI",
          description: "مستندات و راهنمای مدل‌های Gemini",
          clicks: 8,
          createdAt: Date.now() - 3600000 * 5,
        },
      ];
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialLinks, null, 2), "utf-8");
    }
  } catch (err) {
    console.error("[ShortStore] Error initializing data file:", err);
  }
}

function loadCache(): Map<string, ShortLink> {
  if (cache) return cache;
  ensureDataFile();
  const map = new Map<string, ShortLink>();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const list: ShortLink[] = JSON.parse(raw);
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item && item.code) {
            map.set(item.code.toLowerCase(), item);
          }
        }
      }
    }
  } catch (err) {
    console.error("[ShortStore] Error reading file:", err);
  }
  cache = map;
  return cache;
}

function persistCache() {
  if (!cache) return;
  try {
    ensureDataFile();
    const list = Array.from(cache.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("[ShortStore] Error persisting file:", err);
  }
}

function generateRandomCode(length = 5): string {
  const chars = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getAllShortLinks(): ShortLink[] {
  const store = loadCache();
  return Array.from(store.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getShortLink(code: string): ShortLink | null {
  const store = loadCache();
  return store.get(code.toLowerCase()) || null;
}

export function incrementShortLinkClick(code: string): ShortLink | null {
  const store = loadCache();
  const item = store.get(code.toLowerCase());
  if (!item) return null;

  item.clicks = (item.clicks || 0) + 1;
  item.lastVisited = Date.now();
  persistCache();
  return item;
}

export function sanitizeSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function createShortLink(
  originalUrl: string,
  preferredCode?: string,
  meta?: { title?: string; description?: string }
): { link: ShortLink; isNew: boolean } {
  const store = loadCache();

  // Validate or format URL
  let validUrl = originalUrl.trim();
  if (!/^https?:\/\//i.test(validUrl)) {
    validUrl = "https://" + validUrl;
  }

  let code = preferredCode ? sanitizeSlug(preferredCode) : "";

  // If user provided a code, check collision
  if (code) {
    const existing = store.get(code);
    if (existing) {
      // If points to same URL, return existing
      if (existing.originalUrl.toLowerCase() === validUrl.toLowerCase()) {
        return { link: existing, isNew: false };
      }
      // If colliding with different URL, append suffix
      code = `${code}-${generateRandomCode(3).toLowerCase()}`;
    }
  } else {
    // Generate unique random code
    let attempts = 0;
    do {
      code = generateRandomCode(5).toLowerCase();
      attempts++;
    } while (store.has(code) && attempts < 20);
  }

  const newLink: ShortLink = {
    code,
    originalUrl: validUrl,
    title: meta?.title || undefined,
    description: meta?.description || undefined,
    clicks: 0,
    createdAt: Date.now(),
  };

  store.set(code, newLink);
  persistCache();
  return { link: newLink, isNew: true };
}

export function deleteShortLink(code: string): boolean {
  const store = loadCache();
  const key = code.toLowerCase();
  if (store.has(key)) {
    store.delete(key);
    persistCache();
    return true;
  }
  return false;
}
