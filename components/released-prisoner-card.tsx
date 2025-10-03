"use client"

import type { ReleasedPrisoner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, User, FileText, Edit, Trash2 } from "lucide-react" // استيراد Trash2
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface ReleasedPrisonerCardProps {
  prisoner: ReleasedPrisoner
  onEdit: (prisoner: ReleasedPrisoner) => void
  onDelete: (prisonerId: string, prisonerName: string) => void // New prop for delete action
}

export default function ReleasedPrisonerCard({ prisoner, onEdit, onDelete }: ReleasedPrisonerCardProps) {
  const { user } = useAuth()

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-right">{prisoner.name}</CardTitle>
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
      <CardContent>
        <div className="flex items-center space-x-2 space-x-reverse">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm">العائلة: {prisoner.family || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <MapPin className="h-4 w-4 text-gray-600" />
          <span className="text-sm">الإقامة: {prisoner.residence || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm">عدد الأبناء: {prisoner.childrenCount || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-sm">الحالة الدراسية: {prisoner.educationStatus || "غير محدد"}</span>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Calendar className="h-4 w-4 text-green-600" />
          <span className="text-sm">تاريخ الإفراج: {prisoner.releaseDate || "غير محدد"}</span>
        </div>

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
