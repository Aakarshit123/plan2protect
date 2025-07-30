import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="Plan2Protect Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-white">Plan2Protect</span>
            </div>
            <p className="text-blue-100 max-w-md leading-relaxed">
              AI-powered home safety assessment platform helping homeowners, architects, and engineers 
              make informed decisions about residential building safety.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-blue-100 hover:text-amber-300 transition-colors">
                <Mail className="h-4 w-4" />
                <span>contact@plan2protect.in</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100 hover:text-amber-300 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-100 hover:text-amber-300 transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-100 hover:text-amber-300 transition-colors">Home</Link></li>
              <li><Link to="/how-it-works" className="text-blue-100 hover:text-amber-300 transition-colors">How It Works</Link></li>
              <li><Link to="/features" className="text-blue-100 hover:text-amber-300 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-blue-100 hover:text-amber-300 transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-amber-300 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-300">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-blue-100 hover:text-amber-300 transition-colors">Contact Us</Link></li>
              <li><a href="#" className="text-blue-100 hover:text-amber-300 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-blue-100 hover:text-amber-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-blue-100 hover:text-amber-300 transition-colors">Terms of Service</a></li>
              <li><Link to="/start-assessment" className="text-blue-100 hover:text-amber-300 transition-colors">Start Assessment</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © 2025 Plan2Protect. All rights reserved. Built during The Creator Program by Vimal Daga Sir.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-blue-200 text-sm">
                Empowering safer homes through AI technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}