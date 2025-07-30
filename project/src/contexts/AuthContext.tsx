import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirebaseAuthService, User } from '../services/firebaseAuth';
import { apiService, ApiUser } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  upgradePlan: (plan: 'bundle' | 'yearly' | 'monthly') => Promise<void>;
  isPremium: boolean;
  isAdmin: boolean;
  updateUserAssessment: () => Promise<void>;
  updateUserStorage: (storageUsed: number) => Promise<void>;
  // Regular user management
  createRegularUser: (name: string, email: string, plan?: 'free' | 'bundle' | 'yearly' | 'monthly') => Promise<string>;
  loginRegularUser: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['aakarshit.cse@gmail.com', 'orthodox396@gmail.com'];

// Convert API user to internal User format
const convertApiUserToUser = (apiUser: ApiUser): User => ({
  uid: apiUser.uid,
  email: apiUser.email,
  name: apiUser.name,
  plan: apiUser.plan,
  isAdmin: apiUser.isAdmin,
  createdAt: apiUser.createdAt,
  lastLogin: apiUser.lastLogin,
  totalRevenue: apiUser.totalRevenue,
  monthlyRevenue: apiUser.monthlyRevenue,
  assessmentsCompleted: apiUser.assessmentsCompleted,
  storageUsed: apiUser.storageUsed,
  lastAssessmentDate: apiUser.lastAssessmentDate,
  subscriptionStatus: apiUser.subscriptionStatus,
  planStartDate: apiUser.planStartDate,
  planEndDate: apiUser.planEndDate
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const isPremium = Boolean(user?.plan && user.plan !== 'free');

  useEffect(() => {
    const storedUser = localStorage.getItem('plan2protect_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAdmin(userData.isAdmin || ADMIN_EMAILS.includes(userData.email));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if this is an admin login
      if (FirebaseAuthService.isAdminEmail(email)) {
        await FirebaseAuthService.signin(email, password);
        const userData = await FirebaseAuthService.getCurrentUser();
        
        if (userData) {
          setUser(userData);
          setIsAdmin(true);
          localStorage.setItem('plan2protect_user', JSON.stringify(userData));
          return true;
        }
        return false;
      } else {
        throw new Error('Only admin users can login with password. Please use email-only login for regular users.');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Check if this is an admin signup
      if (FirebaseAuthService.isAdminEmail(email)) {
        await FirebaseAuthService.signup(name, email, password);
        const userData = await FirebaseAuthService.getCurrentUser();
        
        if (userData) {
          setUser(userData);
          setIsAdmin(true);
          localStorage.setItem('plan2protect_user', JSON.stringify(userData));
          return true;
        }
        return false;
      } else {
        throw new Error('Only admin users can sign up with password. Please use email-only signup for regular users.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (isAdmin) {
        await FirebaseAuthService.signout();
      }
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('plan2protect_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Create regular user (no password, just email) - using backend API
  const createRegularUser = async (name: string, email: string, plan: 'free' | 'bundle' | 'yearly' | 'monthly' = 'free'): Promise<string> => {
    try {
      const response = await apiService.createUser(name, email, plan);
      const userData = convertApiUserToUser(response.user);
      
      setUser(userData);
      setIsAdmin(false);
      localStorage.setItem('plan2protect_user', JSON.stringify(userData));
      
      return response.user_id;
    } catch (error) {
      console.error('Create regular user error:', error);
      throw error;
    }
  };

  // Login regular user (email only) - using backend API
  const loginRegularUser = async (email: string): Promise<boolean> => {
    try {
      const response = await apiService.loginUser(email);
      const userData = convertApiUserToUser(response.user);
      
      setUser(userData);
      setIsAdmin(false);
      localStorage.setItem('plan2protect_user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Regular user login error:', error);
      return false;
    }
  };

  const upgradePlan = async (plan: 'bundle' | 'yearly' | 'monthly') => {
    if (user) {
      try {
        if (isAdmin) {
          // Admin users use Firebase
          await FirebaseAuthService.updateUserPlan(user.uid!, plan);
          const updatedUser = await FirebaseAuthService.getCurrentUser();
          if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('plan2protect_user', JSON.stringify(updatedUser));
          }
        } else {
          // Regular users use backend API
          const response = await apiService.upgradeUserPlan(user.uid!, plan);
          const updatedUser = convertApiUserToUser(response.user);
          setUser(updatedUser);
          localStorage.setItem('plan2protect_user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Upgrade plan error:', error);
      }
    }
  };

  const updateUserAssessment = async () => {
    if (user) {
      try {
        if (isAdmin) {
          // Admin users use Firebase
          await FirebaseAuthService.updateUserAssessment(user.uid!);
          const updatedUser = await FirebaseAuthService.getCurrentUser();
          if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('plan2protect_user', JSON.stringify(updatedUser));
          }
        } else {
          // Regular users - assessment count is updated when assessment is created
          // This will be handled by the backend API
          console.log('Assessment count will be updated by backend API');
        }
      } catch (error) {
        console.error('Update assessment error:', error);
      }
    }
  };

  const updateUserStorage = async (storageUsed: number) => {
    if (user) {
      try {
        if (isAdmin) {
          // Admin users use Firebase
          await FirebaseAuthService.updateUserStorage(user.uid!, storageUsed);
          const updatedUser = await FirebaseAuthService.getCurrentUser();
          if (updatedUser) {
            setUser(updatedUser);
            localStorage.setItem('plan2protect_user', JSON.stringify(updatedUser));
          }
        } else {
          // Regular users use backend API
          const response = await apiService.updateUserStorage(user.uid!, storageUsed);
          const updatedUser = convertApiUserToUser(response.user);
          setUser(updatedUser);
          localStorage.setItem('plan2protect_user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error('Update storage error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      upgradePlan, 
      isPremium, 
      isAdmin,
      updateUserAssessment,
      updateUserStorage,
      createRegularUser,
      loginRegularUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}