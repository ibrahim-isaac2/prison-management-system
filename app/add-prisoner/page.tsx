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
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AddPrisonerPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Prisoner, "id">>({
    name: "",
    charge: "",
    prison: "",
    family: "",
    residence: "",
    childrenCount: "",
    educationStatus: "",
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
        childrenCount: "",
        educationStatus: "",
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
        <div>جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">إضافة سجين جديد</CardTitle>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-4">
                <AlertDescription>{message.text}</AlertDescription>
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
                  <Label htmlFor="childrenCount" className="text-right block">
                    عدد الأبناء
                  </Label>
                  <Input
                    id="childrenCount"
                    name="childrenCount"
                    type="number"
                    value={formData.childrenCount}
                    onChange={handleInputChange}
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="educationStatus" className="text-right block">
                    الحالة الدراسية
                  </Label>
                  <Input
                    id="educationStatus"
                    name="educationStatus"
                    value={formData.educationStatus}
                    onChange={handleInputChange}
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
                    هاتف
                  </Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="text-right" dir="rtl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId" className="text-right block">
                    الرقم القومي
                  </Label>
                  <Input id="nationalId" name="nationalId" value={formData.nationalId} onChange={handleInputChange} className="text-right" dir="rtl" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signature" className="text-right block">
                    توقيع
                  </Label>
                  <Input id="signature" name="signature" value={formData.signature} onChange={handleInputChange} className="text-right" dir="rtl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="submissions" className="text-right block">
                  ملاحظات / مرافعات
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
    </div>
  )
}
