import Link from 'next/link'
import QtMark from '@/components/QtMark'
import { NAV } from '@/lib/site/content'

/**
 * The site's own header. Six destinations, no JavaScript: on a narrow screen
 * the list folds into a disclosure, which is the one control that works
 * without a script, without a focus trap, and without hijacking the page.
 */
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="site-header__brand" aria-label="QualiCraft — home">
          <QtMark size={14} />
          <span className="site-header__word">QualiCraft</span>
        </Link>

        <nav className="site-nav" aria-label="Site">
          <ul className="site-nav__list">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="site-nav__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <details className="site-nav-disclosure">
          <summary className="site-nav-disclosure__summary" aria-label="Open the menu">
            <span className="mono">Menu</span>
          </summary>
          <ul className="site-nav-disclosure__list">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="site-nav__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </header>
  )
}
