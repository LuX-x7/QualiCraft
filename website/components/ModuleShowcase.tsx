'use client'

import { useEffect, useState } from 'react'

/**
 * Five-module walkthrough: the real interface on the left, the explanation on
 * the right.
 *
 * The images are screenshots of the running workbench, not illustrations, so
 * what a visitor sees here is what they get. They advance on their own but stop
 * as soon as the visitor picks a step by hand — an auto-rotating panel that
 * fights the reader is worse than a static one.
 */

type Step = {
  key: string
  image: string
  zh: { label: string; title: string; body: string }
  en: { label: string; title: string; body: string }
}

const STEPS: Step[] = [
  {
    key: 'ingest',
    image: '/demo/m1_ingest.png',
    zh: {
      label: '数据导入',
      title: '把材料带进来',
      body: '访谈转录、别人的编码表、QualCoder 项目都能读。五个公开数据集的格式已内置，导入后先给你看解析结果，确认了才落库。',
    },
    en: {
      label: 'Ingest',
      title: 'Bring the material in',
      body: 'Transcripts, someone else’s coding table, QualCoder projects. Five public dataset formats are built in, and the parse result is shown for confirmation before anything is stored.',
    },
  },
  {
    key: 'coding',
    image: '/demo/m2_coding.png',
    zh: {
      label: '编码',
      title: '逐段读，逐段标',
      body: '选中文字即可打标，编码本支持任意层级。人工编码与模型建议并排出现，每条建议都要你确认才会进入编码本。',
    },
    en: {
      label: 'Coding',
      title: 'Read closely, code precisely',
      body: 'Select text to code it. The codebook nests to any depth. Human coding and model suggestions sit side by side, and a suggestion only enters the codebook once you accept it.',
    },
  },
  {
    key: 'analyze',
    image: '/demo/m3_analyze.png',
    zh: {
      label: '分析',
      title: '一张关系网，看见联系',
      body: '主题是最大的球，编码次之，文本片段最小。橙色虚线连接在同一份访谈中重叠的编码——这些关系编码本本身并没有记录。点击主题即可只看它这一支，点击编码展开它的原文。',
    },
    en: {
      label: 'Analyse',
      title: 'A map of what connects to what',
      body: 'Themes are the largest nodes, codes next, passages smallest. Dashed edges join codes whose spans overlap in the same interview — relationships the codebook never recorded. Click a theme to isolate its family, click a code to open its passages.',
    },
  },
  {
    key: 'plot',
    image: '/demo/m4_plot.png',
    zh: {
      label: '绘图',
      title: '预览就是脚本的输出',
      body: '五类期刊级图表，参数在左侧调节。图上画的，就是导出的那段脚本画的——只有一条渲染路径，两者不可能不一致。',
    },
    en: {
      label: 'Plot',
      title: 'The preview is the script’s output',
      body: 'Five publication-grade figures with the parameters on the left. What you see is drawn by the same script you export — one renderer, so the two cannot drift apart.',
    },
  },
  {
    key: 'export',
    image: '/demo/m5_export.png',
    zh: {
      label: '导出',
      title: '交给合作者就能重跑',
      body: '数据 CSV、复现脚本、SVG / PDF / 300dpi PNG 一起打包。合作者不需要项目和原始数据，打开文件夹跑一次即可得到同一张图。',
    },
    en: {
      label: 'Export',
      title: 'A co-author can re-run it',
      body: 'The data CSV, the reproduction script and SVG / PDF / 300dpi PNG travel together. A co-author needs neither the project nor the raw data to get the same figure back.',
    },
  },
]

const CYCLE_MS = 5600

export default function ModuleShowcase({
  eyebrow,
  headline,
  body,
  locale = 'en',
}: {
  eyebrow?: string
  headline?: string
  body?: string
  locale?: string
}) {
  const zh = locale === 'zh'
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (manual) return
    const timer = setInterval(() => setActive((n) => (n + 1) % STEPS.length), CYCLE_MS)
    return () => clearInterval(timer)
  }, [manual])

  const pick = (index: number) => {
    setActive(index)
    setManual(true)
  }

  return (
    <section className="showcase" aria-label={zh ? '五个模块的走查' : 'Walkthrough of the five modules'}>
      <div className="wrap">
        {(eyebrow || headline || body) && (
          <header className="showcase__head">
            {eyebrow ? <p className="label">{eyebrow}</p> : null}
            {headline ? <h2 className="h2">{headline}</h2> : null}
            {body ? <p className="lede">{body}</p> : null}
          </header>
        )}

        <div className="showcase__grid">
          <figure className="showcase__stage">
            {STEPS.map((step, index) => (
              <img
                key={step.key}
                src={step.image}
                alt={(zh ? step.zh : step.en).title}
                className={index === active ? 'is-active' : ''}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            ))}
            <div className="showcase__dots" role="tablist">
              {STEPS.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={(zh ? step.zh : step.en).label}
                  className={index === active ? 'is-active' : ''}
                  onClick={() => pick(index)}
                >
                  <span className="showcase__dot" />
                  <span className="showcase__dot-label">{(zh ? step.zh : step.en).label}</span>
                </button>
              ))}
            </div>
          </figure>

          <ol className="showcase__list">
            {STEPS.map((step, index) => {
              const copy = zh ? step.zh : step.en
              return (
                <li key={step.key} className={index === active ? 'is-active' : ''}>
                  <button type="button" onClick={() => pick(index)} aria-current={index === active}>
                    <span className="showcase__index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="showcase__copy">
                      <strong>{copy.title}</strong>
                      <span>{copy.body}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
