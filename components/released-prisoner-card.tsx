"use client"

import type { ReleasedPrisoner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, User, FileText, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context" // Import useAuth

interface ReleasedPrisonerCardProps {
  prisoner: ReleasedPrisoner
  onEdit: (prisoner: ReleasedPrisoner) => void // New prop for edit action
}

export default function ReleasedPrisonerCard({ prisoner, onEdit }: ReleasedPrisonerCardProps) {
  const { user } = useAuth() // Use auth context to check role

  return (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-green-800 text-right flex justify-between items-center" dir="rtl">
          {prisoner.name || "غير محدد"}
          {user?.role === "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(prisoner)}
              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">تعديل</span>
            </Button>
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
