import Link from 'next/link'

/** 404, in the site's own words. No dictionary: the site renders English. */
export default function NotFound() {
  return (
    <main className="wrap notfound">
      <p className="label mono">404</p>
      <h1 className="h1" style={{ marginBottom: 18 }}>
        That page is not here.
      </h1>
      <p className="lede" style={{ margin: '0 auto 30px 0' }}>
        The link may be old, or the address mistyped. The workbench is at /w, the
        worked example at /report.
      </p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="btn btn--secondary" href="/">
          Back to the start
        </Link>
        <Link className="btn btn--secondary" href="/report">
          Read the worked example
        </Link>
      </div>
    </main>
  )
}
