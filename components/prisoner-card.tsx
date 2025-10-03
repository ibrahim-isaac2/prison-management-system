"use client"

import type { Prisoner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, FileText, Edit, Trash2, Users, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface PrisonerCardProps {
  prisoner: Prisoner
  onEdit: (prisoner: Prisoner) => void
  onDelete: (prisonerId: string, prisonerName: string) => void
}

export default function PrisonerCard({ prisoner, onEdit, onDelete }: PrisonerCardProps) {
  const { user } = useAuth()

  return (
    <Card className="mb-4 overflow-hidden border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-card via-card to-muted/20">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 via-blue-600/5 to-transparent pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-right text-xl font-bold bg-gradient-to-l from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {prisoner.name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md px-3 py-1 text-sm font-semibold">
              {prisoner.prison}
            </Badge>
            {user?.isAuthenticated && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(prisoner)}
                  className="hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(prisoner.id, prisoner.name)}
                  className="hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-transparent hover:from-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">العائلة</span>
              <span className="text-sm font-semibold text-foreground">{prisoner.family || "غير محدد"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-transparent hover:from-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">الإقامة</span>
              <span className="text-sm font-semibold text-foreground">{prisoner.residence || "غير محدد"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-transparent hover:from-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">عدد الأبناء</span>
              <span className="text-sm font-semibold text-foreground">{prisoner.childrenCount || "غير محدد"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-slate-50 to-transparent hover:from-slate-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center shadow-md">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">الحالة الدراسية</span>
              <span className="text-sm font-semibold text-foreground">{prisoner.educationStatus || "غير محدد"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-transparent hover:from-blue-100 transition-colors border border-blue-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-blue-600 font-medium">مدة العقوبة</span>
              <span className="text-sm font-bold text-blue-700">{prisoner.years || "غير محدد"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-transparent hover:from-indigo-100 transition-colors border border-indigo-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-indigo-600 font-medium">الرقم القومي</span>
              <span className="text-sm font-bold text-indigo-700 font-mono">{prisoner.nationalId || "غير محدد"}</span>
            </div>
          </div>
        </div>

        {prisoner.submissions && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-r-4 border-amber-400 shadow-sm">
            <div className="flex items-start gap-2">
              <FileText className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-900 font-medium leading-relaxed">{prisoner.submissions}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
