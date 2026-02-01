# DeepLX on EdgeOne

<p align="center">
  <img src="https://deeplx.owo.network/logo.svg" width="100" height="100" alt="DeepLX Logo">
</p>

<p align="center">
  <strong>DeepLX on EdgeOne Pages</strong>
</p>

<p align="center">
  Free · Fast · Open Source · Self-hostable
</p>

<p align="center">
  English | <a href="./README.zh-CN.md">简体中文</a>
</p>

---

## Features

- **Free** - No payment required, free forever
- **Fast** - Based on EdgeOne edge computing, globally accelerated
- **Secure** - Fully open source, self-hostable
- **Simple** - RESTful API, easy integration into any application
- **Multi-language UI** - Supports English and Chinese interface with auto-detection

## Quick Start

### API Call

```bash
curl -X POST https://your-domain.com/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, World!",
    "source_lang": "auto",
    "target_lang": "ZH"
  }'
```

**Response Example:**

```json
{
  "code": 200,
  "data": "你好，世界！",
  "source_lang": "EN",
  "target_lang": "ZH",
  "provider": "deepl"
}
```

## API Usage

### POST /translate

Main translation endpoint with multi-provider auto-failover (DeepL → Google).

**Request Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to translate (max 5000 characters) |
| `source_lang` | string | No | Source language code, default `auto` |
| `target_lang` | string | Yes | Target language code |

**Language Code Examples:** `EN`, `ZH`, `JA`, `KO`, `DE`, `FR`, `ES`, `PT-BR`

### POST /api/deepl

Directly call DeepL Provider.

### POST /api/google

Directly call Google Translate Provider (text limit 1500 characters).

### GET /stats

Get service monitoring statistics.

## Self-hosting

This project is deployed on Tencent Cloud [EdgeOne Pages](https://cloud.tencent.com/product/edgeone).

### Prerequisites

- Node.js >= 18
- EdgeOne Pages account

### Deployment Steps

```bash
# 1. Clone repository
git clone https://github.com/0XwX/deeplx.git
cd deeplx

# 2. Install dependencies
npm install
cd frontend && npm install && cd ..

# 3. Login to EdgeOne
npx edgeone login

# 4. One-click deploy
npm run deploy
```

> First deployment will create the project. To deploy to overseas region (no real-name verification required), add `-a overseas` parameter to the deploy command.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TOKEN` | API authentication token (optional) | None (allow all requests) |

When `TOKEN` is configured, API requests must include authentication:

**Method 1: URL Query Parameter (Recommended)**

```bash
curl -X POST "https://your-domain.com/translate?token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "target_lang": "ZH"}'
```

**Method 2: Authorization Header**

```bash
curl -X POST https://your-domain.com/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Hello", "target_lang": "ZH"}'
```

## Development

```bash
# Start frontend dev server
npm run dev

# Lint code
npm run lint
npm run format:check

# Build frontend
npm run build
```

## Tech Stack

**Backend:**
- EdgeOne Edge Functions
- KV Storage (health checks + logs)

**Frontend:**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide Icons

## Related Projects

- [DeepLX](https://github.com/OwO-Network/DeepLX) - Original DeepL free API project
- [xixu-me/DeepLX](https://github.com/xixu-me/DeepLX) - DeepLX Cloudflare Workers deployment
- [EdgeOne Pages](https://cloud.tencent.com/product/edgeone) - Tencent Cloud edge computing platform

## License

MIT License
