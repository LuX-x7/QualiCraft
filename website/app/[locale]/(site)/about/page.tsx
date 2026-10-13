import { ABOUT, SEO } from '@/lib/site/content'

export const metadata = { title: SEO.about.title, description: SEO.about.description }

/** About, from the same static module as the homepage. */
export default function AboutPage() {
  return (
    <section className="section about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-no">About</span>
          <h1 id="about-title">{ABOUT.title}</h1>
          <p>{ABOUT.body}</p>
        </div>
        <ul className="principles">
          {ABOUT.principles.map((principle) => (
            <li key={principle.name} className="principles__item">
              <h2>{principle.name}</h2>
              <p>{principle.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
