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
  2: {
    name: "ثابت عيد زاهي",
    charge: "اتلاف",
    prison: "المنيا",
    family: "حنان عيد عزيز",
    residence: "مطاي",
    releaseDate: "10/2024",
    submissions: "",
    phone: "011195179",
    nationalId: "",
    signature: "",
    childrenCount: "",
    educationStatus: "",
  },
  // ... أكمل بنفس الصيغة إذا أردت تحميل المزيد
}

async function seedReleasedPrisoners() {
  try {
    console.log("بدء تحميل بيانات المفرج عنهم إلى Firebase...")

    // Seed released prisoners data
    await set(ref(database, "released-prisoners"), releasedPrisonersData)
    console.log("تم تحميل بيانات المفرج عنهم بنجاح")

    console.log("تم تحميل جميع بيانات المفرج عنهم بنجاح!")
  } catch (error) {
    console.error("خطأ في تحميل البيانات:", error)
  }
}

seedReleasedPrisoners()
