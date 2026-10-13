import { FOOTER } from '@/lib/site/content'

/**
 * Three lines, deliberately quiet: the licence, how to cite, and where to
 * write. The feedback line renders only when an address exists — the string
 * in content.ts is empty on purpose, per the brief: missing information is
 * left blank and listed in the report, never filled with something that
 * mails nowhere.
 */
export default function SiteFoot() {
  return (
    <footer className="site-foot" id="feedback">
      <div className="wrap">
        <p className="site-foot__line mono">{FOOTER.licence}</p>
        <p className="site-foot__line mono">{FOOTER.cite}</p>
        {FOOTER.feedback ? (
          <p className="site-foot__line mono">
            Feedback: <a href={`mailto:${FOOTER.feedback}`}>{FOOTER.feedback}</a>
          </p>
        ) : null}
      </div>
    </footer>
  )
}
