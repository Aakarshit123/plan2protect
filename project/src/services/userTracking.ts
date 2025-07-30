import { FirebaseAuthService } from './firebaseAuth';

export class UserTrackingService {
  // Track when a user completes an assessment
  static async trackAssessmentCompletion(userId: string): Promise<void> {
    try {
      await FirebaseAuthService.updateUserAssessment(userId);
    } catch (error) {
      console.error('Error tracking assessment completion:', error);
    }
  }

  // Track storage usage for a user
  static async trackStorageUsage(userId: string, storageUsed: number): Promise<void> {
    try {
      await FirebaseAuthService.updateUserStorage(userId, storageUsed);
    } catch (error) {
      console.error('Error tracking storage usage:', error);
    }
  }

  // Calculate storage usage from file size
  static calculateStorageUsage(fileSize: number): number {
    // Convert bytes to MB
    return fileSize / (1024 * 1024);
  }

  // Get user usage statistics
  static async getUserUsageStats(userId: string) {
    try {
      // First try to get current user (for admin users)
      let user = await FirebaseAuthService.getCurrentUser();
      
      // If not found, try to get regular user by email
      if (!user) {
        // This would need to be implemented based on how you store the email
        // For now, we'll return null if user not found
        return null;
      }

      // Check if this is the correct user
      if (user.uid === userId || user.email) {
        return {
          assessmentsCompleted: user.assessmentsCompleted || 0,
          storageUsed: user.storageUsed || 0,
          lastAssessmentDate: user.lastAssessmentDate,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user usage stats:', error);
      return null;
    }
  }

  // Get user usage statistics by email (for regular users)
  static async getUserUsageStatsByEmail(email: string) {
    try {
      const user = await FirebaseAuthService.getRegularUserByEmail(email);
      if (user) {
        return {
          assessmentsCompleted: user.assessmentsCompleted || 0,
          storageUsed: user.storageUsed || 0,
          lastAssessmentDate: user.lastAssessmentDate,
          plan: user.plan,
          subscriptionStatus: user.subscriptionStatus
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user usage stats by email:', error);
      return null;
    }
  }

  // Check if user has exceeded their plan limits
  static async checkPlanLimits(userId: string): Promise<{
    canPerformAssessment: boolean;
    canUploadFile: boolean;
    message?: string;
  }> {
    try {
      // First try to get current user (for admin users)
      let user = await FirebaseAuthService.getCurrentUser();
      
      // If not found, try to get regular user by email
      if (!user) {
        return {
          canPerformAssessment: false,
          canUploadFile: false,
          message: 'User not found'
        };
      }

      const planLimits = {
        free: { assessments: 1, storage: 50 }, // 50 MB
        monthly: { assessments: 10, storage: 500 }, // 500 MB
        yearly: { assessments: 100, storage: 2000 }, // 2 GB
        bundle: { assessments: -1, storage: 5000 } // Unlimited assessments, 5 GB
      };

      const limits = planLimits[user.plan] || planLimits.free;
      const currentAssessments = user.assessmentsCompleted || 0;
      const currentStorage = user.storageUsed || 0;

      const canPerformAssessment = limits.assessments === -1 || currentAssessments < limits.assessments;
      const canUploadFile = currentStorage < limits.storage;

      let message = '';
      if (!canPerformAssessment) {
        message = `You've reached the assessment limit for your ${user.plan} plan. Please upgrade to continue.`;
      } else if (!canUploadFile) {
        message = `You've reached the storage limit for your ${user.plan} plan. Please upgrade to continue.`;
      }

      return {
        canPerformAssessment,
        canUploadFile,
        message
      };
    } catch (error) {
      console.error('Error checking plan limits:', error);
      return {
        canPerformAssessment: false,
        canUploadFile: false,
        message: 'Error checking plan limits'
      };
    }
  }

  // Check plan limits by email (for regular users)
  static async checkPlanLimitsByEmail(email: string): Promise<{
    canPerformAssessment: boolean;
    canUploadFile: boolean;
    message?: string;
  }> {
    try {
      const user = await FirebaseAuthService.getRegularUserByEmail(email);
      if (!user) {
        return {
          canPerformAssessment: false,
          canUploadFile: false,
          message: 'User not found'
        };
      }

      const planLimits = {
        free: { assessments: 1, storage: 50 }, // 50 MB
        monthly: { assessments: 10, storage: 500 }, // 500 MB
        yearly: { assessments: 100, storage: 2000 }, // 2 GB
        bundle: { assessments: -1, storage: 5000 } // Unlimited assessments, 5 GB
      };

      const limits = planLimits[user.plan] || planLimits.free;
      const currentAssessments = user.assessmentsCompleted || 0;
      const currentStorage = user.storageUsed || 0;

      const canPerformAssessment = limits.assessments === -1 || currentAssessments < limits.assessments;
      const canUploadFile = currentStorage < limits.storage;

      let message = '';
      if (!canPerformAssessment) {
        message = `You've reached the assessment limit for your ${user.plan} plan. Please upgrade to continue.`;
      } else if (!canUploadFile) {
        message = `You've reached the storage limit for your ${user.plan} plan. Please upgrade to continue.`;
      }

      return {
        canPerformAssessment,
        canUploadFile,
        message
      };
    } catch (error) {
      console.error('Error checking plan limits by email:', error);
      return {
        canPerformAssessment: false,
        canUploadFile: false,
        message: 'Error checking plan limits'
      };
    }
  }
} 