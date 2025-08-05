"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { deleteReleasedPrisoner } from "@/lib/firebase-operations" // استيراد دالة الحذف
import type { ReleasedPrisoner } from "@/lib/types"
import Navbar from "@/components/layout/navbar"
import ReleasedPrisonerCard from "@/components/released-prisoner-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, RefreshCw, Trash2 } from "lucide-react" // استيراد Trash2
import LoginForm from "@/components/login-form"
import BackToHomeButton from "@/components/back-to-home-button"
import Footer from "@/components/layout/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EditReleasedPrisonerForm from "@/components/edit-released-prisoner-form"
import { Alert, AlertDescription } from "@/components/ui/alert" // استيراد Alert

export default function ReleasedPage() {
  const { user, isLoading } = useAuth()
  const [releasedPrisoners, setReleasedPrisoners] = useState<ReleasedPrisoner[]>([])
  const [filteredReleased, setFilteredReleased] = useState<ReleasedPrisoner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedReleasedPrisoner, setSelectedReleasedPrisoner] = useState<ReleasedPrisoner | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    // New state for delete confirmation
    show: boolean
    prisonerId: string
    prisonerName: string
  }>({
    show: false,
    prisonerId: "",
    prisonerName: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null) // For success/error messages

  useEffect(() => {
    if (user?.isAuthenticated) {
      setLoading(true)
      setError(null)

      const releasedRef = ref(database, "released-prisoners")

      const unsubscribe = onValue(
        releasedRef,
        (snapshot) => {
          const data = snapshot.val()
          console.log("Firebase data snapshot for released-prisoners:", data)

          const combinedReleasedArray: ReleasedPrisoner[] = []

          if (data) {
            if (typeof data === "object" && !Array.isArray(data)) {
              Object.keys(data).forEach((key) => {
                if (key !== "releasedPrisoners") {
                  combinedReleasedArray.push({
                    id: key,
                    ...data[key],
                  })
                }
              })
            }

            if (data.releasedPrisoners && typeof data.releasedPrisoners === "object") {
              Object.keys(data.releasedPrisoners).forEach((key) => {
                combinedReleasedArray.push({
                  id: key,
                  ...data.releasedPrisoners[key],
                })
              })
            }
          }

          const validReleasedPrisoners = combinedReleasedArray.filter(
            (prisoner) => prisoner.name && prisoner.name.trim() !== "",
          )

          setReleasedPrisoners(validReleasedPrisoners)
          setFilteredReleased(validReleasedPrisoners)
          console.log("Combined and filtered released prisoners loaded:", validReleasedPrisoners.length)
          setLoading(false)
        },
        (err) => {
          console.error("Error loading released prisoners from Firebase:", err)
          setError("حدث خطأ أثناء تحميل بيانات المفرج عنهم: " + err.message)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } else {
      setLoading(false)
    }
  }, [user?.isAuthenticated])

  useEffect(() => {
    const filtered = releasedPrisoners.filter(
      (prisoner) =>
        (prisoner.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prisoner.charge || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prisoner.prison || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prisoner.residence || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredReleased(filtered)
  }, [searchTerm, releasedPrisoners])

  const handleEditReleasedPrisoner = (prisoner: ReleasedPrisoner) => {
    setSelectedReleasedPrisoner(prisoner)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    console.log("Released prisoner updated successfully! Firebase listener should auto-update.")
    setMessage({ type: "success", text: "تم تحديث بيانات المفرج عنه بنجاح!" })
    setTimeout(() => setMessage(null), 3000)
  }

  const confirmDeleteReleasedPrisoner = (prisonerId: string, prisonerName: string) => {
    setDeleteConfirm({
      show: true,
      prisonerId,
      prisonerName,
    })
  }

  const handleDeleteReleasedPrisoner = async () => {
    if (!deleteConfirm.prisonerId) return

    setMessage(null) // Clear previous messages
    try {
      await deleteReleasedPrisoner(deleteConfirm.prisonerId)
      setMessage({ type: "success", text: `تم حذف المفرج عنه ${deleteConfirm.prisonerName} بنجاح!` })
      setDeleteConfirm({ show: false, prisonerId: "", prisonerName: "" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error deleting released prisoner:", error)
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف المفرج عنه." })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>قائمة المفرج عنهم</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #16a34a; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          h1 { text-align: center; color: #16a34a; }
          .header { text-align: center; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة المفرج عنهم</h1>
          <p>تاريخ الطباعة: ${new Date().toLocaleDateString("ar-EG")}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>التهمة</th>
              <th>السجن</th>
              <th>الأهل</th>
              <th>الإقامة</th>
              <th>تاريخ الإفراج</th>
              <th>الهاتف</th>
              <th>الرقم القومي</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            ${filteredReleased
              .map(
                (prisoner) => `
              <tr>
                <td>${prisoner.name || ""}</td>
                <td>${prisoner.charge || ""}</td>
                <td>${prisoner.prison || ""}</td>
                <td>${prisoner.family || ""}</td>
                <td>${prisoner.residence || ""}</td>
                <td>${prisoner.releaseDate || ""}</td>
                <td>${prisoner.phone || ""}</td>
                <td>${prisoner.nationalId || ""}</td>
                <td>${prisoner.submissions || ""}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <BackToHomeButton />

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-green-800">
            قائمة المفرج عنهم ({filteredReleased.length})
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="البحث في المفرج عنهم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 w-full sm:w-64 text-right"
                dir="rtl"
              />
            </div>

            <Button
              onClick={() => {
                setLoading(true)
                setError(null)
              }}
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              تحديث البيانات
            </Button>

            <Button onClick={exportToPDF} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <Download className="ml-2 h-4 w-4" />
              تصدير PDF
            </Button>
          </div>
        </div>

        {message && (
          <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
            <AlertDescription className="text-right" dir="rtl">
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 text-right" dir="rtl">
              {error}
            </p>
            <Button
              onClick={() => {
                setLoading(true)
                setError(null)
              }}
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              إعادة المحاولة
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : filteredReleased.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">لا توجد بيانات مفرج عنهم</p>
            <Button
              onClick={() => {
                setLoading(true)
                setError(null)
              }}
              variant="outline"
            >
              <RefreshCw className="ml-2 h-4 w-4" />
              تحديث البيانات
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredReleased.map((prisoner) => (
              <ReleasedPrisonerCard
                key={prisoner.id}
                prisoner={prisoner}
                onEdit={handleEditReleasedPrisoner}
                onDelete={confirmDeleteReleasedPrisoner} // Pass delete handler
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Released Prisoner Dialog */}
      {selectedReleasedPrisoner && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <EditReleasedPrisonerForm
            prisoner={selectedReleasedPrisoner}
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={handleEditSuccess}
          />
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.show}
        onOpenChange={(open) => !open && setDeleteConfirm({ show: false, prisonerId: "", prisonerName: "" })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right text-red-600" dir="rtl">
              تأكيد الحذف
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-right" dir="rtl">
              هل أنت متأكد من حذف المفرج عنه "{deleteConfirm.prisonerName}"؟
            </p>
            <p className="text-sm text-gray-600 text-right" dir="rtl">
              لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm({ show: false, prisonerId: "", prisonerName: "" })}
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteReleasedPrisoner}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="ml-2 h-4 w-4" />
                حذف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
