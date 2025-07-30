import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { storage, db } from '../config/firebase';

export interface AssessmentData {
  id: string;
  userId: string;
  imageUrl: string;
  depthMapUrl?: string;
  model3DUrl?: string;
  safetyMetrics: {
    overallScore: number;
    criticalIssues: number;
    mediumIssues: number;
    recommendations: number;
  };
  points3D: number[][];
  originalSize: [number, number];
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
}

export class FirebaseStorageService {
  // Upload image to Firebase Storage
  static async uploadImage(file: File, userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${userId}/images/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Upload image error:', error);
      throw new Error(error.message);
    }
  }

  // Upload 3D model data
  static async upload3DModel(modelData: any, userId: string, assessmentId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${userId}/models/${assessmentId}_${timestamp}.json`;
      const storageRef = ref(storage, fileName);
      
      const jsonBlob = new Blob([JSON.stringify(modelData)], { type: 'application/json' });
      const snapshot = await uploadBytes(storageRef, jsonBlob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Upload 3D model error:', error);
      throw new Error(error.message);
    }
  }

  // Save assessment data to Firestore
  static async saveAssessment(assessmentData: AssessmentData): Promise<void> {
    try {
      await setDoc(doc(db, 'assessments', assessmentData.id), assessmentData);
    } catch (error: any) {
      console.error('Save assessment error:', error);
      throw new Error(error.message);
    }
  }

  // Get assessment by ID
  static async getAssessment(assessmentId: string): Promise<AssessmentData | null> {
    try {
      const docRef = doc(db, 'assessments', assessmentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as AssessmentData;
      }
      return null;
    } catch (error: any) {
      console.error('Get assessment error:', error);
      return null;
    }
  }

  // Get user's assessments
  static async getUserAssessments(userId: string): Promise<AssessmentData[]> {
    try {
      const q = query(
        collection(db, 'assessments'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const assessments: AssessmentData[] = [];
      
      querySnapshot.forEach((doc) => {
        assessments.push(doc.data() as AssessmentData);
      });
      
      return assessments;
    } catch (error: any) {
      console.error('Get user assessments error:', error);
      return [];
    }
  }

  // Update assessment status
  static async updateAssessmentStatus(assessmentId: string, status: AssessmentData['status']): Promise<void> {
    try {
      await setDoc(doc(db, 'assessments', assessmentId), { status }, { merge: true });
    } catch (error: any) {
      console.error('Update assessment status error:', error);
      throw new Error(error.message);
    }
  }

  // Delete assessment and associated files
  static async deleteAssessment(assessmentId: string, userId: string): Promise<void> {
    try {
      // Delete from Firestore
      await setDoc(doc(db, 'assessments', assessmentId), {}, { merge: true });
      
      // Delete associated files from Storage
      const imageRef = ref(storage, `${userId}/images/${assessmentId}`);
      const modelRef = ref(storage, `${userId}/models/${assessmentId}`);
      
      try {
        await deleteObject(imageRef);
      } catch (e) {
        console.log('Image file not found for deletion');
      }
      
      try {
        await deleteObject(modelRef);
      } catch (e) {
        console.log('Model file not found for deletion');
      }
    } catch (error: any) {
      console.error('Delete assessment error:', error);
      throw new Error(error.message);
    }
  }
} 