import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './config.ts';
import { handleFirestoreError, OperationType } from './errors.ts';
import { Course, Order, Purchase, StudentProgress, UserProfile } from '../types/index.ts';
import { INITIAL_COURSES } from '../data/initialCourses.ts';

const USERS_COLLECTION = 'users';
const COURSES_COLLECTION = 'courses';
const ORDERS_COLLECTION = 'orders';
const PURCHASES_COLLECTION = 'purchases';
const PROGRESS_COLLECTION = 'progress';

// Helper local cache key for offline continuity
const LOCAL_COURSES_KEY = 'jewallah_local_courses_v1';
const LOCAL_PURCHASES_KEY = 'jewallah_local_purchases_v1';
const LOCAL_ORDERS_KEY = 'jewallah_local_orders_v1';
const LOCAL_PROGRESS_KEY = 'jewallah_local_progress_v1';

// ================= USER PROFILE SERVICES =================
export async function createUserProfile(profile: UserProfile): Promise<void> {
  const path = `${USERS_COLLECTION}/${profile.uid}`;
  try {
    await setDoc(doc(db, USERS_COLLECTION, profile.uid), {
      ...profile,
      createdAt: profile.createdAt || new Date().toISOString(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore write user warning:', error);
    // Also save in local storage for instant availability
    localStorage.setItem(`jewallah_user_${profile.uid}`, JSON.stringify(profile));
    // Call error handler if unexpected
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `${USERS_COLLECTION}/${uid}`;
  try {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Firestore get user warning:', error);
    // Fallback to local user
    const local = localStorage.getItem(`jewallah_user_${uid}`);
    if (local) {
      try {
        return JSON.parse(local) as UserProfile;
      } catch {
        // ignore
      }
    }
  }
  return null;
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const path = `${USERS_COLLECTION}/${uid}`;
  try {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Firestore update profile warning:', error);
    const local = localStorage.getItem(`jewallah_user_${uid}`);
    if (local) {
      const merged = { ...JSON.parse(local), ...updates };
      localStorage.setItem(`jewallah_user_${uid}`, JSON.stringify(merged));
    }
  }
}

// ================= COURSE SERVICES =================
export async function getCourses(): Promise<Course[]> {
  const path = COURSES_COLLECTION;
  try {
    const querySnapshot = await getDocs(collection(db, COURSES_COLLECTION));
    if (!querySnapshot.empty) {
      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        courses.push(doc.data() as Course);
      });
      // Update cache
      localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
      return courses;
    }
  } catch (error) {
    console.warn('Could not fetch from Firestore courses, using fallback catalog:', error);
  }

  // Check cached or initial courses
  const cached = localStorage.getItem(LOCAL_COURSES_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }

  // Seed default 12 courses into local cache and attempt firestore seed in background
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  return INITIAL_COURSES;
}

export async function getCourseById(courseId: string): Promise<Course | null> {
  const allCourses = await getCourses();
  return allCourses.find((c) => c.courseId === courseId) || null;
}

export async function saveCourse(course: Course): Promise<void> {
  const path = `${COURSES_COLLECTION}/${course.courseId}`;
  try {
    await setDoc(doc(db, COURSES_COLLECTION, course.courseId), course);
  } catch (error) {
    console.warn('Firestore saveCourse error:', error);
  }

  // Always update local cache
  const cached = localStorage.getItem(LOCAL_COURSES_KEY);
  let courses: Course[] = cached ? JSON.parse(cached) : [...INITIAL_COURSES];
  const index = courses.findIndex((c) => c.courseId === course.courseId);
  if (index >= 0) {
    courses[index] = course;
  } else {
    courses.push(course);
  }
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COURSES_COLLECTION, courseId));
  } catch (error) {
    console.warn('Firestore deleteCourse error:', error);
  }

  const cached = localStorage.getItem(LOCAL_COURSES_KEY);
  if (cached) {
    const courses: Course[] = JSON.parse(cached).filter((c: Course) => c.courseId !== courseId);
    localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(courses));
  }
}

// Reset courses to authentic initial 12 diploma batches
export async function resetCoursesToDefault(): Promise<void> {
  localStorage.setItem(LOCAL_COURSES_KEY, JSON.stringify(INITIAL_COURSES));
  try {
    for (const course of INITIAL_COURSES) {
      await setDoc(doc(db, COURSES_COLLECTION, course.courseId), course);
    }
  } catch (error) {
    console.warn('Could not batch write default courses to Firestore:', error);
  }
}

// ================= ORDERS & PURCHASES SERVICES =================
export async function recordOrder(order: Order): Promise<void> {
  const path = `${ORDERS_COLLECTION}/${order.orderId}`;
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.orderId), order);
  } catch (error) {
    console.warn('Firestore recordOrder error:', error);
  }

  // Local storage backup
  const existingOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  existingOrders.unshift(order);
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(existingOrders));
}

export async function grantCoursePurchase(purchase: Purchase): Promise<void> {
  const path = `${PURCHASES_COLLECTION}/${purchase.purchaseId}`;
  try {
    await setDoc(doc(db, PURCHASES_COLLECTION, purchase.purchaseId), purchase);
  } catch (error) {
    console.warn('Firestore grantCoursePurchase error:', error);
  }

  // Local storage backup
  const existingPurchases = JSON.parse(localStorage.getItem(LOCAL_PURCHASES_KEY) || '[]');
  const filtered = existingPurchases.filter(
    (p: Purchase) => !(p.uid === purchase.uid && p.courseId === purchase.courseId)
  );
  filtered.unshift(purchase);
  localStorage.setItem(LOCAL_PURCHASES_KEY, JSON.stringify(filtered));
}

export async function getUserPurchases(uid: string): Promise<Purchase[]> {
  try {
    const q = query(collection(db, PURCHASES_COLLECTION), where('uid', '==', uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const purchases: Purchase[] = [];
      snap.forEach((doc) => {
        purchases.push(doc.data() as Purchase);
      });
      return purchases;
    }
  } catch (error) {
    console.warn('Firestore getUserPurchases warning:', error);
  }

  // Local fallback
  const existingPurchases: Purchase[] = JSON.parse(localStorage.getItem(LOCAL_PURCHASES_KEY) || '[]');
  return existingPurchases.filter((p) => p.uid === uid && p.accessStatus === 'active');
}

export async function getUserOrders(uid: string): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COLLECTION), where('uid', '==', uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const orders: Order[] = [];
      snap.forEach((doc) => {
        orders.push(doc.data() as Order);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return orders;
    }
  } catch (error) {
    console.warn('Firestore getUserOrders warning:', error);
  }

  const existingOrders: Order[] = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  return existingOrders.filter((o) => o.uid === uid);
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const snap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (!snap.empty) {
      const orders: Order[] = [];
      snap.forEach((doc) => {
        orders.push(doc.data() as Order);
      });
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return orders;
    }
  } catch (error) {
    console.warn('Firestore getAllOrders warning:', error);
  }

  const existingOrders: Order[] = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  return existingOrders;
}

// ================= PROGRESS TRACKING =================
export async function getStudentProgress(uid: string, courseId: string): Promise<StudentProgress | null> {
  const progressId = `${uid}_${courseId}`;
  try {
    const snap = await getDoc(doc(db, PROGRESS_COLLECTION, progressId));
    if (snap.exists()) {
      return snap.data() as StudentProgress;
    }
  } catch (error) {
    console.warn('Firestore getStudentProgress warning:', error);
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || '{}');
  return existing[progressId] || null;
}

export async function saveStudentProgress(progress: StudentProgress): Promise<void> {
  try {
    await setDoc(doc(db, PROGRESS_COLLECTION, progress.progressId), progress);
  } catch (error) {
    console.warn('Firestore saveStudentProgress warning:', error);
  }

  const existing = JSON.parse(localStorage.getItem(LOCAL_PROGRESS_KEY) || '{}');
  existing[progress.progressId] = progress;
  localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(existing));
}
