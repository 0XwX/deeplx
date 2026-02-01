# DeepLX on EdgeOne

<p align="center">
  <img src="https://deeplx.owo.network/logo.svg" width="100" height="100" alt="DeepLX Logo">
</p>

<p align="center">
  <strong>基于 EdgeOne Pages 部署的 DeepLX</strong>
</p>

<p align="center">
  免费 · 快速 · 开源 · 可私有化部署
</p>

<p align="center">
  <a href="./README.md">English</a> | 简体中文
</p>

---

## 特性

- **免费** - 无需支付任何费用，永久免费使用
- **快速** - 基于 EdgeOne 边缘计算，全球加速
- **安全** - 完全开源，可私有化部署
- **简单** - RESTful API，轻松集成到任何应用
- **多语言界面** - 支持中英文界面，自动检测浏览器语言

## 快速开始

### API 调用

```bash
curl -X POST https://your-domain.com/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, World!",
    "source_lang": "auto",
    "target_lang": "ZH"
  }'
```

**响应示例：**

```json
{
  "code": 200,
  "data": "你好，世界！",
  "source_lang": "EN",
  "target_lang": "ZH",
  "provider": "deepl"
}
```

## API 使用

### POST /translate

主翻译端点，支持多 Provider 自动故障转移（DeepL → Google）。

**请求参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `text` | string | 是 | 待翻译文本（最大 5000 字符） |
| `source_lang` | string | 否 | 源语言代码，默认 `auto` |
| `target_lang` | string | 是 | 目标语言代码 |

**语言代码示例：** `EN`, `ZH`, `JA`, `KO`, `DE`, `FR`, `ES`, `PT-BR`

### POST /api/deepl

直接调用 DeepL Provider。

### POST /api/google

直接调用 Google Translate Provider（文本限制 1500 字符）。

### GET /stats

获取服务监控统计信息。

## 私有化部署

本项目基于腾讯云 [EdgeOne Pages](https://cloud.tencent.com/product/edgeone) 部署。

### 前置要求

- Node.js >= 18
- EdgeOne Pages 账号

### 部署步骤

```bash
# 1. 克隆仓库
git clone https://github.com/0XwX/deeplx.git
cd deeplx

# 2. 安装依赖
npm install
cd frontend && npm install && cd ..

# 3. 登录 EdgeOne
npx edgeone login

# 4. 一键部署
npm run deploy
```

> 首次部署会创建项目。如需部署到海外区域（无需实名），在 deploy 命令中添加 `-a overseas` 参数。

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `TOKEN` | API 认证 Token（可选） | 无（放行所有请求） |

配置 `TOKEN` 后，API 请求需要携带认证信息：

**方式一：URL 参数（推荐）**

```bash
curl -X POST "https://your-domain.com/translate?token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello", "target_lang": "ZH"}'
```

**方式二：Authorization 头**

```bash
curl -X POST https://your-domain.com/translate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Hello", "target_lang": "ZH"}'
```

## 开发

```bash
# 启动前端开发服务器
npm run dev

# 代码检查
npm run lint
npm run format:check

# 构建前端
npm run build
```

## 技术栈

**后端：**
- EdgeOne Edge Functions
- KV 存储（健康检查 + 日志）

**前端：**
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Lucide Icons

## 相关项目

- [DeepLX](https://github.com/OwO-Network/DeepLX) - 原始 DeepL 免费 API 项目
- [xixu-me/DeepLX](https://github.com/xixu-me/DeepLX) - DeepLX Cloudflare Workers 部署版本
- [EdgeOne Pages](https://cloud.tencent.com/product/edgeone) - 腾讯云边缘计算平台

## 许可证

MIT License
