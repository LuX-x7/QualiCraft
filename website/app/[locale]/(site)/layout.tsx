import { getSettings, navPages } from '@/lib/kernel/content'
import { LOCALES, getDict, localePath } from '@/lib/kernel/i18n'
import NavMenu from '@/components/NavMenu'
import Reveal from '@/components/Reveal'
import SiteFooter from '@/components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const [settings, pages, dict] = await Promise.all([getSettings(), navPages(), getDict(rawLocale)])
  const locale = dict.locale
  const href = (path: string) => localePath(locale, path)

  const items = pages.map((page) => ({
    href: href(`/${page.slug}`),
    label: dict.t(`nav.${page.slug}`, page.nav_label || page.title),
  }))

  const enabled: string[] = settings.languages?.enabled?.length ? settings.languages.enabled : ['en']
  const locales = LOCALES.filter((item) => enabled.includes(item.code)).map((item) => ({
    code: item.code,
    label: item.label,
    english: item.english,
    flag: item.flag,
  }))

  const accent = settings.theme?.accent || '#1B48D6'
  const accentInk = settings.theme?.accent_ink || '#0F2E8C'

  // Always pass the locale to the workbench. It runs as a separate process and
  // has no other way to know which language the visitor is reading.
  const ctaHref = `/w?lang=${locale}`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `:root{--accent:${accent};--accent-strong:${accentInk}}` }} />
      <NavMenu
        items={items}
        siteName={settings.identity.site_name}
        logoText={settings.identity.logo_text || settings.identity.site_short}
        ctaHref={ctaHref}
        ctaLabel={dict.t('cta.enterWorkspace', 'Enter the workspace')}
        locale={locale}
        locales={locales}
        langLabel={dict.t('lang.switch')}
      />
      {children}
      <SiteFooter locale={locale} />
      <Reveal />
    </>
  )
}
