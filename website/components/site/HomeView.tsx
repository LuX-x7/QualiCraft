import QtMark from '@/components/QtMark'
import cards from '@/lib/site/data-cards.json'
import {
  DATA_SECTION,
  FOOTER,
  HERO,
  METHODS,
  NOT_DOING,
} from '@/lib/site/content'

/**
 * The homepage, top to bottom, in the brief's fixed order: hero, the five
 * modules (its own section, wired in the next commit), the two methods, the
 * boundary, and the data with the footer after it.
 *
 * Every string comes from lib/site/content.ts; the dataset cards come from
 * the generated JSON. Nothing here reads a database or a setting.
 */

const cjk = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/
void cjk // the copy above is English; the acceptance scan checks the render

export default function HomeView() {
  return (
    <>
      {/* 01 · hero ------------------------------------------------------ */}
      <section className="hero" aria-labelledby="hero-title">
        {/* The ground: a pixel grid drifting, continuously and evenly. It
            sits far behind the text and stops outright under
            prefers-reduced-motion — the copy is the point, not the motion. */}
        <div className="hero__ground" aria-hidden="true" />
        <div className="wrap hero__inner">
          <p className="hero__eyebrow mono">{HERO.eyebrow}</p>
          <h1 id="hero-title" className="hero__title">
            <QtMark size={26} animate label="" />
            <span>
              {HERO.headline[0]}
              <br />
              {HERO.headline[1]}
            </span>
          </h1>
          <p className="hero__body">{HERO.body}</p>
          <div className="hero__actions">
            {HERO.primary.disabled ? (
              <>
                <button type="button" className="btn btn--primary" disabled aria-disabled="true">
                  {HERO.primary.label}
                </button>
                <span className="hero__note mono">{HERO.primary.disabledNote}</span>
              </>
            ) : null}
            <a className="btn btn--secondary" href={HERO.secondary.href}>
              {HERO.secondary.label}
            </a>
            <span className="hero__note mono">{HERO.secondary.note}</span>
          </div>
          <p className="hero__footnote">{HERO.footnote}</p>
        </div>
      </section>

      {/* 02 · five modules — the walkthrough section lands next commit */}

      {/* 03 · the two methods ------------------------------------------- */}
      <section className="section" id="method" aria-labelledby="method-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-no">03</span>
            <h2 id="method-title">{METHODS.title}</h2>
            <p>{METHODS.body}</p>
          </div>
          <div className="table-scroll">
            <table className="methods">
              <caption className="mono">
                TABLE.01 · Thematic analysis and qualitative content analysis, on the same axes
              </caption>
              <thead>
                <tr>
                  <th scope="col">Approach</th>
                  {METHODS.columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METHODS.rows.map((row) => (
                  <tr key={row.approach}>
                    <th scope="row">{row.approach}</th>
                    {row.cells.map((cell, index) => (
                      <td key={index}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="citations">
            <p className="citations__label mono">References</p>
            <ol className="citations__list">
              {METHODS.citations.map((citation) => (
                <li key={citation}>{citation}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 04 · the boundary ---------------------------------------------- */}
      <section className="section" id="boundary" aria-labelledby="boundary-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-no">04</span>
            <h2 id="boundary-title">{NOT_DOING.title}</h2>
            <p>{NOT_DOING.body}</p>
          </div>
          <ul className="boundary">
            {NOT_DOING.items.map((item) => (
              <li key={item.name} className="boundary__item">
                <h3>{item.name}</h3>
                {'struckReason' in item && item.struckReason ? (
                  <p className="boundary__struck">
                    <s>{item.struckReason}</s>
                  </p>
                ) : null}
                {'revision' in item && item.revision ? (
                  <p className="boundary__revision">{item.revision}</p>
                ) : null}
                <p>{item.reason}</p>
                <p className="boundary__instead mono">
                  If you need it:{' '}
                  <span className="boundary__instead-body">{item.instead}</span>
                </p>
              </li>
            ))}
            <li className="boundary__item boundary__item--scope">
              <h3>
                <span className="mono boundary__tag">Scope decision</span>{' '}
                {NOT_DOING.scopeDecision.name}
              </h3>
              <p>{NOT_DOING.scopeDecision.reason}</p>
            </li>
          </ul>
        </div>
      </section>

      {/* 05 · data ------------------------------------------------------- */}
      <section className="section" id="data" aria-labelledby="data-title">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-no">05</span>
            <h2 id="data-title">{DATA_SECTION.title}</h2>
            <p>{DATA_SECTION.body}</p>
          </div>
          <ul className="cards">
            {cards.cards.map((card) => (
              <li key={card.id} className="card">
                <div className="card__head">
                  <span className="card__id mono">{card.id}</span>
                  <span className="card__licence mono">
                    <a href={card.licence_url} rel="noopener noreferrer" target="_blank">
                      {card.licence}
                    </a>
                    {card.share_alike ? ' · ShareAlike' : ''}
                  </span>
                </div>
                <h3 className="card__title">{card.title}</h3>
                <p className="card__meta mono">
                  {card.author} · {card.year}
                  {card.language ? ` · ${card.language}` : ''}
                </p>
                <p className="card__purpose">{card.purpose}</p>
                <p className="card__hash mono" title={`SHA-256 of ${card.file}`}>
                  sha256:{card.sha256_short}
                  {card.sha256_verified ? '' : ' (recorded)'}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

void FOOTER
