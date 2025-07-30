import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Upload, Brain, FileText, Shield, Zap, Eye, CheckCircle } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        {/* Animated Building Background */}
        <div className="absolute inset-0 flex items-end justify-center">
          <div className="building-animation opacity-40">
            <div className="relative">
              {/* Modern Pointy Skyscraper */}
              <div className="skyscraper relative">
                {/* Base Foundation */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-gray-800 rounded-t-lg"></div>
                
                {/* Main Tower - Very Pointy */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-80 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-500">
                  {/* Windows Grid - Main Section */}
                  <div className="absolute top-2 left-1 right-1 grid grid-cols-4 gap-1">
                    {[...Array(60)].map((_, i) => (
                      <div key={i} className="bg-yellow-300 rounded-sm h-1.5 animate-pulse" style={{animationDelay: `${i * 0.03}s`}}></div>
                    ))}
                  </div>
                </div>
                
                {/* Upper Tapering Section 1 */}
                <div className="absolute bottom-88 left-1/2 transform -translate-x-1/2 w-16 h-32 bg-gradient-to-t from-gray-700 to-gray-600">
                  <div className="absolute top-1 left-1 right-1 grid grid-cols-3 gap-1">
                    {[...Array(24)].map((_, i) => (
                      <div key={i} className="bg-yellow-300 rounded-sm h-1.5 animate-pulse" style={{animationDelay: `${i * 0.05}s`}}></div>
                    ))}
                  </div>
                </div>
                
                {/* Upper Tapering Section 2 */}
                <div className="absolute bottom-120 left-1/2 transform -translate-x-1/2 w-12 h-24 bg-gradient-to-t from-gray-600 to-gray-500">
                  <div className="absolute top-1 left-1 right-1 grid grid-cols-2 gap-1">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="bg-yellow-300 rounded-sm h-1.5 animate-pulse" style={{animationDelay: `${i * 0.07}s`}}></div>
                    ))}
                  </div>
                </div>
                
                {/* Sharp Spire */}
                <div className="absolute bottom-144 left-1/2 transform -translate-x-1/2 w-8 h-20 bg-gradient-to-t from-gray-500 to-gray-400">
                  <div className="absolute top-1 left-1 right-1 grid grid-cols-1 gap-1">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-yellow-300 rounded-sm h-1.5 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                    ))}
                  </div>
                </div>
                
                {/* Ultra Sharp Top */}
                <div className="absolute bottom-164 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-gradient-to-t from-gray-400 to-gray-300">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-yellow-300 animate-pulse"></div>
                </div>
                
                {/* Final Sharp Point */}
                <div className="absolute bottom-176 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-yellow-300 animate-pulse"></div>
                
                {/* Antenna like in logo */}
                <div className="absolute bottom-184 left-1/2 transform -translate-x-1/2">
                  {/* Antenna Base */}
                  <div className="w-2 h-4 bg-gray-400 mx-auto"></div>
                  {/* Antenna Top */}
                  <div className="w-1 h-6 bg-yellow-300 animate-pulse mx-auto"></div>
                  {/* Antenna Tip */}
                  <div className="w-0.5 h-3 bg-yellow-300 animate-pulse mx-auto"></div>
                </div>
                
                {/* Shadow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-3 bg-gray-900/40 rounded-full blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <img src={logo} alt="Plan2Protect Logo" className="h-64 w-64 mx-auto mb-12" />
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
              AI-Powered Risk Assessment for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                Safer Homes
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Upload your floor plans and get instant AI-powered safety insights, 3D visualizations, 
              and actionable recommendations to protect your home and loved ones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/start-assessment"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Search className="inline h-5 w-5 mr-2" />
                Start Your Free Assessment
              </Link>
              <Link
                to="/how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                See How It Works
              </Link>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about"
                className="bg-blue-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500/30 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                About Us
              </Link>
              <Link
                to="/features"
                className="bg-blue-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500/30 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="bg-blue-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500/30 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="bg-blue-500/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-500/30 transition-all duration-300 hover:scale-105 border border-white/20"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Plan2Protect Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get comprehensive safety insights in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 group-hover:bg-blue-100 transition-colors">
                <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Images</h3>
                <p className="text-gray-600">
                  Upload photos of your home's structure, materials, and areas of concern
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-purple-50 rounded-2xl p-6 mb-6 group-hover:bg-purple-100 transition-colors">
                <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Processing</h3>
                <p className="text-gray-600">
                  Our AI analyzes building materials, structure, and potential risks
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-amber-50 rounded-2xl p-6 mb-6 group-hover:bg-amber-100 transition-colors">
                <Eye className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Visualization</h3>
                <p className="text-gray-600">
                  View your home in 3D with color-coded risk zones and safety insights
                </p>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-green-50 rounded-2xl p-6 mb-6 group-hover:bg-green-100 transition-colors">
                <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Detailed Report</h3>
                <p className="text-gray-600">
                  Download comprehensive PDF reports with actionable recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Safety Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform covers all aspects of home safety to give you complete peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-red-500 mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fire Hazard Detection</h3>
              <p className="text-gray-600">
                Identify potential fire risks and get recommendations for fire-safe materials and escape routes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-blue-500 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Structural Integrity</h3>
              <p className="text-gray-600">
                Assess load-bearing elements and identify potential structural weaknesses before they become problems.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-amber-500 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Earthquake Resilience</h3>
              <p className="text-gray-600">
                Evaluate your home's ability to withstand seismic activity and get improvement suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your home safety assessment today and get peace of mind.
          </p>
          <Link
            to="/start-assessment"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            Start Free Assessment Now
          </Link>
        </div>
      </section>
    </div>
  );
}