"use client"

import type { Prisoner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, User, FileText, Edit, Trash2 } from "lucide-react" // استيراد Trash2
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface PrisonerCardProps {
  prisoner: Prisoner
  onEdit: (prisoner: Prisoner) => void
  onDelete: (prisonerId: string, prisonerName: string) => void // New prop for delete action
}

export default function PrisonerCard({ prisoner, onEdit, onDelete }: PrisonerCardProps) {
  const { user } = useAuth()

  return (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-blue-800 text-right flex justify-between items-center" dir="rtl">
          {prisoner.name || "غير محدد"}
          {user?.role === "admin" && (
            <div className="flex gap-2">
              {" "}
              {/* Group buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(prisoner)}
                className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">تعديل</span>
              </Button>
              <Button
                variant="destructive" // Style for delete button
                size="sm"
                onClick={() => onDelete(prisoner.id, prisoner.name)} // Call onDelete
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">حذف</span>
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
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm">{prisoner.prison || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <User className="h-4 w-4 text-blue-600" />
          <span className="text-sm">{prisoner.family || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm">{prisoner.residence || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm">{prisoner.years || "غير محدد"} سنة</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm">
            من {prisoner.from || "غير محدد"} إلى {prisoner.to || "غير محدد"}
          </span>
        </div>

        {prisoner.phone && (
          <div className="flex items-center space-x-2 space-x-reverse">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-sm">{prisoner.phone}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 space-x-reverse">
          <FileText className="h-4 w-4 text-blue-600" />
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
