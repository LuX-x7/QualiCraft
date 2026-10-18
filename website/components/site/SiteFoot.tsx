
import {siteUrl} from '@/lib/site/url'
import MotionPreference from './MotionPreference'
import { FOOTER } from '@/lib/site/content'
export default function SiteFoot() {
 return <footer className="site-foot site-foot--quiet" id="feedback"><div className="wrap site-foot__bar">
  <span className="mono">QT / MIT</span><details className="site-foot__record"><summary>Citation &amp; licence</summary><p>{FOOTER.licence}</p><p>{FOOTER.cite}</p></details>
  {FOOTER.feedbackUrl&&<a href={siteUrl(FOOTER.feedbackUrl)}>Feedback ↗</a>}<MotionPreference/>
 </div></footer>
}
