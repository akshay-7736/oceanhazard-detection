// Test Firebase connection
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBBQuJqAk5So1CYbYgdpaTwJXyw4tRzSr8",
  authDomain: "sih2025-276a5.firebaseapp.com",
  projectId: "sih2025-276a5",
  storageBucket: "sih2025-276a5.firebasestorage.app",
  messagingSenderId: "594938493659",
  appId: "1:594938493659:web:96ad4d32cf7fb3ab9eaafe",
  measurementId: "G-TBCRS9BVKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addFirstDocument() {
  try {
    const docRef = await addDoc(collection(db, "hazard_reports"), {
      title: "Test Ocean Hazard Report",
      description: "This is a test document to verify Firebase connection",
      type: "tsunami",
      severity: "medium",
      location: {
        latitude: 15.0,
        longitude: 77.0,
        address: "Test Location"
      },
      source: "citizen",
      timestamp: new Date().toISOString(),
      status: "pending"
    });
    console.log("✅ Document written with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (e) {
    console.error("❌ Error adding document: ", e);
    return { success: false, error: e.message };
  }
}

// Run the test
addFirstDocument().then(result => {
  if (result.success) {
    console.log("🎉 Firebase connection successful!");
  } else {
    console.log("💥 Firebase connection failed:", result.error);
  }
});
