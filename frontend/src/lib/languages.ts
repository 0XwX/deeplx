import type { Locale } from '@/i18n'

export interface Language {
  code: string
  label: string
  labelEn: string
}

export const LANGUAGES: Language[] = [
  { code: 'auto', label: '自动检测', labelEn: 'Auto Detect' },
  { code: 'ZH', label: '中文', labelEn: 'Chinese' },
  { code: 'EN', label: '英语', labelEn: 'English' },
  { code: 'JA', label: '日语', labelEn: 'Japanese' },
  { code: 'KO', label: '韩语', labelEn: 'Korean' },
  { code: 'FR', label: '法语', labelEn: 'French' },
  { code: 'DE', label: '德语', labelEn: 'German' },
  { code: 'ES', label: '西班牙语', labelEn: 'Spanish' },
  { code: 'IT', label: '意大利语', labelEn: 'Italian' },
  { code: 'PT', label: '葡萄牙语', labelEn: 'Portuguese' },
  { code: 'RU', label: '俄语', labelEn: 'Russian' },
  { code: 'PL', label: '波兰语', labelEn: 'Polish' },
  { code: 'NL', label: '荷兰语', labelEn: 'Dutch' },
  { code: 'TR', label: '土耳其语', labelEn: 'Turkish' },
  { code: 'ID', label: '印尼语', labelEn: 'Indonesian' },
  { code: 'UK', label: '乌克兰语', labelEn: 'Ukrainian' },
  { code: 'BG', label: '保加利亚语', labelEn: 'Bulgarian' },
  { code: 'CS', label: '捷克语', labelEn: 'Czech' },
  { code: 'DA', label: '丹麦语', labelEn: 'Danish' },
  { code: 'ET', label: '爱沙尼亚语', labelEn: 'Estonian' },
  { code: 'FI', label: '芬兰语', labelEn: 'Finnish' },
  { code: 'EL', label: '希腊语', labelEn: 'Greek' },
  { code: 'HU', label: '匈牙利语', labelEn: 'Hungarian' },
  { code: 'LV', label: '拉脱维亚语', labelEn: 'Latvian' },
  { code: 'LT', label: '立陶宛语', labelEn: 'Lithuanian' },
  { code: 'RO', label: '罗马尼亚语', labelEn: 'Romanian' },
  { code: 'SK', label: '斯洛伐克语', labelEn: 'Slovak' },
  { code: 'SL', label: '斯洛文尼亚语', labelEn: 'Slovenian' },
  { code: 'SV', label: '瑞典语', labelEn: 'Swedish' },
]

export const SOURCE_LANGUAGES = LANGUAGES
export const TARGET_LANGUAGES = LANGUAGES.filter(l => l.code !== 'auto')

/**
 * Get language label based on locale
 */
export function getLanguageLabel(lang: Language, locale: Locale): string {
  return locale === 'en' ? lang.labelEn : lang.label
}
