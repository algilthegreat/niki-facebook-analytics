import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, isDemoMode } from '../firebase/config'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  initialized: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  init: () => () => void
}

const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@niki.app',
  displayName: 'Utilisateur Démo',
  photoURL: null,
  emailVerified: true,
} as unknown as User

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  init: () => {
    if (isDemoMode) {
      // En mode démo, pas de Firebase — on marque juste comme initialisé
      set({ initialized: true, user: null })
      return () => {}
    }
    if (!auth) {
      set({ initialized: true, user: null })
      return () => {}
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, initialized: true })
    })
    return unsubscribe
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 600))
        set({ user: DEMO_USER, loading: false, error: null })
        return
      }
      if (!auth) throw new Error('Firebase non configuré')
      await signInWithEmailAndPassword(auth, email, password)
      set({ loading: false })
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      const messages: Record<string, string> = {
        'auth/user-not-found': 'Aucun compte avec cet e-mail',
        'auth/wrong-password': 'Mot de passe incorrect',
        'auth/invalid-credential': 'E-mail ou mot de passe incorrect',
        'auth/too-many-requests': 'Trop de tentatives, réessayez plus tard',
        'auth/invalid-email': 'Adresse e-mail invalide',
      }
      set({
        error: messages[error.code || ''] || error.message || 'Erreur de connexion',
        loading: false,
      })
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null })
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 600))
        set({ user: { ...DEMO_USER, displayName: name } as User, loading: false, error: null })
        return
      }
      if (!auth || !db) throw new Error('Firebase non configuré')
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: name })
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: serverTimestamp(),
        plan: 'free',
      })
      set({ loading: false })
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string }
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'Un compte existe déjà avec cet e-mail',
        'auth/weak-password': 'Mot de passe trop faible',
        'auth/invalid-email': 'Adresse e-mail invalide',
      }
      set({
        error: messages[error.code || ''] || error.message || 'Erreur lors de la création du compte',
        loading: false,
      })
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 600))
        set({ user: DEMO_USER, loading: false, error: null })
        return
      }
      if (!auth || !db) throw new Error('Firebase non configuré')
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
          plan: 'free',
        })
      }
      set({ loading: false })
    } catch {
      set({ error: 'Erreur de connexion Google', loading: false })
    }
  },

  logout: async () => {
    if (isDemoMode || !auth) {
      set({ user: null })
      return
    }
    await signOut(auth)
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))
