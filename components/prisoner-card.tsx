"use client"

import type { Prisoner } from "@/lib/types"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

// Dialog لعرض التفاصيل
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface PrisonerCardProps {
  prisoner: Prisoner
  onEdit: (prisoner: Prisoner) => void
  onDelete: (prisonerId: string, prisonerName: string) => void
}

export default function PrisonerCard({ prisoner, onEdit, onDelete }: PrisonerCardProps) {
  const { user } = useAuth()

  return (
    <Card className="mb-4 p-3 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* الاسم */}
          <CardTitle className="text-right">{prisoner.name}</CardTitle>

          {/* السجن + أزرار */}
          <div className="flex items-center gap-2">
            <Badge>{prisoner.prison}</Badge>
            {user?.isAuthenticated && (
              <>
                <Button size="sm" variant="ghost" onClick={() => onEdit(prisoner)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(prisoner.id, prisoner.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      {/* زر التفاصيل */}
      <div className="flex justify-end px-3 pb-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">عرض التفاصيل</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-lg">
            <DialogHeader>
              <DialogTitle>بيانات السجين</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-right text-sm">
              <p>العائلة: {prisoner.family || "غير محدد"}</p>
              <p>الإقامة: {prisoner.residence || "غير محدد"}</p>
              <p>عدد الأبناء: {prisoner.childrenCount || "غير محدد"}</p>
              <p>الحالة الدراسية: {prisoner.educationStatus || "غير محدد"}</p>
              <p>مدة العقوبة: {prisoner.years || "غير محدد"}</p>
              <p>من: {prisoner.from} - إلى: {prisoner.to}</p>
              <p>الرقم القومي: {prisoner.nationalId || "غير محدد"}</p>
              <p>الهاتف: {prisoner.phone || "غير محدد"}</p>
              <p>التوقيع: {prisoner.signature || "غير محدد"}</p>
              {prisoner.submissions && (
                <div className="mt-3 p-2 bg-yellow-50 rounded-md">
                  <p className="text-sm text-yellow-800">{prisoner.submissions}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  )
}
