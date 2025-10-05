"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Prisoner } from "@/lib/types"
import { updatePrisoner } from "@/lib/firebase-operations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Edit } from "lucide-react"

interface EditPrisonerFormProps {
  prisoner: Prisoner
  onClose: () => void
  onSuccess: () => void
}

export default function EditPrisonerForm({ prisoner, onClose, onSuccess }: EditPrisonerFormProps) {
  const [formData, setFormData] = useState<Omit<Prisoner, "id">>(prisoner)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    setFormData(prisoner)
  }, [prisoner])

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
      await updatePrisoner(prisoner.id, formData)
      setMessage({ type: "success", text: "تم تحديث بيانات السجين بنجاح" })
      onSuccess()
      setTimeout(onClose, 1500) // Close dialog after success
    } catch (error) {
      console.error("Error updating prisoner:", error)
      setMessage({ type: "error", text: "حدث خطأ أثناء تحديث بيانات السجين" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-right flex items-center justify-end text-blue-800">
          <Edit className="ml-2 h-5 w-5" />
          تعديل بيانات السجين: {prisoner.name}
        </DialogTitle>
      </DialogHeader>
      <div className="p-4 md:p-6">
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
                value={formData.name || ""}
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
                value={formData.charge || ""}
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
                value={formData.prison || ""}
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
                value={formData.family || ""}
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
                value={formData.residence || ""}
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
                value={formData.years || ""}
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
                value={formData.from || ""}
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
                value={formData.to || ""}
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
                value={formData.phone || ""}
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
                value={formData.nationalId || ""}
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
              value={formData.submissions || ""}
              onChange={handleInputChange}
              className="text-right min-h-[100px]"
              dir="rtl"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="ml-2 h-4 w-4" />
              {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
