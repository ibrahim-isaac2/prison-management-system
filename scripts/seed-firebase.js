import { initializeApp } from "firebase/app"
import { getDatabase, ref, set } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyB_LG82u1equVtCmTbeQ5miPPUa4W7sl0M",
  authDomain: "prisons-4fae0.firebaseapp.com",
  databaseURL: "https://prisons-4fae0-default-rtdb.firebaseio.com",
  projectId: "prisons-4fae0",
  storageBucket: "prisons-4fae0.firebasestorage.app",
  messagingSenderId: "776182017766",
  appId: "1:776182017766:web:01704f6996efd218d4d527",
  measurementId: "G-2ZFLFWPJWV",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const prisonersData = {
  1: {
    name: "وديع حبيب سلامة",
    charge: "سرقة",
    prison: "15 مايو",
    family: "نوارة فايز حنا",
    residence: "مغاغة",
    years: "7",
    from: "9/2023",
    to: "9/2030",
    submissions: "",
    phone: "01286802529",
    nationalId: "27311192402244",
    signature: "",
    childrenCount: "",
    educationStatus: "",
  },
  // ... بقية العناصر بنفس البنية
}

const releasedPrisonersData = {
  1: {
    name: "ايهاب شحاتة عزيز",
    charge: "مخدرات",
    prison: "وادي النطرون",
    family: "نرمين مجدي عطية",
    residence: "سمالوط",
    releaseDate: "6/2024",
    submissions: "",
    phone: "01066826781",
    nationalId: "29810152403101",
    signature: "",
    childrenCount: "",
    educationStatus: "",
  },
  // ... بقية العناصر بنفس البنية
}

async function seedDatabase() {
  try {
    console.log("بدء تحميل بيانات إلى Firebase...")

    // Seed prisoners data
    await set(ref(database, "prisoners"), prisonersData)
    console.log("تم تحميل بيانات السجناء بنجاح")

    // Seed released prisoners data
    await set(ref(database, "released-prisoners"), releasedPrisonersData)
    console.log("تم تحميل بيانات المفرج عنهم بنجاح")

    console.log("تم تحميل جميع البيانات بنجاح!")
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error)
  }
}

seedDatabase()
