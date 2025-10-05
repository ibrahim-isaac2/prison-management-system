import { database } from "./firebase"
import { ref, onValue, push, remove, update, set } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import type { Prisoner, ReleasedPrisoner, User } from "./types"

// Real-time listeners for data
export const listenToPrisoners = (callback: (prisoners: Prisoner[]) => void) => {
  const prisonersRef = ref(database, "prisoners")
  return onValue(prisonersRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const prisonersArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      callback(prisonersArray)
    } else {
      callback([])
    }
  })
}

export const listenToReleasedPrisoners = (callback: (released: ReleasedPrisoner[]) => void) => {
  const releasedRef = ref(database, "released-prisoners")
  return onValue(releasedRef, (snapshot) => {
    const data = snapshot.val()
    console.log("Raw snapshot data:", data)
    if (data) {
      const combinedReleasedArray: ReleasedPrisoner[] = []
      if (typeof data === "object" && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => {
          console.log(`Processing key: ${key}, Value:`, data[key])
          const item = data[key]
          if (item && typeof item === "object") { // تحقق من أن القيمة كائن
            combinedReleasedArray.push({
              id: key,
              ...item,
            } as ReleasedPrisoner) // تجاوز أخطاء التحقق من الأنواع
          }
        })
      }
      // إزالة Case 2 إذا لم تكن هناك بيانات متداخلة
      console.log("Combined array:", combinedReleasedArray)
      callback(combinedReleasedArray)
    } else {
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

export const addUser = async (email: string, password: string, name: string, role: "admin" | "viewer") => {
  const auth = getAuth()
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const firebaseUser = userCredential.user

  const userDbRef = ref(database, `users/${role}s/${firebaseUser.uid}`)
  return await set(userDbRef, { email: firebaseUser.email, name: name, role: role })
}

// Delete operations
export const deleteUser = async (userId: string, userRole: "admin" | "viewer") => {
  const auth = getAuth()
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
  console.log(`Attempting to update prisoner ${prisonerId} with:`, updates)
  return await update(prisonerRef, updates)
}

export const updateReleasedPrisoner = async (releasedId: string, updates: Partial<ReleasedPrisoner>) => {
  const releasedRef = ref(database, `released-prisoners/${releasedId}`)
  console.log(`Attempting to update released prisoner ${releasedId} with:`, updates)
  return await update(releasedRef, updates)
}

export const updateUserRole = async (
  userId: string,
  oldRole: "admin" | "viewer",
  newRole: "admin" | "viewer",
  userDetails: Partial<User>,
) => {
  const oldUserRef = ref(database, `users/${oldRole}s/${userId}`)
  await remove(oldUserRef)

  const newUserRef = ref(database, `users/${newRole}s/${userId}`)
  return await set(newUserRef, userDetails)
}
