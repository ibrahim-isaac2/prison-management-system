"use client"

import { useAuth } from "@/lib/auth-context"
import LoginForm from "@/components/login-form"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, FileText, FilePlus, Shield, Eye } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return <LoginForm />
  }

  const adminCards = [
    {
      title: "إضافة سجين",
      description: "إضافة بيانات سجين جديد",
      href: "/add-prisoner",
      icon: UserPlus,
      color: "bg-blue-500",
    },
    {
      title: "إضافة مفرج عنه",
      description: "إضافة بيانات مفرج عنه جديد",
      href: "/add-released",
      icon: FilePlus,
      color: "bg-green-500",
    },
    {
      title: "إدارة المستخدمين",
      description: "إضافة وإدارة المستخدمين",
      href: "/users",
      icon: Shield,
      color: "bg-purple-500",
    },
  ]

  const viewCards = [
    {
      title: "عرض السجناء",
      description: "عرض جميع بيانات السجناء",
      href: "/prisoners",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "عرض المفرج عنهم",
      description: "عرض جميع بيانات المفرج عنهم",
      href: "/released",
      icon: FileText,
      color: "bg-green-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">مرحباً بك في نظام بيانات السجناء</h1>
          <p className="text-gray-600 text-sm md:text-base">
            خدمة السجناء والمسجونين - {user.role === "admin" ? "مسؤول" : "مستخدم عادي"}
          </p>
          <div className="flex items-center justify-center mt-2">
            {user.role === "admin" ? (
              <Shield className="h-5 w-5 text-blue-600 ml-2" />
            ) : (
              <Eye className="h-5 w-5 text-green-600 ml-2" />
            )}
            <span className="text-sm font-medium">
              {user.role === "admin" ? "صلاحيات كاملة" : "صلاحيات المشاهدة فقط"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {viewCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.href} href={card.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader className="p-4 md:p-6">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 ${card.color} rounded-lg flex items-center justify-center mb-3 md:mb-4`}
                    >
                      <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                    </div>
                    <CardTitle className="text-right text-base md:text-lg" dir="rtl">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-right text-sm" dir="rtl">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}

          {user.role === "admin" &&
            adminCards.map((card) => {
              const Icon = card.icon
              return (
                <Link key={card.href} href={card.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardHeader className="p-4 md:p-6">
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 ${card.color} rounded-lg flex items-center justify-center mb-3 md:mb-4`}
                      >
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <CardTitle className="text-right text-base md:text-lg" dir="rtl">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="text-right text-sm" dir="rtl">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
        </div>
      </div>

      <Footer />
    </div>
  )
}
