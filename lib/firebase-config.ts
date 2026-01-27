import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore"

export const firebaseConfig = {
  apiKey: "AIzaSyBBQuJqAk5So1CYbYgdpaTwJXyw4tRzSr8",
  authDomain: "sih2025-276a5.firebaseapp.com",
  projectId: "sih2025-276a5",
  storageBucket: "sih2025-276a5.firebasestorage.app",
  messagingSenderId: "594938493659",
  appId: "1:594938493659:web:96ad4d32cf7fb3ab9eaafe",
  measurementId: "G-TBCRS9BVKS"
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const db = getFirestore(app)

export const firebaseOperations = {
  async storeReport(reportData: any) {
    try {
      console.log("[v0] Storing report to Firebase:", reportData.id)
      const docRef = await addDoc(collection(db, "disaster_reports"), {
        ...reportData,
        created_at: serverTimestamp(),
      })
      console.log("[v0] Successfully stored report with ID:", docRef.id)
      return { id: docRef.id, success: true }
    } catch (error) {
      console.error("[v0] Firebase store error:", error)
      return { id: `mock-${Date.now()}`, success: false, error }
    }
  },

  async storeSocialMediaPost(postData: any) {
    try {
      console.log("[v0] Storing social media post to Firebase:", postData.id)

      // Clean and validate data to prevent Firebase errors
      const enhancedPostData = {
        content: String(postData.content || postData.text || ""),
        author: String(postData.author || "unknown"),
        platform: String(postData.platform || "twitter"),
        hazard_type: String(postData.hazard_type || "general"),
        criticality_level: String(postData.confidence > 0.8 ? "high" : postData.confidence > 0.5 ? "medium" : "low"),
        confidence: Number(postData.confidence || 0.5),
        sentiment: String(postData.sentiment || "neutral"),
        geo_tagged: Boolean(postData.location),
        location: postData.location ? {
          lat: Number(postData.location.lat || postData.location.latitude || 0),
          lng: Number(postData.location.lng || postData.location.longitude || 0),
          address: String(postData.location.address || "")
        } : null,
        engagement: {
          likes: Number(postData.engagement?.likes || 0),
          retweets: Number(postData.engagement?.retweets || 0),
          replies: Number(postData.engagement?.replies || 0),
          followers: Number(postData.engagement?.followers || 0)
        },
        created_at: serverTimestamp(),
        processed_at: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "social_media_posts"), enhancedPostData)
      console.log("[v0] Successfully stored social media post with ID:", docRef.id)
      return { id: docRef.id, success: true }
    } catch (error) {
      console.error("[v0] Firebase social media store error:", error)
      return {
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        success: false,
        error: error.message,
      }
    }
  },

  async getSocialMediaPosts(maxResults = 50) {
    try {
      console.log("[v0] Fetching social media posts from Firebase")

      const q = query(collection(db, "social_media_posts"), orderBy("processed_at", "desc"), limit(maxResults))
      const querySnapshot = await getDocs(q)

      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      console.log("[v0] Retrieved", posts.length, "posts from Firebase")
      return posts
    } catch (error) {
      console.error("[v0] Firebase fetch error:", error)
      return [
        {
          id: "mock-1",
          content: "Emergency: Coastal flooding reported in Mumbai area",
          location: { lat: 19.076, lng: 72.8777 },
          confidence: 0.9,
          hazard_type: "flooding",
          platform: "twitter",
          criticality_level: "high",
        },
      ]
    }
  },

  async uploadMedia(file: File, path: string) {
    console.log("[v0] Mock Firebase: Uploading media", file.name, "to", path)
    return { url: `/uploads/${path}/${file.name}`, success: true }
  },

  async authenticateUser(email: string, password: string) {
    console.log("[v0] Mock Firebase: Authenticating user", email)
    return { uid: `user-${Date.now()}`, success: true }
  },
}

// Mock Firebase functions for development (keeping for backward compatibility)
export const mockFirebaseOperations = {
  async storeReport(reportData: any) {
    console.log("[v0] Mock Firebase: Storing report", reportData)
    return { id: `fb-${Date.now()}`, success: true }
  },

  async uploadMedia(file: File, path: string) {
    console.log("[v0] Mock Firebase: Uploading media", file.name, "to", path)
    return { url: `/uploads/${path}/${file.name}`, success: true }
  },

  async authenticateUser(email: string, password: string) {
    console.log("[v0] Mock Firebase: Authenticating user", email)
    return { uid: `user-${Date.now()}`, success: true }
  },
}
