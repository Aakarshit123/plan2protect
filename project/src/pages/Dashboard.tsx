import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseStorageService, AssessmentData } from '../services/firebaseStorage';
import { UserTrackingService } from '../services/userTracking';
import { 
  Search, 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  TrendingUp, 
  Shield,
  Crown,
  Zap,
  Star,
  CheckCircle,
  AlertTriangle,
  Database,
  Calendar,
  BarChart3
} from 'lucide-react';

interface UsageStats {
  assessmentsCompleted: number;
  storageUsed: number;
  lastAssessmentDate?: string;
  plan: string;
  subscriptionStatus: string;
}

export default function Dashboard() {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect normal users to UserDashboard
    if (user && !user.isAdmin) {
      navigate('/user-dashboard');
      return;
    }

    const loadData = async () => {
      if (user && user.isAdmin) {
        try {
          let userStats = null;
          
          // Admin user - use current user method
          userStats = await UserTrackingService.getUserUsageStats(user.uid!);
          
          const userAssessments = await FirebaseStorageService.getUserAssessments(user.uid!);
          
          setAssessments(userAssessments);
          setUsageStats(userStats);
        } catch (error) {
          console.error('Failed to load data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user, navigate]);

  // If user is not admin, show loading while redirecting
  if (user && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to user dashboard...</p>
        </div>
      </div>
    );
  }

  const getPlanIcon = () => {
    switch (user?.plan) {
      case 'bundle':
        return <Zap className="h-5 w-5 text-green-500" />;
      case 'yearly':
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 'monthly':
        return <Star className="h-5 w-5 text-blue-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPlanName = () => {
    switch (user?.plan) {
      case 'bundle':
        return 'Bundle Plan';
      case 'yearly':
        return 'Yearly Plan';
      case 'monthly':
        return 'Monthly Plan';
      default:
        return 'Free Plan';
    }
  };

  const formatStorage = (bytes: number) => {
    if (bytes < 1024) return `${bytes} MB`;
    return `${(bytes / 1024).toFixed(1)} GB`;
  };

  const getPlanLimits = () => {
    const limits = {
      free: { assessments: 1, storage: 50 },
      monthly: { assessments: 10, storage: 500 },
      yearly: { assessments: 100, storage: 2000 },
      bundle: { assessments: -1, storage: 5000 }
    };
    return limits[user?.plan || 'free'] || limits.free;
  };

  const limits = getPlanLimits();
  const currentAssessments = usageStats?.assessmentsCompleted || 0;
  const currentStorage = usageStats?.storageUsed || 0;

  return (
    <div className="pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-blue-100">
                {isPremium ? 'You have access to all premium features' : 'Upgrade to unlock premium features'}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2">
              {getPlanIcon()}
              <span className="font-semibold">{getPlanName()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      {usageStats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
              Usage Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {currentAssessments}
                  {limits.assessments !== -1 && ` / ${limits.assessments}`}
                </div>
                <div className="text-sm text-gray-600">Assessments</div>
                {limits.assessments !== -1 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((currentAssessments / limits.assessments) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatStorage(currentStorage)}
                </div>
                <div className="text-sm text-gray-600">Storage Used</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((currentStorage / limits.storage) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  {usageStats.lastAssessmentDate 
                    ? new Date(usageStats.lastAssessmentDate).toLocaleDateString()
                    : 'Never'
                  }
                </div>
                <div className="text-sm text-gray-600">Last Assessment</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageStats?.assessmentsCompleted || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter(a => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatStorage(usageStats?.storageUsed || 0)}
                </p>
              </div>
            </div>
          </div>

          {isPremium && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Risk Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {assessments.length > 0 ? '85%' : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/start-assessment"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">New Assessment</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Start a new home safety assessment with AI-powered analysis
            </p>
            {limits.assessments !== -1 && currentAssessments >= limits.assessments && (
              <div className="flex items-center text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Assessment limit reached. Please upgrade your plan.</span>
              </div>
            )}
            {!isPremium && currentAssessments < limits.assessments && (
              <div className="flex items-center text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span>Limited to {limits.assessments} assessment(s) on free plan</span>
              </div>
            )}
          </Link>

          {isPremium && (
            <>
            <Link
              to="/3d-viewer"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">3D Viewer</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Explore your home in interactive 3D with risk zone visualization
              </p>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Premium feature unlocked</span>
              </div>
            </Link>

            <Link
              to="/reports"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Detailed Reports</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Access comprehensive PDF reports with actionable recommendations
              </p>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Premium feature unlocked</span>
              </div>
            </Link>
            </>
          )}
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
          </div>
          <div className="p-6">
            {assessments.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments yet</h3>
                <p className="text-gray-600 mb-4">
                  {isPremium 
                    ? 'Start your first assessment to see your safety analysis here.'
                    : 'Start your free assessment to see your safety analysis here.'
                  }
                </p>
                <Link
                  to="/start-assessment"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Assessment
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">Assessment #{assessment.id}</h3>
                        <p className="text-sm text-gray-600">{new Date(assessment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isPremium && (
                        <>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Download className="h-5 w-5" />
                        </button>
                        </>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assessment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Premium Features Promo */}
        {!isPremium && (
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Crown className="h-8 w-8 text-amber-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Unlock Premium Features</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Upgrade to any premium plan to access unlimited assessments, 3D visualization, detailed reports, and more!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Unlimited assessments</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>3D visualization</span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Detailed PDF reports</span>
              </div>
            </div>
            <Link
              to="/pricing"
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors inline-flex items-center"
            >
              <Crown className="h-4 w-4 mr-2" />
              View Premium Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}