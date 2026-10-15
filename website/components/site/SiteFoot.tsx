import MotionPreference from './MotionPreference'
import { FOOTER } from '@/lib/site/content'

/**
 * Licence, citation and the verified project feedback channel. An email is
 * optional; without one, use the existing repository's Issues page.
 */
export default function SiteFoot() {
  return (
    <footer className="site-foot" id="feedback">
      <div className="wrap">
        <MotionPreference />
        <p className="site-foot__line mono">{FOOTER.licence}</p>
        <p className="site-foot__line mono">{FOOTER.cite}</p>
        {FOOTER.feedback ? (
          <p className="site-foot__line mono">
            Feedback: <a href={`mailto:${FOOTER.feedback}`}>{FOOTER.feedback}</a>
          </p>
        ) : FOOTER.feedbackUrl ? (
          <p className="site-foot__line mono">
            Feedback: <a href={FOOTER.feedbackUrl}>GitHub Issues</a> · Use public examples; keep research data and keys private.
          </p>
        ) : null}
      </div>
    </footer>
  )
}
