import { auth, db } from "./firebaseConfig";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * 1. SIGN UP A NEW USER (Farmer or Buyer)
 */
export const registerUser = async (email, password, fullName, role, phoneNumber) => {
  try {
    // Create the user inside Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create a matching profile document in the Firestore 'users' drawer
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullName,
      email: email,
      role: role, // Must be 'farmer' or 'buyer'
      phoneNumber: phoneNumber,
      createdAt: new Date().toISOString()
    });

    return { success: true, user: user };
  } catch (error) {
    console.error("Error signing up:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 2. LOG IN AN EXISTING USER
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch their profile from the database to see if they are a farmer or buyer
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    return { success: true, user: user, profile: userDoc.data() };
  } catch (error) {
    console.error("Error logging in:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 3. LOG OUT
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error.message);
    return { success: false, error: error.message };
  }
};