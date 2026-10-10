import Link from 'next/link'
import { getDict, localePath } from '@/lib/kernel/i18n'

export default async function NotFound({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const dict = await getDict(locale)
  const t = dict.t
  const href = (path: string) => localePath(dict.locale, path)

  return (
    <main className="wrap notfound">
      <p className="label">404</p>
      <h1 className="h1" style={{ marginBottom: 18 }}>
        {t('notFound.title')}
      </h1>
      <p className="lede" style={{ margin: '0 auto 30px' }}>
        {t('notFound.body')}
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link className="btn btn--fg" href={href('/')}>
          {t('notFound.home')}
        </Link>
        <Link className="btn btn--ghost" href={href('/w')}>
          {t('notFound.workspace')}
        </Link>
      </div>
    </main>
  )
}
