import { create } from 'zustand'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db, isDemoMode } from '../firebase/config'
import { generateMockReport } from '../services/mockData'

export interface PostMetric {
  id: string
  message: string
  likes: number
  comments: number
  shares: number
  reach: number
  created_time: string
}

export interface DailyMetric {
  date: string
  reach: number
  engagement: number
  impressions: number
}

export interface Report {
  id: string
  userId: string
  pageName: string
  pageId: string
  pageCategory: string
  pagePicture: string
  fans: number
  reach: number
  engagement: number
  impressions: number
  postsCount: number
  topPosts: PostMetric[]
  dailyMetrics: DailyMetric[]
  createdAt: Timestamp | Date | string
}

interface ReportsState {
  reports: Report[]
  loading: boolean
  error: string | null
  fetchReports: (userId: string) => Promise<void>
  saveReport: (userId: string, report: Omit<Report, 'id' | 'userId' | 'createdAt'>) => Promise<string>
  deleteReport: (userId: string, reportId: string) => Promise<void>
  clearError: () => void
}

// Demo reports stored in memory
let demoReports: Report[] = []

export const useReportsStore = create<ReportsState>((set, get) => ({
  reports: [],
  loading: false,
  error: null,

  fetchReports: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 600))
        set({ reports: demoReports, loading: false })
        return
      }
      const q = query(
        collection(db, 'users', userId, 'reports'),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const reports = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Report[]
      set({ reports, loading: false })
    } catch {
      set({ error: 'Erreur lors du chargement des rapports', loading: false })
    }
  },

  saveReport: async (userId: string, report) => {
    try {
      if (isDemoMode) {
        const id = `demo-report-${Date.now()}`
        const newReport: Report = {
          ...report,
          id,
          userId,
          createdAt: new Date().toISOString(),
        }
        demoReports = [newReport, ...demoReports]
        set({ reports: demoReports })
        return id
      }
      const docRef = await addDoc(collection(db, 'users', userId, 'reports'), {
        ...report,
        userId,
        createdAt: serverTimestamp(),
      })
      await get().fetchReports(userId)
      return docRef.id
    } catch {
      throw new Error('Erreur lors de la sauvegarde')
    }
  },

  deleteReport: async (userId: string, reportId: string) => {
    try {
      if (isDemoMode) {
        demoReports = demoReports.filter((r) => r.id !== reportId)
        set({ reports: demoReports })
        return
      }
      await deleteDoc(doc(db, 'users', userId, 'reports', reportId))
      set({ reports: get().reports.filter((r) => r.id !== reportId) })
    } catch {
      throw new Error('Erreur lors de la suppression')
    }
  },

  clearError: () => set({ error: null }),
}))

export { generateMockReport }
