"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import { deletePrisoner } from "@/lib/firebase-operations" // استيراد deletePrisoner
import type { Prisoner } from "@/lib/types"
import Navbar from "@/components/layout/navbar"
import PrisonerCard from "@/components/prisoner-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, Trash2 } from "lucide-react" // استيراد Trash2
import LoginForm from "@/components/login-form"
import BackToHomeButton from "@/components/back-to-home-button"
import Footer from "@/components/layout/footer"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EditPrisonerForm from "@/components/edit-prisoner-form"
import { Alert, AlertDescription } from "@/components/ui/alert" // استيراد Alert

export default function PrisonersPage() {
  const { user, isLoading } = useAuth()
  const [prisoners, setPrisoners] = useState<Prisoner[]>([])
  const [filteredPrisoners, setFilteredPrisoners] = useState<Prisoner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPrisoner, setSelectedPrisoner] = useState<Prisoner | null>(null)
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
      const prisonersRef = ref(database, "prisoners")
      const unsubscribe = onValue(prisonersRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const prisonersArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
          setPrisoners(prisonersArray)
          setFilteredPrisoners(prisonersArray)
        } else {
          setPrisoners([])
          setFilteredPrisoners([])
        }
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [user])

  useEffect(() => {
    const filtered = prisoners.filter(
      (prisoner) =>
        (prisoner.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prisoner.charge || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prisoner.prison || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prisoner.residence || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPrisoners(filtered)
  }, [searchTerm, prisoners])

  const handleEditPrisoner = (prisoner: Prisoner) => {
    setSelectedPrisoner(prisoner)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    console.log("Prisoner updated successfully!")
    setMessage({ type: "success", text: "تم تحديث بيانات السجين بنجاح!" })
    setTimeout(() => setMessage(null), 3000)
  }

  const confirmDeletePrisoner = (prisonerId: string, prisonerName: string) => {
    setDeleteConfirm({
      show: true,
      prisonerId,
      prisonerName,
    })
  }

  const handleDeletePrisoner = async () => {
    if (!deleteConfirm.prisonerId) return

    setMessage(null) // Clear previous messages
    try {
      await deletePrisoner(deleteConfirm.prisonerId)
      setMessage({ type: "success", text: `تم حذف السجين ${deleteConfirm.prisonerName} بنجاح!` })
      setDeleteConfirm({ show: false, prisonerId: "", prisonerName: "" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Error deleting prisoner:", error)
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف السجين." })
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
        <title>قائمة السجناء</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; direction: rtl; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #1e40af; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          h1 { text-align: center; color: #1e40af; }
          .header { text-align: center; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>قائمة السجناء</h1>
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
              <th>المدة</th>
              <th>من</th>
              <th>إلى</th>
              <th>الهاتف</th>
              <th>الرقم القومي</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPrisoners
              .map(
                (prisoner) => `
              <tr>
                <td>${prisoner.name || ""}</td>
                <td>${prisoner.charge || ""}</td>
                <td>${prisoner.prison || ""}</td>
                <td>${prisoner.family || ""}</td>
                <td>${prisoner.residence || ""}</td>
                <td>${prisoner.years || ""}</td>
                <td>${prisoner.from || ""}</td>
                <td>${prisoner.to || ""}</td>
                <td>${prisoner.phone || ""}</td>
                <td>${prisoner.nationalId || ""}</td>
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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600">جاري التحميل...</p>
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
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">قائمة السجناء ({filteredPrisoners.length})</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="البحث في السجناء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 w-full sm:w-64 text-right"
                dir="rtl"
              />
            </div>

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

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : filteredPrisoners.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">لا توجد بيانات سجناء</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredPrisoners.map((prisoner) => (
              <PrisonerCard
                key={prisoner.id}
                prisoner={prisoner}
                onEdit={handleEditPrisoner}
                onDelete={confirmDeletePrisoner} // Pass delete handler
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Prisoner Dialog */}
      {selectedPrisoner && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <EditPrisonerForm
            prisoner={selectedPrisoner}
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
              هل أنت متأكد من حذف السجين "{deleteConfirm.prisonerName}"؟
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
              <Button variant="destructive" onClick={handleDeletePrisoner} className="bg-red-600 hover:bg-red-700">
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
