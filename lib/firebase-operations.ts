import { database } from "./firebase"
import { ref, onValue, push, remove, update, set } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import type { Prisoner, ReleasedPrisoner, User } from "./types"

// Real-time listeners for data (معدل مع تشخيص)
export const listenToPrisoners = (callback: (prisoners: Prisoner[]) => void) => {
  const prisonersRef = ref(database, "prisoners")
  return onValue(prisonersRef, (snapshot) => {
    const data = snapshot.val()
    console.log("Prisoners snapshot data:", data) // للتشخيص
    const prisonersArray: Prisoner[] = []
    if (data) {
      // Direct under "prisoners" (flat structure - new/default)
      if (typeof data === "object" && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => {
          console.log(`Found prisoner with key: ${key}`, data[key]) // للتشخيص
          prisonersArray.push({
            id: key,
            ...data[key],
          })
        })
      }

      // Nested "prisoners" (old structure - للتوافق إذا بقي شيء)
      if (data.prisoners && typeof data.prisoners === "object") {
        Object.keys(data.prisoners).forEach((key) => {
          console.log(`Found nested prisoner with key: ${key}`, data.prisoners[key]) // للتشخيص
          prisonersArray.push({
            id: key,
            ...data.prisoners[key],
          })
        })
      }

      console.log("Total prisoners loaded:", prisonersArray.length) // للتشخيص
      callback(prisonersArray) // عرض الكل بدون تصفية
    } else {
      console.log("No prisoners data found") // للتشخيص
      callback([])
    }
  })
}

export const listenToReleasedPrisoners = (callback: (released: ReleasedPrisoner[]) => void) => {
  const releasedRef = ref(database, "released-prisoners")
  return onValue(releasedRef, (snapshot) => {
    const data = snapshot.val()
    console.log("Released prisoners snapshot data:", data) // للتشخيص
    const combinedReleasedArray: ReleasedPrisoner[] = []

    if (data) {
      // Direct under "released-prisoners" (flat structure - new/default بعد الاستيراد)
      if (typeof data === "object" && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => {
          console.log(`Found released prisoner with key: ${key}`, data[key]) // للتشخيص
          combinedReleasedArray.push({
            id: key,
            ...data[key],
          })
        })
      }

      // Nested "releasedPrisoners" (old structure - للتوافق إذا بقي)
      if (data.releasedPrisoners && typeof data.releasedPrisoners === "object") {
        Object.keys(data.releasedPrisoners).forEach((key) => {
          console.log(`Found nested released prisoner with key: ${key}`, data.releasedPrisoners[key]) // للتشخيص
          combinedReleasedArray.push({
            id: key,
            ...data.releasedPrisoners[key],
          })
        })
      }

      console.log("Total released prisoners loaded:", combinedReleasedArray.length) // للتشخيص
      callback(combinedReleasedArray) // عرض الكل بدون تصفية
    } else {
      console.log("No released prisoners data found") // للتشخيص
      callback([])
    }
  })
}

export const listenToUsers = (callback: (users: { admins: User[]; viewers: User[] }) => void) => {
  const usersRef = ref(database, "users")
  return onValue(usersRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
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

      callback({
        admins: adminsArray,
        viewers: viewersArray,
      })
    } else {
      callback({ admins: [], viewers: [] })
    }
  })
}

// Add operations
export const addPrisoner = async (prisoner: Omit<Prisoner, "id">) => {
  const prisonersRef = ref(database, "prisoners")
  return await push(prisonersRef, prisoner)
}

export const addReleasedPrisoner = async (released: Omit<ReleasedPrisoner, "id">) => {
  const releasedRef = ref(database, "released-prisoners")
  return await push(releasedRef, released)
}

// Modified addUser to create user in Firebase Auth and save details to DB
export const addUser = async (email: string, password: string, name: string, role: "admin" | "viewer") => {
  const auth = getAuth()
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const firebaseUser = userCredential.user

  const userDbRef = ref(database, `users/${role}s/${firebaseUser.uid}`)
  return await set(userDbRef, { email: firebaseUser.email, name: name, role: role })
}

// Delete operations
export const deleteUser = async (userId: string, userRole: "admin" | "viewer") => {
  const userDbRef = ref(database, `users/${userRole}s/${userId}`)
  return await remove(userDbRef)
}

export const deletePrisoner = async (prisonerId: string) => {
  const prisonerRef = ref(database, `prisoners/${prisonerId}`)
  return await remove(prisonerRef)
}

export const deleteReleasedPrisoner = async (releasedId: string) => {
  const releasedRef = ref(database, `released-prisoners/${releasedId}`)
  return await remove(releasedRef)
}

// Update operations
export const updatePrisoner = async (prisonerId: string, updates: Partial<Prisoner>) => {
  const prisonerRef = ref(database, `prisoners/${prisonerId}`)
  console.log(`Attempting to update prisoner ${prisonerId} with:`, updates) // للتشخيص
  return await update(prisonerRef, updates)
}

export const updateReleasedPrisoner = async (releasedId: string, updates: Partial<ReleasedPrisoner>) => {
  const releasedRef = ref(database, `released-prisoners/${releasedId}`)
  console.log(`Attempting to update released prisoner ${releasedId} with:`, updates) // للتشخيص
  return await update(releasedRef, updates)
}

// New: Update user role in Realtime Database
export const updateUserRole = async (
  userId: string,
  oldRole: "admin" | "viewer",
  newRole: "admin" | "viewer",
  userDetails: Partial<User>,
) => {
  const oldUserRef = ref(database, `users/${oldRole}s/${userId}`)
  await remove(oldUserRef) // Remove from old role path

  const newUserRef = ref(database, `users/${newRole}s/${userId}`)
  return await set(newUserRef, userDetails) // Add to new role path
}
