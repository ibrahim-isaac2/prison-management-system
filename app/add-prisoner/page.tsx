"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { database } from "@/lib/firebase"
import { ref, push } from "firebase/database"
import type { Prisoner } from "@/lib/types"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, UserPlus } from "lucide-react"
import LoginForm from "@/components/login-form"
import { useRouter } from "next/navigation"
import BackToHomeButton from "@/components/back-to-home-button"
import Footer from "@/components/layout/footer"

export default function AddPrisonerPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Prisoner, "id">>({
    name: "",
    charge: "",
    prison: "",
    family: "",
    residence: "",
    years: "",
    from: "",
    to: "",
    submissions: "",
    phone: "",
    nationalId: "",
    signature: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const prisonersRef = ref(database, "prisoners")
      await push(prisonersRef, formData)

      setMessage({ type: "success", text: "تم إضافة السجين بنجاح" })
      setFormData({
        name: "",
        charge: "",
        prison: "",
        family: "",
        residence: "",
        years: "",
        from: "",
        to: "",
        submissions: "",
        phone: "",
        nationalId: "",
        signature: "",
      })

      setTimeout(() => {
        router.push("/prisoners")
      }, 2000)
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء إضافة السجين" })
    } finally {
      setLoading(false)
    }
  }

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

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription className="text-right" dir="rtl">
              ليس لديك صلاحية للوصول إلى هذه الصفحة
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <BackToHomeButton />

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-blue-800 text-right flex items-center justify-end">
              <UserPlus className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              إضافة سجين جديد
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {message && (
              <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
                <AlertDescription className="text-right" dir="rtl">
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right block">
                    الاسم *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="charge" className="text-right block">
                    التهمة *
                  </Label>
                  <Input
                    id="charge"
                    name="charge"
                    value={formData.charge}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prison" className="text-right block">
                    السجن *
                  </Label>
                  <Input
                    id="prison"
                    name="prison"
                    value={formData.prison}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family" className="text-right block">
                    الأهل *
                  </Label>
                  <Input
                    id="family"
                    name="family"
                    value={formData.family}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residence" className="text-right block">
                    الإقامة *
                  </Label>
                  <Input
                    id="residence"
                    name="residence"
                    value={formData.residence}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years" className="text-right block">
                    عدد السنوات *
                  </Label>
                  <Input
                    id="years"
                    name="years"
                    value={formData.years}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from" className="text-right block">
                    من تاريخ *
                  </Label>
                  <Input
                    id="from"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to" className="text-right block">
                    إلى تاريخ *
                  </Label>
                  <Input
                    id="to"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right block">
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId" className="text-right block">
                    الرقم القومي *
                  </Label>
                  <Input
                    id="nationalId"
                    name="nationalId"
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissions" className="text-right block">
                  ملاحظات
                </Label>
                <Textarea
                  id="submissions"
                  name="submissions"
                  value={formData.submissions}
                  onChange={handleInputChange}
                  className="text-right min-h-[100px]"
                  dir="rtl"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                  <Save className="ml-2 h-4 w-4" />
                  {loading ? "جاري الحفظ..." : "حفظ البيانات"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
