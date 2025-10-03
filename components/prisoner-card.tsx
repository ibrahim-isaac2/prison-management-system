"use client"

import type { Prisoner } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, FileText, Edit, Trash2, Users, GraduationCap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface PrisonerCardProps {
  prisoner: Prisoner
  onEdit: (prisoner: Prisoner) => void
  onDelete: (prisonerId: string, prisonerName: string) => void
}

export default function PrisonerCard({ prisoner, onEdit, onDelete }: PrisonerCardProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

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

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all duration-300 hover:shadow-lg"
              size="lg"
            >
              <Eye className="h-5 w-5 ml-2" />
              عرض كل البيانات
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-right bg-gradient-to-l from-blue-600 to-blue-800 bg-clip-text text-transparent">
                البيانات الكاملة - {prisoner.name}
              </DialogTitle>
              <DialogDescription className="text-right">جميع المعلومات التفصيلية للسجين</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-blue-900">الاسم الكامل</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700 mr-13">{prisoner.name}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-indigo-100/50 border border-indigo-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-indigo-900">السجن</span>
                  </div>
                  <p className="text-lg font-bold text-indigo-700 mr-13">{prisoner.prison}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-emerald-900">العائلة</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-700 mr-13">{prisoner.family || "غير محدد"}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-orange-900">الإقامة</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700 mr-13">{prisoner.residence || "غير محدد"}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-pink-100/50 border border-pink-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-pink-900">عدد الأبناء</span>
                  </div>
                  <p className="text-lg font-bold text-pink-700 mr-13">{prisoner.childrenCount || "غير محدد"}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-purple-900">الحالة الدراسية</span>
                  </div>
                  <p className="text-lg font-bold text-purple-700 mr-13">{prisoner.educationStatus || "غير محدد"}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-cyan-100/50 border border-cyan-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-cyan-900">مدة العقوبة</span>
                  </div>
                  <p className="text-lg font-bold text-cyan-700 mr-13">{prisoner.years || "غير محدد"}</p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">الرقم القومي</span>
                  </div>
                  <p className="text-lg font-bold text-slate-700 mr-13 font-mono">
                    {prisoner.nationalId || "غير محدد"}
                  </p>
                </div>
              </div>

              {prisoner.submissions && (
                <div className="p-5 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-300 shadow-md">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-base font-bold text-amber-900">التقديمات</span>
                  </div>
                  <p className="text-base text-amber-900 leading-relaxed mr-13">{prisoner.submissions}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

