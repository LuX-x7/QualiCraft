/**
 * Kernel · interface dictionary
 * ---------------------------------------------------------------------------
 * Every fixed string in the public site. These are the built-in defaults; the
 * owner can override any of them per language from Admin → Languages, and the
 * overrides live in the `translations` table.
 *
 * Content (block copy and collection records) is translated separately — see
 * localizeBlock / localizeEntry in i18n.ts.
 */

export type Locale = 'en' | 'zh'

export type LocaleMeta = {
  code: Locale
  /** name written in that language */
  label: string
  english: string
  dir: 'ltr' | 'rtl'
  flag: string
}

export const LOCALES: LocaleMeta[] = [
  { code: 'en', label: 'English', english: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'zh', label: '中文', english: 'Chinese', dir: 'ltr', flag: '🇨🇳' },
]

export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return LOCALES.some((locale) => locale.code === value)
}

export function localeMeta(code: string): LocaleMeta {
  return LOCALES.find((locale) => locale.code === code) || LOCALES[0]
}

/** Flat key → string. Keys are stable; never rename one that is already seeded. */
export const DICTIONARY: Record<Locale, Record<string, string>> = {
  en: {
    'nav.method': 'Method',
    'nav.about': 'About',
    'nav.contact': 'Contact',

    'cta.enterWorkspace': 'Enter the workspace',

    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',

    'notFound.title': 'This page has moved on.',
    'notFound.body': 'The page you were looking for is not here. Try the home page, or enter the workspace.',
    'notFound.home': 'Home',
    'notFound.workspace': 'Workspace',

    'lang.label': 'Language',
    'lang.switch': 'Change language',
  },

  zh: {
    'nav.method': '方法',
    'nav.about': '关于',
    'nav.contact': '联系',

    'cta.enterWorkspace': '进入工作台',

    'footer.privacy': '隐私政策',
    'footer.terms': '使用条款',

    'notFound.title': '页面已迁移。',
    'notFound.body': '您查找的页面不存在。请返回首页，或进入工作台。',
    'notFound.home': '首页',
    'notFound.workspace': '工作台',

    'lang.label': '语言',
    'lang.switch': '切换语言',
  },
}

export const DICTIONARY_KEYS = Object.keys(DICTIONARY.en)
