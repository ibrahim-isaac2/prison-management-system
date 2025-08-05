"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue } from "firebase/database"
import type { Prisoner } from "@/lib/types"
import Navbar from "@/components/layout/navbar"
import PrisonerCard from "@/components/prisoner-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search } from "lucide-react"
import LoginForm from "@/components/login-form"
import BackToHomeButton from "@/components/back-to-home-button"
import Footer from "@/components/layout/footer"
import { Dialog } from "@/components/ui/dialog" // Import Dialog components
import EditPrisonerForm from "@/components/edit-prisoner-form" // Import new edit form

export default function PrisonersPage() {
  const { user, isLoading } = useAuth()
  const [prisoners, setPrisoners] = useState<Prisoner[]>([])
  const [filteredPrisoners, setFilteredPrisoners] = useState<Prisoner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false) // State for edit dialog
  const [selectedPrisoner, setSelectedPrisoner] = useState<Prisoner | null>(null) // State for selected prisoner to edit

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
    // Optionally re-fetch or update state if needed, though onValue listener should handle it
    console.log("Prisoner updated successfully!")
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
              <PrisonerCard key={prisoner.id} prisoner={prisoner} onEdit={handleEditPrisoner} />
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

      <Footer />
    </div>
  )
}
