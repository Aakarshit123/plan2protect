import React, { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Pricing() {
  const { upgradePlan } = useAuth();
  const [selectedPlan] = useState<'free' | 'bundle' | 'yearly' | 'monthly'>('monthly');

  const handlePayment = (plan: 'free' | 'bundle' | 'yearly' | 'monthly') => {
    if (plan === 'free') {
      alert('Free plan activated! You can now start your first assessment.');
      return;
    }

    if (plan === 'bundle') {
      const paymentSuccess = window.confirm(
        'This will redirect you to our payment processor. Continue with Bundle purchase for $10 (5 assessments)?'
      );

      if (paymentSuccess) {
        alert('Payment successful! Bundle activated.');
        upgradePlan('bundle');
      }
      return;
    }

    if (plan === 'yearly') {
      const paymentSuccess = window.confirm(
        'This will redirect you to our payment processor. Continue with Yearly plan purchase for $299/year?'
      );

      if (paymentSuccess) {
        alert('Payment successful! Yearly plan activated.');
        upgradePlan('yearly');
      }
      return;
    }

    if (plan === 'monthly') {
      const paymentSuccess = window.confirm(
        'This will redirect you to our payment processor. Continue with Monthly plan purchase for $50/month?'
      );

      if (paymentSuccess) {
        alert('Payment successful! Monthly plan activated.');
        upgradePlan('monthly');
      }
      return;
    }

    // Fallback for any other plans
    const paymentSuccess = window.confirm(
      'This will redirect you to our payment processor. Continue with plan purchase?'
    );

    if (paymentSuccess) {
      alert('Payment successful! Plan activated.');
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Choose Your Safety Plan
          </h1>
          <p className="text-xl text-gray-600">
            Get started with our free assessment or unlock premium features with Pro
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Free Plan */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 ${
              selectedPlan === 'free' ? 'border-blue-500' : 'border-gray-200'
            }`}>
              <div className="text-center mb-8">
                <div className="bg-gray-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">₹0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Perfect for trying out our AI safety assessment</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">1 home assessment per month</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Basic safety summary report</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Risk zone identification</span>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="h-5 w-5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-400 line-through">Interactive 3D visualization</span>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="h-5 w-5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-400 line-through">Detailed PDF reports</span>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="h-5 w-5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-400 line-through">Priority support</span>
                </div>
              </div>

              <button
                onClick={() => handlePayment('free')}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  selectedPlan === 'free'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Get Started Free
              </button>
            </div>

            {/* Bundle Plan */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 ${
              selectedPlan === 'bundle' ? 'border-blue-500' : 'border-gray-200'
            }`}>
              <div className="text-center mb-8">
                <div className="bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Bundle</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$10</span>
                  <span className="text-gray-600">/one-time</span>
                </div>
                <p className="text-gray-600">Perfect for multiple assessments</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">5 home assessments</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Detailed safety reports</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Interactive 3D visualization</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">PDF reports included</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Email support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">No monthly commitment</span>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="h-5 w-5 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-400 line-through">Priority support</span>
                </div>
              </div>

              <button
                onClick={() => handlePayment('bundle')}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  selectedPlan === 'bundle'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                Get Bundle
              </button>
            </div>

            {/* Yearly Plan */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
              selectedPlan === 'yearly' ? 'border-blue-500' : 'border-gray-200'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Best Value
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Yearly</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600">/year</span>
                </div>
                <p className="text-gray-600">Save 37% with annual billing</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited home assessments</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Interactive 3D visualization</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Detailed PDF reports</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced risk analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority email & chat support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Export to multiple formats</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Historical assessment tracking</span>
                </div>
              </div>

              <button
                onClick={() => handlePayment('yearly')}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  selectedPlan === 'yearly'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                <Crown className="inline h-5 w-5 mr-2" />
                Get Yearly
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 relative ${
              selectedPlan === 'monthly' ? 'border-blue-500' : 'border-gray-200'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$50</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Premium monthly subscription with all features</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited home assessments</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Interactive 3D visualization</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Detailed PDF reports</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Advanced risk analysis</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Priority email & chat support</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Export to multiple formats</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">Historical assessment tracking</span>
                </div>
              </div>

              <button
                onClick={() => handlePayment('monthly')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                <Zap className="inline h-5 w-5 mr-2" />
                Get Monthly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-lg text-gray-600">
              See what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 gap-0">
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              </div>
              <div className="p-6 text-center border-l border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Basic</h3>
                <p className="text-sm text-gray-600">Free</p>
              </div>
              <div className="p-6 text-center border-l border-gray-200 bg-blue-50">
                <h3 className="text-lg font-semibold text-blue-900">Monthly</h3>
                <p className="text-sm text-blue-600">$50/month</p>
              </div>
            </div>

            {[
              { feature: 'Home Assessments', basic: '1 per month', pro: 'Unlimited' },
              { feature: 'Basic Safety Report', basic: '✓', pro: '✓' },
              { feature: 'Risk Zone Identification', basic: '✓', pro: '✓' },
              { feature: 'Interactive 3D View', basic: '✗', pro: '✓' },
              { feature: 'Detailed PDF Reports', basic: '✗', pro: '✓' },
              { feature: 'Advanced Risk Analysis', basic: '✗', pro: '✓' },
              { feature: 'Priority Support', basic: '✗', pro: '✓' },
              { feature: 'Export Options', basic: 'Basic', pro: 'All Formats' },
              { feature: 'Assessment History', basic: '7 days', pro: 'Unlimited' }
            ].map((row, index) => (
              <div key={index} className="grid grid-cols-3 gap-0 border-t border-gray-200">
                <div className="p-4 bg-gray-50">
                  <span className="font-medium text-gray-900">{row.feature}</span>
                </div>
                <div className="p-4 text-center border-l border-gray-200">
                  <span className="text-gray-700">{row.basic}</span>
                </div>
                <div className="p-4 text-center border-l border-gray-200 bg-blue-50">
                  <span className="text-blue-900 font-medium">{row.pro}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, UPI, and net banking through our secure payment processor."
              },
              {
                question: "Is there a refund policy?",
                answer: "Yes, we offer a 30-day money-back guarantee for Pro subscriptions if you're not satisfied with our service."
              },
              {
                question: "How accurate are the AI assessments?",
                answer: "Our AI models are trained on thousands of building assessments and achieve 90%+ accuracy. However, we always recommend consulting with professionals for critical decisions."
              },
              {
                question: "Can I use Plan2Protect for commercial buildings?",
                answer: "Currently, Plan2Protect is optimized for residential buildings. We're working on commercial building support for future releases."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Secure Your Home?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with our free assessment or unlock all features with Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handlePayment('free')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Assessment
            </button>
            <button
              onClick={() => handlePayment('monthly')}
              className="bg-amber-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              <Crown className="inline h-5 w-5 mr-2" />
              Get Monthly
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}