
"use client"
import {siteUrl} from '@/lib/site/url'
import {useRef} from 'react'
import QtMark from '@/components/QtMark'
import { NAV } from '@/lib/site/content'

/**
 * The site's own header. On narrow screens the disclosure closes when a
 * section is chosen so its overlay cannot hide the destination heading.
 */
export default function SiteHeader() {
  const mobileMenu = useRef<HTMLDetailsElement>(null)
  const closeMobileMenu = () => mobileMenu.current?.removeAttribute('open')
  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <a href={siteUrl("/#top")} className="site-header__brand" aria-label="QT — home">
          <QtMark size={7} />
        </a>

        <nav className="site-nav" aria-label="Site">
          <ul className="site-nav__list">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={siteUrl(item.href)} className="site-nav__link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <details className="site-nav-disclosure" ref={mobileMenu}>
          <summary className="site-nav-disclosure__summary" aria-label="Open the menu">
            <span className="mono">Menu</span>
          </summary>
          <ul className="site-nav-disclosure__list">
            {NAV.map((item) => (
              <li key={item.label}>
                <a href={siteUrl(item.href)} className="site-nav__link" onClick={closeMobileMenu}>
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
