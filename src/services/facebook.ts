import axios from 'axios'

const GRAPH_API = 'https://graph.facebook.com/v19.0'
const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID || ''

export interface FBPageInfo {
  id: string
  name: string
  category: string
  fan_count: number
  followers_count: number
  picture: { data: { url: string } }
  about?: string
  website?: string
}

export interface FBInsight {
  name: string
  period: string
  values: { value: number; end_time: string }[]
}

export interface FBPost {
  id: string
  message: string
  created_time: string
  likes?: { summary: { total_count: number } }
  comments?: { summary: { total_count: number } }
  shares?: { count: number }
  insights?: { data: FBInsight[] }
}

class FacebookService {
  private accessToken: string | null = null

  setAccessToken(token: string) {
    this.accessToken = token
    localStorage.setItem('fb_access_token', token)
  }

  getAccessToken(): string | null {
    if (this.accessToken) return this.accessToken
    return localStorage.getItem('fb_access_token')
  }

  clearAccessToken() {
    this.accessToken = null
    localStorage.removeItem('fb_access_token')
  }

  isConnected(): boolean {
    return !!this.getAccessToken()
  }

  async login(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!APP_ID) {
        reject(new Error('Facebook App ID non configuré'))
        return
      }

      const width = 600
      const height = 700
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const redirectUri = `${window.location.origin}/auth/facebook/callback`
      const scope = 'pages_show_list,pages_read_engagement,read_insights,pages_read_user_content'
      const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=token`

      const popup = window.open(
        authUrl,
        'FacebookLogin',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      if (!popup) {
        reject(new Error('Popup bloquée. Autorisez les popups pour ce site.'))
        return
      }

      const timer = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(timer)
            reject(new Error('Connexion annulée'))
            return
          }
          const url = popup.location.href
          if (url.includes('access_token=')) {
            const params = new URLSearchParams(url.split('#')[1])
            const token = params.get('access_token')
            if (token) {
              this.setAccessToken(token)
              popup.close()
              clearInterval(timer)
              resolve(token)
            }
          }
        } catch {
          // Cross-origin, wait
        }
      }, 500)
    })
  }

  async getPageInfo(pageIdOrUsername: string): Promise<FBPageInfo> {
    const token = this.getAccessToken()
    if (!token) throw new Error('Non connecté à Facebook')

    const { data } = await axios.get(`${GRAPH_API}/${pageIdOrUsername}`, {
      params: {
        fields: 'id,name,category,fan_count,followers_count,picture.type(large),about,website',
        access_token: token,
      },
    })
    return data
  }

  async getPageInsights(pageId: string, token?: string): Promise<FBInsight[]> {
    const accessToken = token || this.getAccessToken()
    if (!accessToken) throw new Error('Non connecté à Facebook')

    const metrics = [
      'page_impressions',
      'page_reach',
      'page_engaged_users',
      'page_post_engagements',
    ].join(',')

    const since = Math.floor((Date.now() - 28 * 24 * 60 * 60 * 1000) / 1000)
    const until = Math.floor(Date.now() / 1000)

    const { data } = await axios.get(`${GRAPH_API}/${pageId}/insights`, {
      params: {
        metric: metrics,
        period: 'day',
        since,
        until,
        access_token: accessToken,
      },
    })
    return data.data
  }

  async getPagePosts(pageId: string, token?: string): Promise<FBPost[]> {
    const accessToken = token || this.getAccessToken()
    if (!accessToken) throw new Error('Non connecté à Facebook')

    const { data } = await axios.get(`${GRAPH_API}/${pageId}/posts`, {
      params: {
        fields: 'id,message,created_time,likes.summary(true),comments.summary(true),shares,insights.metric(post_impressions,post_reach)',
        limit: 20,
        access_token: accessToken,
      },
    })
    return data.data
  }

  async getUserPages(): Promise<{ id: string; name: string; access_token: string }[]> {
    const token = this.getAccessToken()
    if (!token) throw new Error('Non connecté à Facebook')

    const { data } = await axios.get(`${GRAPH_API}/me/accounts`, {
      params: { access_token: token },
    })
    return data.data
  }
}

export const facebookService = new FacebookService()
