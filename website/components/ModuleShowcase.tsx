'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Five-module walkthrough: the running interface on the left, the instructions
 * on the right.
 *
 * The reader drives it by scrolling. Whichever module is crossing the middle of
 * the viewport is the one playing on the left, so the clip and the text always
 * belong to the same module without anyone having to click. The left pane is
 * sticky, which is what makes that possible: it stays put while the right
 * column moves past it.
 *
 * The copy is written as instructions, not as a description of the feature.
 * Somebody who has never coded an interview should be able to read all five and
 * know what to do: each says what it is for, what to click, what appears
 * afterwards, and where people get stuck. The five "how" lists read in sequence
 * as one pass through the whole workflow.
 *
 * The clip is 880px wide. Anything narrower than about 700px renders the
 * interface inside it illegible, which is why this section breaks out of the
 * normal text column.
 */

type Copy = {
  label: string
  title: string
  /** What this module is for, in one sentence. */
  lead: string
  /** The operations, in order. */
  how: string[]
  /** What is on screen once you have done them. */
  see: string
  /** Where people get stuck. */
  snag?: string
}

type Step = { key: string; image: string; zh: Copy; en: Copy }

const STEPS: Step[] = [
  {
    key: 'ingest',
    image: '/demo/m1.gif',
    en: {
      label: 'Ingest',
      title: 'Bring the material in',
      lead: 'Turn a transcript into text you can read and mark.',
      how: [
        'Press Import interview, top right.',
        'Choose a TXT or DOCX file, or paste the transcript in.',
        'Check what it parsed — blank lines decide the segments, and Doctor: or Patient: is read as a speaker.',
        'Confirm.',
      ],
      see: 'A new entry in the document list. The transcript opens numbered per segment.',
      snag: 'DOCX gives you paragraph and table text only. Comments, headers and layout are dropped.',
    },
    zh: {
      label: '导入',
      title: '把材料带进来',
      lead: '把一份访谈稿变成可以逐段阅读、逐段标记的文本。',
      how: [
        '点右上角的 Import interview。',
        '选一个 TXT 或 DOCX 文件，或者直接把访谈稿粘进去。',
        '检查解析结果——空行决定分段，Doctor:、Patient: 会被读成说话人。',
        '确认。',
      ],
      see: '左侧文档列表多出一条。右侧打开正文，按段编号。',
      snag: 'DOCX 只取段落和表格文字。批注、页眉、版式会被丢掉。',
    },
  },
  {
    key: 'coding',
    image: '/demo/m2.gif',
    en: {
      label: 'Coding',
      title: 'Mark a passage, and let the codebook grow',
      lead: 'Attach a label to a passage. The codebook is built from what you read.',
      how: [
        'Select a sentence with the mouse.',
        'The coding box opens against the selection, not at the foot of the page.',
        'Type a keyword and press Enter — an existing code is reused, or a new one is created and applied in the same keystroke.',
        'Repeat. The margin shows which codes sit on the passage, and which theme each belongs to.',
      ],
      see: 'The text is marked, a pill appears in the margin, and the codebook counts go up.',
      snag: 'One passage can carry several codes. That is also what gives the relationship map something to draw — code every passage once and it stays empty.',
    },
    zh: {
      label: '编码',
      title: '标记一段，让编码本自己长出来',
      lead: '给一段话挂一个标签。编码本是读出来的，不是套模板套出来的。',
      how: [
        '用鼠标选中一句话。',
        '编码框贴着选区弹出，而不是弹在页面底部。',
        '输入关键词回车——已有编码会被复用，没有的就新建并同时应用。',
        '重复。边栏会显示这一段挂了哪些编码，以及每个属于哪个主题。',
      ],
      see: '选中的文字被标记，边栏出现编码标签，左侧编码本的计数往上涨。',
      snag: '一段话可以挂多个编码。这也正是关系图有内容可画的前提——每段只编一个码，那张图会一直是空的。',
    },
  },
  {
    key: 'analyze',
    image: '/demo/m3.gif',
    en: {
      label: 'Analyse',
      title: 'See what connects to what',
      lead: 'Stop reading and look at the shape the codings make.',
      how: [
        'Open Insights.',
        'Code frequency: how often each code was used.',
        'Document × code matrix: which participant raised what.',
        'The relationship map. Themes are the largest nodes, codes next, passages smallest — and the dashed edges join codes whose spans overlap inside one interview.',
      ],
      see: 'Charts built from the codings you just made, with nothing to configure first.',
      snag: 'Frequency counts passage–code links. It is not importance, and it is not a count of participants.',
    },
    zh: {
      label: '分析',
      title: '看看什么和什么连在一起',
      lead: '先别读了，看看编码本身构成了什么形状。',
      how: [
        '打开 Insights。',
        '编码频率：每个编码被用了多少次。',
        '文档 × 编码矩阵：哪位受访者谈到了什么。',
        '关系网。主题最大、编码次之、段落最小；虚线连的是同一份访谈里区间重叠的编码。',
      ],
      see: '直接由刚才那些编码生成的图，不需要先配置什么。',
      snag: '频率数的是"引用—编码链接"的条数。不代表重要性，也不代表受访者人数。',
    },
  },
  {
    key: 'plot',
    image: '/demo/m4.gif',
    en: {
      label: 'Plot',
      title: 'Draw a figure you can put in the paper',
      lead: 'Five publication figures, drawn by a script rather than by the browser.',
      how: [
        'Open Figures.',
        'Pick a figure type: frequency, coverage, co-occurrence, hierarchy, or accumulation.',
        'Set the options — what to group by, what to count within, palette, clustering, how many codes.',
        'The preview redraws. Then Download figure + script.',
      ],
      see: 'A folder with the counts as CSV, the script that drew the figure, and the figure as SVG, PDF and 300 dpi PNG.',
      snag: 'The figure is drawn by a Python script on the server. That is what makes the preview and the exported script agree — and it means matplotlib has to be installed.',
    },
    zh: {
      label: '绘图',
      title: '画一张能放进论文的图',
      lead: '五类期刊级图表，由脚本绘制，而不是由浏览器绘制。',
      how: [
        '打开 Figures。',
        '选图类型：频率、覆盖率、共现、层级，或累积。',
        '调参数——按什么分组、在什么范围内计数、配色、是否聚类、显示前几个编码。',
        '右侧预览会重画。然后点 Download figure + script。',
      ],
      see: '一个文件夹：计数 CSV、画出这张图的脚本，以及 SVG、PDF 和 300 dpi PNG。',
      snag: '图是服务器上的 Python 脚本画的。正因如此预览和导出的脚本产出必然一致——代价是需要装 matplotlib。',
    },
  },
  {
    key: 'export',
    image: '/demo/m5.gif',
    en: {
      label: 'Export',
      title: 'Hand over the process, not just the result',
      lead: 'Everything you did is already recorded. This is where you take it out.',
      how: ['Press Export, top right.', 'Choose what you need — there are four.'],
      see: 'The full project as JSON, restorable later. Codings as CSV with offsets and quotations. The document × code matrix as CSV. And a methods record in Markdown, assembled from the audit trail rather than remembered afterwards.',
      snag: 'The full project export contains the source transcripts. Treat it as research data.',
    },
    zh: {
      label: '导出',
      title: '交出去的是过程，不只是结果',
      lead: '你做的每一步都已经记下来了。这里是把它们拿出来的地方。',
      how: ['点右上角的 Export。', '选你要的——一共四种。'],
      see: '完整项目 JSON，之后可以恢复。编码 CSV，带字符偏移和引文。文档 × 编码矩阵 CSV。还有一份 Markdown 方法记录，从审计轨迹拼出来的。',
      snag: '完整项目导出里包含原始访谈稿。请按研究数据对待。',
    },
  },
]

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
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLLIElement[]
    if (!nodes.length) return
    if (typeof IntersectionObserver === 'undefined') return

    // The active module is the one crossing the middle of the viewport. The
    // band is narrow on purpose: a wide one would leave two modules active at
    // once and the pane would flicker between them.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          )[0]
        if (!hit) return
        const index = nodes.indexOf(hit.target as HTMLLIElement)
        if (index >= 0) setActive(index)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  // Clicking a step scrolls to it; the observer then makes it active. Keeping
  // one source of truth means the rail can never disagree with the pane.
  const pick = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const activeCopy = zh ? STEPS[active].zh : STEPS[active].en

  return (
    <section className="showcase" aria-label={zh ? '五个模块的走查' : 'Walkthrough of the five modules'}>
      <div className="wrap showcase__wrap">
        {(eyebrow || headline || body) && (
          <header className="showcase__head">
            {eyebrow ? <p className="label">{eyebrow}</p> : null}
            {headline ? <h2 className="h2">{headline}</h2> : null}
            {body ? <p className="lede">{body}</p> : null}
          </header>
        )}

        <div className="showcase__grid">
          <figure className="showcase__stage">
            <div className="showcase__stage-head">
              <span className="showcase__stage-n">{String(active + 1).padStart(2, '0')}</span>
              <div className="showcase__stage-meta">
                <span className="showcase__stage-label">{activeCopy.label}</span>
                <span className="showcase__stage-title">{activeCopy.title}</span>
              </div>
            </div>
            <div className="showcase__frames">
              {STEPS.map((step, index) => (
                <img
                  key={step.key}
                  src={step.image}
                  alt={(zh ? step.zh : step.en).title}
                  className={index === active ? 'is-active' : ''}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <div className="showcase__dots" role="tablist" aria-label={zh ? '五个模块' : 'The five modules'}>
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
              const open = index === active
              return (
                <li
                  key={step.key}
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  className={open ? 'is-active' : ''}
                >
                  <div className="showcase__item">
                    <button type="button" onClick={() => pick(index)} aria-current={open}>
                      <span className="showcase__index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="showcase__copy">
                        <strong>{copy.title}</strong>
                        <span>{copy.lead}</span>
                      </span>
                    </button>
                    <div className="showcase__how">
                      <ol>
                        {copy.how.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ol>
                      <p className="showcase__see">
                        <span className="showcase__note-label">
                          {zh ? '做完你会看到' : 'What you see'}
                        </span>
                        {copy.see}
                      </p>
                      {copy.snag ? (
                        <p className="showcase__snag">
                          <span className="showcase__note-label">
                            {zh ? '容易卡住' : 'Where people get stuck'}
                          </span>
                          {copy.snag}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
