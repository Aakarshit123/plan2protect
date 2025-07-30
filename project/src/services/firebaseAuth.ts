import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, orderBy, addDoc, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface User {
  uid?: string; // Optional for non-admin users
  email: string;
  name: string;
  plan: 'free' | 'bundle' | 'yearly' | 'monthly';
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string;
  // Revenue and usage tracking
  totalRevenue: number;
  monthlyRevenue: number;
  assessmentsCompleted: number;
  storageUsed: number; // in MB
  lastAssessmentDate?: string;
  subscriptionStatus: 'active' | 'cancelled' | 'expired';
  planStartDate?: string;
  planEndDate?: string;
}

const ADMIN_EMAILS = ['aakarshit.cse@gmail.com', 'orthodox396@gmail.com'];

export class FirebaseAuthService {
  // Check if user is admin
  static isAdminEmail(email: string): boolean {
    return ADMIN_EMAILS.includes(email);
  }

  // Sign up with email and password (admin only)
  static async signup(name: string, email: string, password: string): Promise<boolean> {
    try {
      // Only allow admin signup
      if (!this.isAdminEmail(email)) {
        throw new Error('Only admin users can sign up with email/password');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, { displayName: name });

      // Create admin user document in Firestore
      const userData: User = {
        uid: user.uid,
        email: user.email || '',
        name: name,
        plan: 'free',
        isAdmin: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        totalRevenue: 0,
        monthlyRevenue: 0,
        assessmentsCompleted: 0,
        storageUsed: 0,
        subscriptionStatus: 'active'
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  }

  // Sign in with email and password (admin only)
  static async signin(email: string, password: string): Promise<boolean> {
    try {
      // Only allow admin signin
      if (!this.isAdminEmail(email)) {
        throw new Error('Only admin users can sign in with email/password');
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      });

      return true;
    } catch (error: any) {
      console.error('Signin error:', error);
      throw new Error(error.message);
    }
  }

  // Sign out
  static async signout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Signout error:', error);
      throw new Error(error.message);
    }
  }

  // Get current user data from Firestore (admin only)
  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error: any) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Create regular user in database (no Firebase Auth)
  static async createRegularUser(userData: Omit<User, 'uid' | 'isAdmin' | 'createdAt' | 'lastLogin'>): Promise<string> {
    try {
      const newUser: User = {
        ...userData,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'users'), newUser);
      
      // Update the document with the generated ID
      await updateDoc(doc(db, 'users', docRef.id), {
        uid: docRef.id
      });

      return docRef.id;
    } catch (error: any) {
      console.error('Create regular user error:', error);
      throw new Error(error.message);
    }
  }

  // Get regular user by email
  static async getRegularUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { uid: userDoc.id, ...userDoc.data() } as User;
      }
      return null;
    } catch (error: any) {
      console.error('Get regular user error:', error);
      return null;
    }
  }

  // Update regular user last login
  static async updateRegularUserLogin(uid: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        lastLogin: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Update regular user login error:', error);
      throw new Error(error.message);
    }
  }

  // Update user plan
  static async updateUserPlan(uid: string, plan: User['plan']): Promise<void> {
    try {
      const planPrices = {
        free: 0,
        monthly: 29.99,
        yearly: 299.99,
        bundle: 499.99
      };

      const planStartDate = new Date().toISOString();
      const planEndDate = plan === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : plan === 'yearly'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : plan === 'bundle'
        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

      await updateDoc(doc(db, 'users', uid), {
        plan: plan,
        totalRevenue: planPrices[plan],
        monthlyRevenue: plan === 'monthly' ? planPrices[plan] : planPrices[plan] / 12,
        planStartDate,
        planEndDate,
        subscriptionStatus: 'active',
        updatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Update plan error:', error);
      throw new Error(error.message);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(): Promise<User[]> {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(usersQuery);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as User);
      });
      
      return users;
    } catch (error: any) {
      console.error('Get all users error:', error);
      throw new Error(error.message);
    }
  }

  // Update user assessment count
  static async updateUserAssessment(uid: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const newAssessmentCount = (userData.assessmentsCompleted || 0) + 1;
        
        await updateDoc(doc(db, 'users', uid), {
          assessmentsCompleted: newAssessmentCount,
          lastAssessmentDate: new Date().toISOString()
        });
      }
    } catch (error: any) {
      console.error('Update assessment error:', error);
      throw new Error(error.message);
    }
  }

  // Update user storage usage
  static async updateUserStorage(uid: string, storageUsed: number): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), {
        storageUsed: storageUsed
      });
    } catch (error: any) {
      console.error('Update storage error:', error);
      throw new Error(error.message);
    }
  }

  // Listen to auth state changes (admin only)
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
} 