import SiteHeader from '@/components/site/SiteHeader'
import SiteFoot from '@/components/site/SiteFoot'
import WorkbenchWarmup from '@/components/site/WorkbenchWarmup'

export function generateStaticParams() { return [{locale:'en'}] }
export const dynamicParams = false

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
      <WorkbenchWarmup />
      <main id="site-content" tabIndex={-1}>{children}</main>
      <SiteFoot />
    </>
  )
}
