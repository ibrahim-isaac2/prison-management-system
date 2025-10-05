export interface Prisoner {
  id: string
  name: string
  charge: string
  prison: string
  family: string
  residence: string
  years: string
  from: string
  to: string
  submissions: string
  phone: string
  nationalId: string
  signature: string
}

export interface ReleasedPrisoner {
  id: string
  name: string
  charge: string
  prison: string
  family: string
  residence: string
  releaseDate?: string // جعلها اختيارية لأنها قد تكون ناقصة
  submissions?: string // جعلها اختيارية لأنها تظهر في بعض السجلات
  phone: string
  nationalId: string
  signature: string
  from?: string // حقول إضافية اختيارية
  to?: string
  years?: string
}

export interface User {
  id?: string
  name: string
  role: "admin" | "viewer"
}

export interface AuthUser {
  name: string
  role: "admin" | "viewer"
  isAuthenticated: boolean
}
