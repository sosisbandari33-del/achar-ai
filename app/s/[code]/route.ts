import { NextRequest, NextResponse } from "next/server";
import { getShortLink, incrementShortLinkClick } from "@/lib/short-links-store";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const link = getShortLink(code);

  if (!link) {
    // Beautiful HTML fallback for not found
    const notFoundHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>پیوند یافت نشد | ACHAR AI</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8fafc;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 40px 32px;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 20px;
      margin: 0 0 8px 0;
      color: #1e293b;
    }
    p {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 24px 0;
      line-height: 1.6;
    }
    .code {
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: monospace;
      color: #334155;
    }
    a.btn {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 600;
      transition: background 0.2s;
    }
    a.btn:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">۴۰۴ - پیوند نامعتبر</div>
    <h1>پیوند کوتاه پیدا نشد</h1>
    <p>کد پیوند <span class="code">${code}</span> در سامانه آچار وجود ندارد یا حذف شده است.</p>
    <a href="/" class="btn">بازگشت به صفحه اصلی آچار</a>
  </div>
</body>
</html>`;

    return new NextResponse(notFoundHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Increment clicks
  incrementShortLinkClick(code);

  // Redirect to destination URL
  return NextResponse.redirect(link.originalUrl, 307);
}
