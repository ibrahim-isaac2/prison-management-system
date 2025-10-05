import { database } from "./firebase"
import { ref, onValue, push, remove, update, set, get } from "firebase/database"
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
    if (data) {
      const combinedReleasedArray: ReleasedPrisoner[] = []

      // Case 1: Data directly under "released-prisoners" with Firebase-generated keys (newly added)
      if (typeof data === "object" && !Array.isArray(data)) {
        Object.keys(data).forEach((key) => {
          if (key !== "releasedPrisoners") {
            combinedReleasedArray.push({
              id: key,
              ...data[key],
            })
          }
        })
      }

      // Case 2: older seed format where data might be under a nested "releasedPrisoners" property
      if (data.releasedPrisoners && typeof data.releasedPrisoners === "object") {
        Object.keys(data.releasedPrisoners).forEach((key) => {
          combinedReleasedArray.push({
            id: key,
            ...data.releasedPrisoners[key],
          })
        })
      }

      callback(combinedReleasedArray)
    } else {
      callback([])
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

// New: Delete Prisoner
export const deletePrisoner = async (prisonerId: string) => {
  try {
    // Primary deletion from prisoners node
    const prisonerRef = ref(database, `prisoners/${prisonerId}`)
    await remove(prisonerRef)

    // Also attempt to remove any matching entries under released-prisoners
    // (sometimes data may be duplicated under different nodes — clean both places)
    try {
      const releasedRootRef = ref(database, `released-prisoners`)
      const snapshot = await get(releasedRootRef)
      const data = snapshot.val()
      if (data && typeof data === 'object') {
        for (const key of Object.keys(data)) {
          const item = data[key]
          // match by id or by nationalId if available
          if (!item) continue
          if (key === prisonerId || item.id === prisonerId) {
            await remove(ref(database, `released-prisoners/${key}`))
          } else {
            // if nationalId exists, try to match to avoid orphaned duplicates
            try {
              const prisonerSnapshot = await get(prisonerRef)
              const prisonerData = prisonerSnapshot.val()
              if (prisonerData && item.nationalId && prisonerData.nationalId && item.nationalId === prisonerData.nationalId) {
                await remove(ref(database, `released-prisoners/${key}`))
              }
            } catch (err) {
              // ignore per-item errors
            }
          }
        }
      }
    } catch (err) {
      console.warn("Could not clean released-prisoners during deletePrisoner:", err)
    }

    return true
  } catch (error) {
    console.error("Error in deletePrisoner:", error)
    throw error
  }
}

// New: Delete Released Prisoner
export const deleteReleasedPrisoner = async (releasedId: string) => {
  try {
    const releasedRef = ref(database, `released-prisoners/${releasedId}`)
    await remove(releasedRef)

    // Also attempt to remove any matching entries under prisoners (in case of duplicates)
    try {
      const prisonersRootRef = ref(database, `prisoners`)
      const snapshot = await get(prisonersRootRef)
      const data = snapshot.val()
      if (data && typeof data === 'object') {
        for (const key of Object.keys(data)) {
          const item = data[key]
          if (!item) continue
          if (key === releasedId || item.id === releasedId) {
            await remove(ref(database, `prisoners/${key}`))
          } else if (item.nationalId && (typeof item.nationalId === 'string')) {
            // attempt to match by nationalId with the released record
            try {
              const releasedSnapshot = await get(releasedRef)
              const releasedData = releasedSnapshot.val()
              if (releasedData && releasedData.nationalId && releasedData.nationalId === item.nationalId) {
                await remove(ref(database, `prisoners/${key}`))
              }
            } catch (err) {
              // ignore
            }
          }
        }
      }
    } catch (err) {
      console.warn("Could not clean prisoners during deleteReleasedPrisoner:", err)
    }

    return true
  } catch (error) {
    console.error("Error in deleteReleasedPrisoner:", error)
    throw error
  }
}

// Update operations
export const updatePrisoner = async (prisonerId: string, updates: Partial<Prisoner>) => {
  try {
    const prisonerRef = ref(database, `prisoners/${prisonerId}`)
    console.log(`Attempting to update prisoner ${prisonerId} with:`, updates)
    // Use update to merge fields; if you'd prefer to replace the object use set instead.
    await update(prisonerRef, updates)
    return true
  } catch (error) {
    console.error("Error in updatePrisoner:", error)
    throw error
  }
}

export const updateReleasedPrisoner = async (releasedId: string, updates: Partial<ReleasedPrisoner>) => {
  try {
    const releasedRef = ref(database, `released-prisoners/${releasedId}`)
    console.log(`Attempting to update released prisoner ${releasedId} with:`, updates)
    await update(releasedRef, updates)
    return true
  } catch (error) {
    console.error("Error in updateReleasedPrisoner:", error)
    throw error
  }
}

// (باقي الملف كما كان — وظائف للمستخدمين، role update إلخ.)
