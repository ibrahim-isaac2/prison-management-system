"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut, User, Users, UserPlus, FileText, FilePlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "الرئيسية", icon: FileText },
    { href: "/prisoners", label: "عرض السجناء", icon: Users },
    { href: "/released", label: "عرض المفرج عنهم", icon: Users },
  ]

  if (user?.role === "admin") {
    navItems.push(
      { href: "/add-prisoner", label: "إضافة سجين", icon: UserPlus },
      { href: "/add-released", label: "إضافة مفرج عنه", icon: FilePlus },
      { href: "/users", label: "إدارة المستخدمين", icon: User },
    )
  }

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-6 space-x-reverse hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="شعار النظام" width={40} height={40} className="rounded-full" />
            <h1 className="text-xl font-bold">نظام بيانات السجناء</h1>
          </Link>

          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center space-x-4 space-x-reverse">
            <span className="text-sm">مرحباً، {user?.name}</span>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="text-white border-white hover:bg-white hover:text-blue-800 bg-transparent"
            >
              <LogOut className="h-4 w-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 space-x-reverse px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-700 text-white"
                      : "text-blue-100 hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
