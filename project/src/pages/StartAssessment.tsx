import React, { useState } from 'react';
import { Upload, Brain, FileText, Download, AlertTriangle, CheckCircle, Eye, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { FirebaseStorageService, AssessmentData } from '../services/firebaseStorage';

interface AssessmentResults {
  id: string;
  overallScore: number;
  criticalIssues: number;
  mediumIssues: number;
  recommendations: number;
  model3D: Array<{
    id: string;
    room: string;
    risk: string;
  }>;
  riskZones: Array<{
    room: string;
    risk: string;
    description: string;
  }>;
  timestamp: string;
}

export default function StartAssessment() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'processing' | 'results'>('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Handle form input changes
    console.log('Input changed:', e.target.name, e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) return;
    
    setCurrentStep('processing');
    
    try {
      // Upload image to Firebase Storage
      const imageUrl = await FirebaseStorageService.uploadImage(selectedFile, user.uid);
      
      // Generate 3D model using backend
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch('http://localhost:8000/api/generate-3d', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Upload 3D model data to Firebase
        const model3DUrl = await FirebaseStorageService.upload3DModel(
          data.points_3d, 
          user.uid, 
          Date.now().toString()
        );
        
        // Create assessment data
        const assessmentData: AssessmentData = {
          id: Date.now().toString(),
          userId: user.uid,
          imageUrl: imageUrl,
          model3DUrl: model3DUrl,
          safetyMetrics: {
            overallScore: data.safety_metrics.overall_score,
            criticalIssues: data.safety_metrics.critical_issues,
            mediumIssues: data.safety_metrics.medium_issues,
            recommendations: data.safety_metrics.recommendations
          },
          points3D: data.points_3d,
          originalSize: data.original_size,
          createdAt: new Date().toISOString(),
          status: 'completed'
        };
        
        // Save to Firestore
        await FirebaseStorageService.saveAssessment(assessmentData);
        
        // Update local state
        setResults({
          id: assessmentData.id,
          overallScore: data.safety_metrics.overall_score,
          criticalIssues: data.safety_metrics.critical_issues,
          mediumIssues: data.safety_metrics.medium_issues,
          recommendations: data.safety_metrics.recommendations,
          model3D: data.points_3d.map((point: number[], index: number) => ({
            id: index.toString(),
            room: `Point ${index}`,
            risk: 'low'
          })),
          riskZones: [],
          timestamp: new Date().toISOString()
        });
        
        setCurrentStep('results');
      } else {
        throw new Error('Failed to generate 3D model');
      }
    } catch (error) {
      console.error('3D generation failed:', error);
      alert('Failed to generate 3D model. Please try again.');
      setCurrentStep('upload');
    }
  };

  // Remove dummy 3D model generator

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-400';
      default: return 'bg-green-400';
    }
  };

  const downloadReport = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'plan2protect-safety-report.pdf';
    link.click();
    alert('Report downloaded! (This is a demo - no actual file was downloaded)');
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Upload & Details</span>
            </div>
            <div className={`flex items-center ${currentStep === 'processing' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">AI Processing</span>
            </div>
            <div className={`flex items-center ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Results</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep === 'upload' ? 0 : currentStep === 'processing' ? 1 : 2) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Form */}
        {currentStep === 'upload' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Start Your Home Safety Assessment
              </h1>
              <p className="text-lg text-gray-600">
                Upload your floor plan and provide building details for AI-powered analysis
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setCurrentStep('processing'); }}>
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Floor Plan Upload *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="mb-4">
                      <label htmlFor="floor-plan" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-600"> or drag and drop</span>
                        <input
                          id="floor-plan"
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {selectedFile.name} uploaded
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Building Material */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building Material *
                    </label>
                    <select
                      name="buildingMaterial"
                      // value={formData.buildingMaterial} // formData was removed
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select material</option>
                      <option value="concrete">Concrete & Steel</option>
                      <option value="brick">Brick & Mortar</option>
                      <option value="wood">Wood Frame</option>
                      <option value="mixed">Mixed Materials</option>
                    </select>
                  </div>

                  {/* Number of Floors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Floors *
                    </label>
                    <input
                      type="number"
                      name="floors"
                      // value={formData.floors} // formData was removed
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="10"
                      required
                    />
                  </div>

                  {/* Year Built */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Built *
                    </label>
                    <input
                      type="number"
                      name="yearBuilt"
                      // value={formData.yearBuilt} // formData was removed
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1900"
                      max="2025"
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      // value={formData.city} // formData was removed
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Construction Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Construction Status *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="constructionStatus"
                        value="existing"
                        // checked={formData.constructionStatus === 'existing'} // formData was removed
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Already Constructed
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="constructionStatus"
                        value="planned"
                        // checked={formData.constructionStatus === 'planned'} // formData was removed
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Scheduled to be Built
                    </label>
                  </div>
                </div>

                {/* Room Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Description (Optional)
                  </label>
                  <textarea
                    name="roomDescription"
                    // value={formData.roomDescription} // formData was removed
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the layout, special features, or specific concerns..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Start AI Analysis
                  <ArrowRight className="inline h-5 w-5 ml-2" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Processing */}
        {currentStep === 'processing' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-8">
              <div className="relative">
                <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-pulse" />
                <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI is Analyzing Your Home
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our advanced AI is processing your floor plan and building details to identify potential safety risks.
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                </div>
                <p className="text-sm text-gray-500">Analyzing structural elements and safety factors...</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-blue-50 p-4 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-900">Floor Plan Analysis</h4>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <Brain className="h-6 w-6 text-yellow-600 mb-2 animate-pulse" />
                <h4 className="font-semibold text-gray-900">Risk Assessment</h4>
                <p className="text-sm text-gray-600">In Progress...</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Eye className="h-6 w-6 text-gray-400 mb-2" />
                <h4 className="font-semibold text-gray-900">3D Visualization</h4>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>

            <button
              onClick={() => handleSubmit()}
              className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Complete Analysis
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 'results' && results === null ? (
          <div className="text-center text-gray-500 py-12">No results yet. Please start an assessment.</div>
        ) : (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Your Safety Assessment Results
                </h2>
                <p className="text-lg text-gray-600">
                  Comprehensive analysis completed with actionable recommendations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{results?.overallScore}</div>
                  <div className="text-sm text-gray-600">Overall Safety Score</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 mb-2">{results?.criticalIssues}</div>
                  <div className="text-sm text-gray-600">Critical Issues</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">{results?.mediumIssues}</div>
                  <div className="text-sm text-gray-600">Medium Risk Areas</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{results?.recommendations}</div>
                  <div className="text-sm text-gray-600">Recommendations</div>
                </div>
              </div>
            </div>

            {/* 3D Visualization */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                3D Home Safety Model
              </h3>
              
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {results?.model3D?.map((room) => (
                    <div
                      key={room.id}
                      className={`h-16 ${getRiskColor(room.risk)} rounded-lg shadow-md transform hover:scale-105 transition-transform cursor-pointer flex items-center justify-center text-white text-xs font-medium`}
                      title={`${room.room} - ${room.risk} risk`}
                    >
                      {room.room}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                    <span className="text-gray-600">Low Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                    <span className="text-gray-600">Medium Risk</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-400 rounded mr-2"></div>
                    <span className="text-gray-600">High Risk</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button className="bg-amber-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                  Upgrade for Full 3D Interactive View
                </button>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Risk Analysis
              </h3>
              
              <div className="space-y-4">
                {results?.riskZones?.map((zone, index: number) => (
                  <div key={index} className={`border-l-4 p-4 rounded ${
                    zone.risk === 'high' ? 'border-red-500 bg-red-50' :
                    zone.risk === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {zone.risk === 'high' ? (
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                        ) : zone.risk === 'medium' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        )}
                        <div>
                          <h4 className={`font-semibold ${
                            zone.risk === 'high' ? 'text-red-800' :
                            zone.risk === 'medium' ? 'text-yellow-800' :
                            'text-green-800'
                          }`}>
                            {zone.room}
                          </h4>
                          <p className={`text-sm ${
                            zone.risk === 'high' ? 'text-red-700' :
                            zone.risk === 'medium' ? 'text-yellow-700' :
                            'text-green-700'
                          }`}>
                            {zone.description}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        zone.risk === 'high' ? 'bg-red-200 text-red-800' :
                        zone.risk === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {zone.risk.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Report */}
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Download Detailed Report
              </h3>
              <p className="text-gray-600 mb-6">
                Get a comprehensive PDF report with all findings, recommendations, and next steps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadReport}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Free Summary
                </button>
                <button className="bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition-colors">
                  Upgrade for Full Report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}