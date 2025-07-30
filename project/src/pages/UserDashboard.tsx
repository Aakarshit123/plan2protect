import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, ApiUser, UserLimits } from '../services/apiService';

interface Assessment {
  id: string;
  user_id: string;
  image_url: string;
  status: string;
  created_at: string;
  risk_score?: number;
  recommendations?: string[];
}

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user && !user.isAdmin) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [limitsResponse, assessmentsResponse] = await Promise.all([
        apiService.getUserLimits(user!.uid!),
        apiService.getUserAssessments(user!.uid!)
      ]);
      
      setUserLimits(limitsResponse);
      setAssessments(assessmentsResponse.assessments);
    } catch (err) {
      setError('Failed to load user data. Please try again.');
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleAssessmentUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      const response = await apiService.createAssessment(user!.uid!, selectedFile);
      
      if (response.success) {
        setAssessments(prev => [response.assessment, ...prev]);
        setSelectedFile(null);
        // Reload user limits to update usage
        await loadUserData();
        alert('Assessment uploaded successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload assessment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const completeAssessment = async (assessmentId: string) => {
    try {
      const response = await apiService.completeAssessment(assessmentId);
      if (response.success) {
        setAssessments(prev => 
          prev.map(assessment => 
            assessment.id === assessmentId 
              ? { ...assessment, ...response.assessment }
              : assessment
          )
        );
        alert('Assessment completed! Check the results below.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete assessment.');
    }
  };

  if (!user || user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This dashboard is for regular users only.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your home safety assessments and track your usage.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Usage Statistics */}
        {userLimits && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Used</span>
                  <span className="font-semibold">{userLimits.usage.assessments.used}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Limit</span>
                  <span className="font-semibold">
                    {userLimits.usage.assessments.limit === -1 ? 'Unlimited' : userLimits.usage.assessments.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: userLimits.usage.assessments.limit === -1 
                        ? '100%' 
                        : `${Math.min((userLimits.usage.assessments.used / userLimits.usage.assessments.limit) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
                {userLimits.usage.assessments.remaining !== -1 && (
                  <p className="text-xs text-gray-500">
                    {userLimits.usage.assessments.remaining} assessments remaining
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Used</span>
                  <span className="font-semibold">{userLimits.usage.storage.used.toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Limit</span>
                  <span className="font-semibold">{userLimits.usage.storage.limit} MB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((userLimits.usage.storage.used / userLimits.usage.storage.limit) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {userLimits.usage.storage.remaining.toFixed(2)} MB remaining
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plan Information */}
        {userLimits && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan: {userLimits.plan.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-semibold">${userLimits.plan.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assessments</p>
                <p className="font-semibold">
                  {userLimits.plan.assessments_limit === -1 ? 'Unlimited' : userLimits.plan.assessments_limit}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage</p>
                <p className="font-semibold">{userLimits.plan.storage_limit} MB</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Features:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {userLimits.plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* New Assessment Upload */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Assessment</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Home Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              onClick={handleAssessmentUpload}
              disabled={!selectedFile || uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Assessment'}
            </button>
          </div>
        </div>

        {/* Assessments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Assessments</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {assessments.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No assessments yet. Upload your first home image to get started!</p>
              </div>
            ) : (
              assessments.map((assessment) => (
                <div key={assessment.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Assessment #{assessment.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(assessment.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            assessment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assessment.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {assessment.status === 'processing' && (
                        <button
                          onClick={() => completeAssessment(assessment.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}
                      {assessment.status === 'completed' && assessment.risk_score && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Risk Score: {assessment.risk_score}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {assessment.risk_score < 50 ? 'Low Risk' : 
                             assessment.risk_score < 80 ? 'Medium Risk' : 'High Risk'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {assessment.status === 'completed' && assessment.recommendations && (
                    <div className="mt-4 pl-20">
                      <p className="text-sm font-medium text-gray-900 mb-2">Recommendations:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {assessment.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 