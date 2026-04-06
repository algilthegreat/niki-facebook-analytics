import { Report, PostMetric, DailyMetric } from '../store/reportsStore'

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export function generateMockReport(pageId: string, pageName: string): Omit<Report, 'id' | 'userId' | 'createdAt'> {
  const fans = randomBetween(1200, 85000)
  const reach = randomBetween(3000, 120000)
  const impressions = reach * randomBetween(2, 4)
  const engagementRate = randomBetween(3, 12)

  const dailyMetrics: DailyMetric[] = Array.from({ length: 28 }, (_, i) => ({
    date: formatDate(27 - i),
    reach: randomBetween(reach * 0.03, reach * 0.12),
    engagement: randomBetween(20, 800),
    impressions: randomBetween(impressions * 0.03, impressions * 0.1),
  }))

  const topPosts: PostMetric[] = [
    {
      id: '1',
      message: '🎉 Nouvelle offre exceptionnelle ! Découvrez nos produits en promotion cette semaine seulement.',
      likes: randomBetween(150, 2000),
      comments: randomBetween(20, 300),
      shares: randomBetween(10, 150),
      reach: randomBetween(5000, 50000),
      created_time: formatDate(randomBetween(1, 7)),
    },
    {
      id: '2',
      message: '📸 Découvrez les coulisses de notre équipe. Ensemble nous construisons quelque chose de grand !',
      likes: randomBetween(100, 1500),
      comments: randomBetween(15, 200),
      shares: randomBetween(5, 80),
      reach: randomBetween(3000, 35000),
      created_time: formatDate(randomBetween(3, 10)),
    },
    {
      id: '3',
      message: '💡 5 conseils pour améliorer votre productivité au quotidien. Enregistrez ce post !',
      likes: randomBetween(200, 3000),
      comments: randomBetween(30, 400),
      shares: randomBetween(50, 300),
      reach: randomBetween(8000, 80000),
      created_time: formatDate(randomBetween(5, 14)),
    },
    {
      id: '4',
      message: '🚀 Nous sommes ravis d\'annoncer le lancement de notre nouveau service !',
      likes: randomBetween(80, 1200),
      comments: randomBetween(10, 150),
      shares: randomBetween(8, 60),
      reach: randomBetween(2000, 25000),
      created_time: formatDate(randomBetween(10, 20)),
    },
    {
      id: '5',
      message: '❤️ Merci à tous nos clients fidèles pour votre soutien. Vous êtes incroyables !',
      likes: randomBetween(300, 4000),
      comments: randomBetween(40, 500),
      shares: randomBetween(20, 200),
      reach: randomBetween(10000, 90000),
      created_time: formatDate(randomBetween(14, 25)),
    },
  ].sort((a, b) => b.likes - a.likes)

  return {
    pageId,
    pageName: pageName || 'Page Facebook',
    pageCategory: 'Entreprise locale',
    pagePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(pageName)}&background=ff007b&color=fff&size=128`,
    fans,
    reach,
    engagement: engagementRate,
    impressions,
    postsCount: randomBetween(8, 30),
    topPosts,
    dailyMetrics,
  }
}

export const MOCK_PAGE_DATA = {
  id: 'demo-page-123',
  name: 'Ma Super Entreprise',
  category: 'Entreprise locale',
  picture: 'https://ui-avatars.com/api/?name=MSE&background=ff007b&color=fff&size=128',
  fan_count: 12847,
  followers_count: 13201,
  website: 'https://monentreprise.com',
  about: 'Bienvenue sur la page démo de NIKI Analytics',
}
