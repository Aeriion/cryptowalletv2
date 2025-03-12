import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDEIdUtudGtsnSBrZ3ZwEQ9S-CeGOF7Rzw",
  authDomain: "crypto-e4482.firebaseapp.com",
  projectId: "crypto-e4482",
  storageBucket: "crypto-e4482.appspot.com",
  messagingSenderId: "809888167574",
  appId: "1:809888167574:web:147a90d57cf26e364274b7",
  measurementId: "G-345SMKMMVC",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app

