import { db, auth } from "./firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

/**
 * 1. ADD A PRODUCT (Used by Farmers)
 */
export const addProduct = async (title, description, pricePerKg, availableQuantity, location, imageUrl) => {
  try {
    // Ensure a user is actually logged in before letting them post
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("You must be logged in to list a crop.");

    // Add a new document to the 'products' drawer
    const docRef = await addDoc(collection(db, "products"), {
      farmerId: currentUser.uid, // Tie this product to the logged-in farmer
      title: title,
      description: description,
      pricePerKg: Number(pricePerKg),
      availableQuantity: Number(availableQuantity),
      location: location,
      imageUrl: imageUrl || "placeholder_url",
      createdAt: new Date().toISOString()
    });

    return { success: true, productId: docRef.id };
  } catch (error) {
    console.error("Error adding product:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * 2. GET ALL PRODUCTS (Used by Buyers to browse the marketplace)
 */
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = [];
    
    querySnapshot.forEach((doc) => {
      // Combine the auto-generated Firestore ID with the inner data
      products.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, products: products };
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return { success: false, error: error.message };
  }
};