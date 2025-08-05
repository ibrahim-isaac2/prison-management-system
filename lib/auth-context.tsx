"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import type { AuthUser, User } from "./types" // استيراد User type
import { database } from "@/lib/firebase" // استيراد Firebase database instance
import { ref, get } from "firebase/database" // استيراد get لقراءة البيانات مرة واحدة

interface AuthContextType {
  user: AuthUser | null
  login: (name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // تصحيح نوع children
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("prison-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (name: string): Promise<boolean> => {
    const trimmedName = name.trim()
    setIsLoading(true) // Set loading true during login attempt

    try {
      const usersRef = ref(database, "users")
      const snapshot = await get(usersRef) // جلب بيانات المستخدمين مرة واحدة
      const usersData = snapshot.val()

      if (usersData) {
        // التحقق في قائمة المسؤولين
        if (usersData.admins) {
          const adminsArray: User[] = Object.values(usersData.admins)
          const foundAdmin = adminsArray.find((admin) => admin.name && admin.name.trim() === trimmedName)
          if (foundAdmin) {
            const authUser: AuthUser = {
              name: foundAdmin.name,
              role: "admin",
              isAuthenticated: true,
            }
            setUser(authUser)
            localStorage.setItem("prison-user", JSON.stringify(authUser))
            setIsLoading(false)
            return true
          }
        }

        // التحقق في قائمة المستخدمين العاديين
        if (usersData.viewers) {
          const viewersArray: User[] = Object.values(usersData.viewers)
          const foundViewer = viewersArray.find((viewer) => viewer.name && viewer.name.trim() === trimmedName)
          if (foundViewer) {
            const authUser: AuthUser = {
              name: foundViewer.name,
              role: "viewer",
              isAuthenticated: true,
            }
            setUser(authUser)
            localStorage.setItem("prison-user", JSON.stringify(authUser))
            setIsLoading(false)
            return true
          }
        }
      }

      // إذا لم يتم العثور على المستخدم
      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Error during login from Firebase:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("prison-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
