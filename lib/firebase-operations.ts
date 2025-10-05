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
      // التعديل هنا: التأكد من معالجة جميع البيانات بشكل صحيح
      const prisonersArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      
      console.log(`تم استرجاع ${prisonersArray.length} سجين من قاعدة البيانات`) // للتشخيص
      callback(prisonersArray)
    } else {
      console.log("لا توجد بيانات سجناء في قاعدة البيانات") // للتشخيص
      callback([])
    }
  })
}

export const listenToReleasedPrisoners = (callback: (released: ReleasedPrisoner[]) => void) => {
  const releasedRef = ref(database, "released-prisoners")
  return onValue(releasedRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      const releasedArray: ReleasedPrisoner[] = []
      
      // التعديل هنا: تبسيط معالجة البيانات لضمان عرض جميع السجناء المفرج عنهم
      if (typeof data === "object" && !Array.isArray(data)) {
        // التحقق مما إذا كانت البيانات تحتوي على مفتاح "releasedPrisoners"
        if (data.releasedPrisoners && typeof data.releasedPrisoners === "object") {
          // معالجة البيانات داخل releasedPrisoners
          Object.keys(data.releasedPrisoners).forEach((key) => {
            const prisoner = data.releasedPrisoners[key]
            if (prisoner && prisoner.name && prisoner.name.trim() !== "") {
              releasedArray.push({
                id: key,
                ...prisoner,
              })
            }
          })
        } else {
          // معالجة البيانات مباشرة تحت released-prisoners
          Object.keys(data).forEach((key) => {
            const prisoner = data[key]
            if (prisoner && prisoner.name && prisoner.name.trim() !== "") {
              releasedArray.push({
                id: key,
                ...prisoner,
              })
            }
          })
        }
      }
      
      console.log(`تم استرجاع ${releasedArray.length} سجين مفرج عنه من قاعدة البيانات`) // للتشخيص
      callback(releasedArray)
    } else {
      console.log("لا توجد بيانات سجناء مفرج عنهم في قاعدة البيانات") // للتشخيص
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
// Modified deleteUser to delete from Firebase Auth and Realtime Database
export const deleteUser = async (userId: string, userRole: "admin" | "viewer") => {
  const auth = getAuth()
  // Deleting a user from Firebase Auth client-side requires the user to be currently signed in.
  // To delete other users, you typically need Firebase Admin SDK (server-side) or a Cloud Function.
  // For this client-side example, we'll only delete from Realtime Database.
  // If you need to delete from Auth, consider implementing a Cloud Function.

  const userDbRef = ref(database, `users/${userRole}s/${userId}`)
  return await remove(userDbRef)
}

// New: Delete Prisoner
export const deletePrisoner = async (prisonerId: string) => {
  const prisonerRef = ref(database, `prisoners/${prisonerId}`)
  return await remove(prisonerRef)
}

// New: Delete Released Prisoner
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
