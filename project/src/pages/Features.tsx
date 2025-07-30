import React, { useState } from 'react';
import { Flame, Shield, Zap, Home, Eye, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Features() {
  const [activeTab, setActiveTab] = useState('fire');

  const features = {
    fire: {
      icon: Flame,
      title: 'Fire Hazard Detection',
      description: 'Advanced AI analysis to identify potential fire risks and escape route optimization.',
      details: [
        'Electrical wiring safety assessment',
        'Flammable material identification',
        'Escape route planning and optimization',
        'Smoke detector placement recommendations',
        'Fire suppression system suggestions',
        'Kitchen and heating system safety checks'
      ],
      riskLevels: [
        { level: 'High Risk', description: 'Immediate attention required', color: 'bg-red-500' },
        { level: 'Medium Risk', description: 'Address within 30 days', color: 'bg-yellow-500' },
        { level: 'Low Risk', description: 'Monitor and maintain', color: 'bg-green-500' }
      ]
    },
    structural: {
      icon: Shield,
      title: 'Structural Integrity Assessment',
      description: 'Comprehensive analysis of load-bearing elements and structural weaknesses.',
      details: [
        'Load-bearing wall identification',
        'Foundation stability assessment',
        'Beam and column stress analysis',
        'Material degradation detection',
        'Settlement and movement indicators',
        'Renovation impact assessment'
      ],
      riskLevels: [
        { level: 'Critical', description: 'Structural engineer consultation needed', color: 'bg-red-500' },
        { level: 'Moderate', description: 'Professional inspection recommended', color: 'bg-yellow-500' },
        { level: 'Stable', description: 'Structure appears sound', color: 'bg-green-500' }
      ]
    },
    earthquake: {
      icon: Home,
      title: 'Earthquake Resilience',
      description: 'Seismic risk evaluation and earthquake preparedness recommendations.',
      details: [
        'Seismic zone compatibility check',
        'Building code compliance verification',
        'Retrofitting recommendations',
        'Anchor and bracing assessments',
        'Emergency kit placement suggestions',
        'Evacuation plan optimization'
      ],
      riskLevels: [
        { level: 'High Vulnerability', description: 'Immediate retrofitting needed', color: 'bg-red-500' },
        { level: 'Moderate Risk', description: 'Consider strengthening measures', color: 'bg-yellow-500' },
        { level: 'Well Prepared', description: 'Good seismic resilience', color: 'bg-green-500' }
      ]
    },
    electrical: {
      icon: Zap,
      title: 'Electrical Safety Analysis',
      description: 'Comprehensive electrical system safety evaluation and recommendations.',
      details: [
        'Wiring age and condition assessment',
        'Circuit overload risk analysis',
        'GFCI and AFCI protection evaluation',
        'Grounding system verification',
        'Panel and outlet safety checks',
        'Code compliance verification'
      ],
      riskLevels: [
        { level: 'Dangerous', description: 'Immediate electrical work required', color: 'bg-red-500' },
        { level: 'Concerning', description: 'Schedule electrical inspection', color: 'bg-yellow-500' },
        { level: 'Safe', description: 'Electrical system meets standards', color: 'bg-green-500' }
      ]
    }
  };

  const activeFeature = features[activeTab as keyof typeof features];
  const IconComponent = activeFeature.icon;

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Safety Features
          </h1>
          <p className="text-xl text-gray-600">
            Advanced AI-powered analysis covering all aspects of home safety and risk assessment
          </p>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 bg-gray-100 rounded-2xl p-2">
            {Object.entries(features).map(([key, feature]) => {
              const IconComp = feature.icon;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === key
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  <IconComp className="h-5 w-5" />
                  <span className="hidden sm:inline">{feature.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Feature Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-2xl mr-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{activeFeature.title}</h2>
                  <p className="text-gray-600 mt-2">{activeFeature.description}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Includes:</h3>
                {activeFeature.details.map((detail, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Risk Level Classifications
                </h4>
                <div className="space-y-3">
                  {activeFeature.riskLevels.map((risk, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${risk.color}`}></div>
                      <div>
                        <span className="font-medium text-gray-900">{risk.level}:</span>
                        <span className="text-gray-600 ml-2">{risk.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="bg-gray-100 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                  3D Risk Visualization Preview
                </h3>
                
                {/* 3D Model Simulation */}
                <div className="bg-white rounded-xl p-6 mb-6 shadow-inner">
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {Array.from({ length: 16 }).map((_, index) => {
                      const riskColor = index % 5 === 0 ? 'bg-red-400' : 
                                       index % 3 === 0 ? 'bg-yellow-400' : 'bg-green-400';
                      return (
                        <div
                          key={index}
                          className={`h-12 ${riskColor} rounded-lg shadow-sm transform hover:scale-105 transition-transform cursor-pointer`}
                          title={`Room ${index + 1}`}
                        ></div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded mr-2"></div>
                        <span className="text-gray-600">Safe (70%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded mr-2"></div>
                        <span className="text-gray-600">Medium (20%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-400 rounded mr-2"></div>
                        <span className="text-gray-600">High (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Analysis Results */}
                <div className="space-y-4">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                      <div>
                        <p className="font-medium text-red-800">High Risk Area Detected</p>
                        <p className="text-red-700 text-sm">Kitchen electrical outlet near water source</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                      <div>
                        <p className="font-medium text-yellow-800">Medium Risk</p>
                        <p className="text-yellow-700 text-sm">Aging electrical panel - consider upgrade</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <div>
                        <p className="font-medium text-green-800">Safety Compliant</p>
                        <p className="text-green-700 text-sm">Living room meets all safety standards</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Visualization Feature */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive 3D Home Model
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Visualize your home's safety profile with our advanced 3D modeling system that highlights 
              risk zones and provides interactive safety insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Navigation</h3>
              <p className="text-gray-600">
                Navigate through your 3D home model with zoom, rotate, and click-to-explore functionality.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Color-Coded Zones</h3>
              <p className="text-gray-600">
                Instantly identify safety levels with our intuitive color-coding system across all rooms.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <Info className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detailed Insights</h3>
              <p className="text-gray-600">
                Click on any area to get detailed safety information and actionable recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Experience These Features Today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your comprehensive home safety assessment and discover all these features in action.
          </p>
          <a
            href="/start-assessment"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Eye className="h-5 w-5 mr-2" />
            Try All Features Now
          </a>
        </div>
      </section>
    </div>
  );
}