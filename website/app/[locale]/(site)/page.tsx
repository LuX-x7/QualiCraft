import HomeView from '@/components/site/HomeView'
import { SEO } from '@/lib/site/content'

export const metadata = { title: SEO.title, description: SEO.description }

export default function HomePage() {
  return <HomeView />
}
