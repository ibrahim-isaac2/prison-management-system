import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"

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

async function checkFirebaseData() {
  console.log("🔍 فحص البيانات في Firebase...")

  // Check prisoners
  const prisonersRef = ref(database, "prisoners")
  onValue(prisonersRef, (snapshot) => {
    const data = snapshot.val()
    console.log("👥 السجناء:", data ? Object.keys(data).length : 0, "سجين")
    if (data) {
      console.log("أول سجين:", Object.values(data)[0])
    }
  })

  // Check released prisoners
  const releasedRef = ref(database, "released-prisoners")
  onValue(releasedRef, (snapshot) => {
    const data = snapshot.val()
    console.log("🆓 المفرج عنهم:", data ? Object.keys(data).length : 0, "مفرج عنه")
    if (data) {
      console.log("أول مفرج عنه:", Object.values(data)[0])
    }
  })

  // Check users
  const usersRef = ref(database, "users")
  onValue(usersRef, (snapshot) => {
    const data = snapshot.val()
    let totalUsers = 0
    if (data) {
      if (data.admins) totalUsers += Object.keys(data.admins).length
      if (data.viewers) totalUsers += Object.keys(data.viewers).length
    }
    console.log("👤 المستخدمين:", totalUsers, "مستخدم")
    if (data) {
      console.log("المسؤولين:", data.admins ? Object.keys(data.admins).length : 0)
      console.log("المستخدمين العاديين:", data.viewers ? Object.keys(data.viewers).length : 0)
    }
  })

  setTimeout(() => {
    console.log("✅ انتهى فحص البيانات")
    process.exit(0)
  }, 3000)
}

checkFirebaseData()
