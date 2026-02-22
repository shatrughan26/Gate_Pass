import { auth, db, isFirebaseConfigured } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function ensureConfigured() {
  if (!isFirebaseConfigured) {
    const err = new Error(
      "Firebase configuration not found. Copy .env.example to .env.local and add your VITE_FIREBASE_* values, then restart the dev server."
    );
    err.code = "auth/configuration-not-found";
    throw err;
  }
}

export async function signIn(email, password) {
  ensureConfigured();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
  ensureConfigured();
  return fbSignOut(auth);
}

export function onAuth(cb) {
  ensureConfigured();
  return onAuthStateChanged(auth, cb);
}

export async function createUser(email, password, role = "student") {
  ensureConfigured();
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), { role, email });
  return userCred;
}

export async function getUserRole(uid) {
  ensureConfigured();
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
}

// 🔥 REQUIRED EXPORTS
export { auth, db };
