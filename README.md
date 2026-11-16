# 🛠️ ACHAR AI — Smart All-in-One AI Toolbox

> **Apple-style Minimalist Multimodal AI Web App for Tech Exhibitions**  
> Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Google Generative AI SDK.

---

## ✨ Features

- **5 Core AI Tools:**
  1. **AI OCR:** Smart text and table extraction from photos, invoices, and administrative documents.
  2. **Chat with PDF:** Semantic document analysis, Q&A, and contract risk summary.
  3. **AI QR Code:** Real-time QR decoder, link safety validation, and instant branded QR generator.
  4. **Math Solver:** Step-by-step mathematical reasoning, integral evaluation, and circuit calculation.
  5. **URL Summarizer:** Instant 3-bullet structured website and article summarizer with SSRF protection.

- **Exhibition-Ready Capabilities:**
  - ⚡ **Live Typewriter Streaming:** Real-time Server-Sent Events (SSE) token delivery.
  - 🎙️ **Persian Voice Input (Speech-to-Text):** Dictate questions directly with high Persian accuracy.
  - 🔊 **Voice Audio Output (Text-to-Speech):** Natural Persian speech readout of analysis results.
  - 📱 **Send to Mobile via QR:** Seamless transfer of analysis outputs to visitors' smartphones.
  - ⚡ **Instant 1-Click Demo Presets:** Preloaded SVG mockups for instant booth demonstrations.
  - 🔒 **Dynamic BYOK & Admin Security:** PIN-protected admin modal (lockout defense against brute-force), local-only API key storage (`localStorage`), and zero hardcoded secrets.

---

## 🔒 Security & Privacy Architecture

- **No Server Secret Leaks:** `.env.local` and all credentials are excluded via `.gitignore`.
- **BYOK (Bring Your Own Key):** Administrators can supply keys dynamically in the browser without rebuilding or committing code.
- **SSRF Defense:** URL summarizer validates endpoints, blocks private IPs, metadata services (`169.254.169.254`), and non-HTTP protocols.
- **Rate Limiting:** Protects backend APIs against DoS attacks with automatic 50 req/min limits.
- **Payload Sanitization:** Request sizes strictly capped to 15MB to prevent memory exhaustion.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.17 or higher
- npm, yarn, or pnpm

### 2. Installation
```bash
git clone https://github.com/thearyan/achar-ai.git
cd achar-ai
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env.local
```
Edit `.env.local` and provide your Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Alternatively, leave it empty and configure your key directly in the web app via the Admin Modal with default PIN `1234`).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 📂 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS (Apple Minimalist Aesthetic)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **AI SDK:** `@google/generative-ai` (Gemini Flash Cascade)

---

## 📄 License

MIT License © 2026 ACHAR AI
