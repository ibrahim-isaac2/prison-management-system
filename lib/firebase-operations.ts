import { database } from "./firebase"
import { ref, onValue, push, remove, update, get } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import type { Prisoner, ReleasedPrisoner, User } from "./types"

// ===================
// 📡 LISTENERS
// ===================
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
    if (data) {
      const releasedArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }))
      callback(releasedArray)
    } else {
      callback([])
    }
  })
}

// ===================
// ➕ ADD OPERATIONS
// ===================
export const addPrisoner = async (prisoner: Omit<Prisoner, "id">) => {
  const prisonersRef = ref(database, "prisoners")
  return await push(prisonersRef, prisoner)
}

export const addReleasedPrisoner = async (released: Omit<ReleasedPrisoner, "id">) => {
  const releasedRef = ref(database, "released-prisoners")
  return await push(releasedRef, released)
}

// ===================
// ❌ DELETE OPERATIONS
// ===================
export const deletePrisoner = async (prisonerId: string) => {
  try {
    // حذف من قائمة السجناء
    await remove(ref(database, `prisoners/${prisonerId}`))

    // حذف أي نسخة منه في المفرج عنهم
    const releasedSnap = await get(ref(database, "released-prisoners"))
    const releasedData = releasedSnap.val()
    if (releasedData) {
      for (const key of Object.keys(releasedData)) {
        const item = releasedData[key]
        if (item?.id === prisonerId || key === prisonerId) {
          await remove(ref(database, `released-prisoners/${key}`))
        }
      }
    }

    console.log(`✅ تم حذف السجين ${prisonerId} بنجاح`)
    return true
  } catch (error) {
    console.error("❌ خطأ أثناء حذف السجين:", error)
    throw error
  }
}

export const deleteReleasedPrisoner = async (releasedId: string) => {
  try {
    // حذف من قائمة المفرج عنهم
    await remove(ref(database, `released-prisoners/${releasedId}`))

    // حذف أي نسخة منه في السجناء
    const prisonersSnap = await get(ref(database, "prisoners"))
    const prisonersData = prisonersSnap.val()
    if (prisonersData) {
      for (const key of Object.keys(prisonersData)) {
        const item = prisonersData[key]
        if (item?.id === releasedId || key === releasedId) {
          await remove(ref(database, `prisoners/${key}`))
        }
      }
    }

    console.log(`✅ تم حذف المفرج عنه ${releasedId} بنجاح`)
    return true
  } catch (error) {
    console.error("❌ خطأ أثناء حذف المفرج عنه:", error)
    throw error
  }
}

// ===================
// ✏️ UPDATE OPERATIONS
// ===================
export const updatePrisoner = async (prisonerId: string, updates: Partial<Prisoner>) => {
  try {
    await update(ref(database, `prisoners/${prisonerId}`), updates)
    console.log(`✅ تم تعديل بيانات السجين ${prisonerId}`)
    return true
  } catch (error) {
    console.error("❌ خطأ أثناء تعديل السجين:", error)
    throw error
  }
}

export const updateReleasedPrisoner = async (releasedId: string, updates: Partial<ReleasedPrisoner>) => {
  try {
    await update(ref(database, `released-prisoners/${releasedId}`), updates)
    console.log(`✅ تم تعديل بيانات المفرج عنه ${releasedId}`)
    return true
  } catch (error) {
    console.error("❌ خطأ أثناء تعديل المفرج عنه:", error)
    throw error
  }
}
