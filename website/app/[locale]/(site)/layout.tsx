import SiteHeader from '@/components/site/SiteHeader'
import SiteFoot from '@/components/site/SiteFoot'

/**
 * The public pages' frame: the site's own header, the page, the site's own
 * footer. Nothing is read from a settings store — the strings live in
 * lib/site/content.ts, so the frame costs no request-time work and no
 * database connection.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="site-skip" href="#site-content">Skip to content</a>
      <SiteHeader />
      <main id="site-content" tabIndex={-1}>{children}</main>
      <SiteFoot />
    </>
  )
}
