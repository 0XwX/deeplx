import type { Translations } from '../types'

export const zhTranslations: Translations = {
  // Header
  appTitle: 'DeepLX',
  appSubtitle: '免费、无限制的 DeepL API',
  language: '语言',

  // Form
  sourceLanguage: '源语言',
  targetLanguage: '目标语言',
  autoDetect: '自动检测',
  enterText: '输入要翻译的文本...',
  translationResult: '翻译结果',
  translate: '翻译',
  translating: '翻译中...',
  clear: '清空',
  copy: '复制',
  copied: '已复制!',
  swapLanguages: '交换语言',

  // Settings
  settings: '设置',
  apiEndpoint: 'API 端点',
  apiEndpointDesc: '自定义翻译 API 端点 URL',
  theme: '主题',
  system: '跟随系统',
  light: '浅色',
  dark: '深色',

  // History
  history: '历史记录',
  noHistory: '暂无翻译历史',
  clearHistory: '清空历史',
  clearHistoryConfirm: '确定要清空所有历史记录吗？',

  // Errors
  translationFailed: '翻译失败',
  networkError: '网络错误，请检查网络连接',
  invalidResponse: '服务器返回无效响应',
  rateLimitError: '请求过于频繁，请稍后再试',
  unknownError: '发生未知错误',
  unauthorizedError: '服务器已启用 Token 认证，请设置 Token',

  // Footer
  poweredBy: '由 DeepLX 驱动',

  // Hero Section
  heroBadge: '100% 免费 · 无需 API Key',
  heroTitle: '强大的 DeepL 翻译 API',
  heroSubtitle: '您可以将 DeepLX 集成到任何应用程序中，享受高质量的机器翻译服务',
  startTranslating: '开始翻译',
  apiDocs: 'API 文档',

  // Features
  free: '免费',
  freeDesc: '无需付费，永久免费',
  fast: '快速',
  fastDesc: '翻译速度远超 OpenAI',
  secure: '安全',
  secureDesc: '开源，您可以查看所有源代码并自行部署',
  simple: '简单',
  simpleDesc: '轻松集成到任何应用程序',

  // Translate Section
  onlineTranslation: '在线翻译',
  enterTextHint: '输入文本，即刻获取翻译结果',

  // API Section
  apiUsage: 'API 使用',
  apiUsageDesc: '简单的 HTTP 请求即可调用翻译服务',

  // Settings Additional
  apiToken: 'API Token',
  apiTokenPlaceholder: '可选，用于认证',
  apiTokenDesc: '如果服务器配置了 TOKEN 环境变量，需要在此输入',
  autoTranslate: '自动翻译',
  autoTranslateDesc: '输入停止后自动进行翻译',
  autoTranslateDelay: '自动翻译延迟',
  autoTranslateDelayDesc: '停止输入后等待多久开始翻译',
  themeDesc: '选择界面颜色主题，"系统"将跟随操作系统设置',
  shortcuts: '快捷键：Ctrl+Enter 手动翻译 | Esc 关闭面板',
  apiEndpointPlaceholder: '留空使用当前域名',

  // Footer Additional
  website: 'DeepLX',
}
