"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { database } from "@/lib/firebase"
import { ref, onValue, push, remove } from "firebase/database"
import type { User } from "@/lib/types"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Shield, Eye, Trash2 } from "lucide-react"
import LoginForm from "@/components/login-form"
import BackToHomeButton from "@/components/back-to-home-button"
import Footer from "@/components/layout/footer"

export default function UsersPage() {
  const { user, isLoading } = useAuth()
  const [users, setUsers] = useState<{ admins: User[]; viewers: User[] }>({ admins: [], viewers: [] })
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", role: "viewer" as "admin" | "viewer" })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean
    userId: string
    userName: string
    userRole: string
  }>({
    show: false,
    userId: "",
    userName: "",
    userRole: "",
  })

  useEffect(() => {
    if (user?.isAuthenticated && user.role === "admin") {
      const usersRef = ref(database, "users")
      const unsubscribe = onValue(usersRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          // Convert Firebase objects to arrays
          const adminsArray = data.admins
            ? Object.keys(data.admins).map((key) => ({
                id: key,
                ...data.admins[key],
              }))
            : []

          const viewersArray = data.viewers
            ? Object.keys(data.viewers).map((key) => ({
                id: key,
                ...data.viewers[key],
              }))
            : []

          setUsers({
            admins: adminsArray,
            viewers: viewersArray,
          })
        } else {
          setUsers({ admins: [], viewers: [] })
        }
        setLoading(false)
      })

      return () => unsubscribe()
    }
  }, [user])

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const userRef = ref(database, `users/${newUser.role}s`)
      await push(userRef, { name: newUser.name, role: newUser.role })

      setMessage({ type: "success", text: "تم إضافة المستخدم بنجاح" })
      setNewUser({ name: "", role: "viewer" })
      setIsDialogOpen(false)
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء إضافة المستخدم" })
    }
  }

  const handleDeleteUser = async () => {
    if (!deleteConfirm.userId) return

    try {
      const userRef = ref(database, `users/${deleteConfirm.userRole}s/${deleteConfirm.userId}`)
      await remove(userRef)

      setMessage({ type: "success", text: "تم حذف المستخدم بنجاح" })
      setDeleteConfirm({ show: false, userId: "", userName: "", userRole: "" })
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء حذف المستخدم" })
    }
  }

  const confirmDelete = (userId: string, userName: string, userRole: string) => {
    setDeleteConfirm({
      show: true,
      userId,
      userName,
      userRole,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user?.isAuthenticated) {
    return <LoginForm />
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription className="text-right" dir="rtl">
              ليس لديك صلاحية للوصول إلى هذه الصفحة
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-1">
        <BackToHomeButton />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-purple-800">إدارة المستخدمين</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                <UserPlus className="ml-2 h-4 w-4" />
                إضافة مستخدم جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right" dir="rtl">
                  إضافة مستخدم جديد
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-right block">
                    اسم المستخدم
                  </Label>
                  <Input
                    id="userName"
                    value={newUser.name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="text-right"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userRole" className="text-right block">
                    نوع المستخدم
                  </Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: "admin" | "viewer") => setNewUser((prev) => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">مستخدم عادي</SelectItem>
                      <SelectItem value="admin">مسؤول</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  إضافة المستخدم
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirm.show}
          onOpenChange={(open) => !open && setDeleteConfirm({ show: false, userId: "", userName: "", userRole: "" })}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right text-red-600" dir="rtl">
                تأكيد الحذف
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-right" dir="rtl">
                هل أنت متأكد من حذف المستخدم "{deleteConfirm.userName}"؟
              </p>
              <p className="text-sm text-gray-600 text-right" dir="rtl">
                لا يمكن التراجع عن هذا الإجراء.
              </p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirm({ show: false, userId: "", userName: "", userRole: "" })}
                >
                  إلغاء
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {message && (
          <Alert variant={message.type === "success" ? "default" : "destructive"} className="mb-6">
            <AlertDescription className="text-right" dir="rtl">
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-purple-800 mb-4 flex items-center">
                <Shield className="ml-2 h-5 w-5" />
                المسؤولين ({users.admins.length})
              </h2>
              {users.admins.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">لا توجد بيانات مسؤولين</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.admins.map((admin, index) => (
                    <Card key={admin.id || index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle
                          className="text-base md:text-lg text-purple-800 text-right flex items-center justify-between"
                          dir="rtl"
                        >
                          {admin.name || "غير محدد"}
                          <Badge variant="default" className="bg-purple-600">
                            <Shield className="h-3 w-3 ml-1" />
                            مسؤول
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(admin.id || "", admin.name, "admin")}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف المستخدم
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <Eye className="ml-2 h-5 w-5" />
                المستخدمين العاديين ({users.viewers.length})
              </h2>
              {users.viewers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">لا توجد بيانات مستخدمين عاديين</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.viewers.map((viewer, index) => (
                    <Card key={viewer.id || index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle
                          className="text-base md:text-lg text-blue-800 text-right flex items-center justify-between"
                          dir="rtl"
                        >
                          {viewer.name || "غير محدد"}
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <Eye className="h-3 w-3 ml-1" />
                            مستخدم عادي
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(viewer.id || "", viewer.name, "viewer")}
                          className="w-full bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="ml-2 h-4 w-4" />
                          حذف المستخدم
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
