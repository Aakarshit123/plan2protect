import React from 'react';
import { Upload, Settings, Eye, Download, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How Plan2Protect Works
          </h1>
          <p className="text-xl text-gray-600">
            Get comprehensive home safety analysis in just 4 simple steps
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    1
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Upload Your Floor Plan</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Start by uploading your floor plan in PNG, JPG, or PDF format. Our system accepts 
                  hand-drawn sketches, architectural drawings, or digital floor plans.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-600" />Supports multiple file formats</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-600" />File size up to 10MB</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-blue-600" />Secure upload with encryption</li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                  <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">Drag & drop your floor plan here</p>
                    <p className="text-sm text-gray-400 mt-2">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    2
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Provide Building Details</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Add essential information about your building including materials, number of floors, 
                  construction year, and location to help our AI provide accurate analysis.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-purple-600" />Building materials and type</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-purple-600" />Construction status</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-purple-600" />Location and climate data</li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                  <Settings className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Building Material</label>
                      <div className="bg-gray-100 rounded p-2 text-gray-600">Concrete & Steel</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Floors</label>
                      <div className="bg-gray-100 rounded p-2 text-gray-600">3 Floors</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-amber-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    3
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">AI Analysis & 3D Visualization</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Our advanced AI processes your floor plan and building data to create a 3D model with 
                  color-coded risk zones. High-risk areas are highlighted in red, medium risks in yellow, 
                  and safe zones in green.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-amber-600" />Real-time AI processing</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-amber-600" />Interactive 3D visualization</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-amber-600" />Color-coded risk mapping</li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                  <Eye className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                  <div className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="h-8 bg-green-400 rounded"></div>
                      <div className="h-8 bg-yellow-400 rounded"></div>
                      <div className="h-8 bg-red-400 rounded"></div>
                      <div className="h-8 bg-green-400 rounded"></div>
                      <div className="h-8 bg-green-400 rounded"></div>
                      <div className="h-8 bg-yellow-400 rounded"></div>
                      <div className="h-8 bg-green-400 rounded"></div>
                      <div className="h-8 bg-red-400 rounded"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
                        <span>Safe</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
                        <span>High Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
                    4
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Download Detailed Report</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Receive a comprehensive PDF report with detailed analysis, risk assessments, 
                  safety recommendations, and actionable steps to improve your home's safety.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-green-600" />Comprehensive PDF report</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-green-600" />Actionable safety recommendations</li>
                  <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-green-600" />Professional-grade analysis</li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                  <Download className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <div className="bg-white rounded-lg p-6 shadow-inner">
                    <div className="border-l-4 border-green-500 pl-4 mb-4">
                      <h4 className="font-semibold text-gray-900">Safety Report</h4>
                      <p className="text-sm text-gray-600">Your Home - Mumbai</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Overall Safety Score:</span>
                        <span className="font-semibold text-green-600">85/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Critical Issues:</span>
                        <span className="font-semibold text-red-600">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommendations:</span>
                        <span className="font-semibold text-blue-600">7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Begin your home safety assessment today and get peace of mind.
          </p>
          <a
            href="/start-assessment"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Your Assessment Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}