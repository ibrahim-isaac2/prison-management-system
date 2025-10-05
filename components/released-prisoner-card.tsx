"use client"

import type { ReleasedPrisoner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, User, FileText, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useState } from "react"

interface ReleasedPrisonerCardProps {
  prisoner: ReleasedPrisoner
  onEdit: (prisoner: ReleasedPrisoner) => void
}

export default function ReleasedPrisonerCard({ prisoner, onEdit }: ReleasedPrisonerCardProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المفرج عنه "${name}"؟`)) return
    try {
      setLoading(true)
      await deleteDoc(doc(db, "released", id))
      alert("✅ تم حذف المفرج عنه بنجاح")
      window.location.reload()
    } catch (error) {
      console.error("❌ خطأ أثناء الحذف:", error)
      alert("حدث خطأ أثناء الحذف")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-green-800 text-right flex justify-between items-center" dir="rtl">
          {prisoner.name || "غير محدد"}
          {user?.role === "admin" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(prisoner)}
                className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={loading}
                onClick={() => handleDelete(prisoner.id, prisoner.name)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardTitle>
        <Badge variant="secondary" className="w-fit text-right">
          {prisoner.charge || "غير محدد"}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3 text-right flex-1" dir="rtl">
        <div className="flex items-center space-x-2 space-x-reverse">
          <MapPin className="h-4 w-4 text-green-600" />
          <span className="text-sm">{prisoner.prison || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm">{prisoner.family || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <MapPin className="h-4 w-4 text-green-600" />
          <span className="text-sm">{prisoner.residence || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Calendar className="h-4 w-4 text-green-600" />
          <span className="text-sm">تاريخ الإفراج: {prisoner.releaseDate || "غير محدد"}</span>
        </div>

        {prisoner.phone && (
          <div className="flex items-center space-x-2 space-x-reverse">
            <Phone className="h-4 w-4 text-green-600" />
            <span className="text-sm">{prisoner.phone}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 space-x-reverse">
          <FileText className="h-4 w-4 text-green-600" />
          <span className="text-sm">الرقم القومي: {prisoner.nationalId || "غير محدد"}</span>
        </div>

        {prisoner.submissions && (
          <div className="mt-3 p-2 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-800">{prisoner.submissions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
