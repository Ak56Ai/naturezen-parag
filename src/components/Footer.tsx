import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Download } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold">NaturZen</span>
            </div>
            <p className="text-green-100 leading-relaxed">
              Your trusted companion on the journey to wellness. Discover authentic Ayurvedic products 
              and meditation essentials crafted with 100+ years of traditional wisdom.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-green-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-green-100 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/ayurveda" className="text-green-100 hover:text-white transition-colors">
                  Ayurveda Collection
                </Link>
              </li>
              <li>
                <Link to="/meditation" className="text-green-100 hover:text-white transition-colors">
                  Meditation Essentials
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-green-100 hover:text-white transition-colors">
                  Wellness Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Care</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-green-100 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-green-100 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-green-100 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-green-100 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-green-100 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & App */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-300" />
                <span className="text-green-100">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-green-300" />
                <span className="text-green-100">hello@naturzen.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-green-300 mt-1" />
                <span className="text-green-100">
                  123 Wellness Street,<br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>

            {/* App Download */}
            <div className="bg-green-700 rounded-lg p-4 mt-6">
              <h4 className="font-semibold mb-2">Download Our App</h4>
              <p className="text-green-100 text-sm mb-3">
                Get exclusive offers and faster checkout on our mobile app.
              </p>
              <button className="flex items-center space-x-2 bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-50 transition-colors">
                <Download className="h-4 w-4" />
                <span className="font-semibold text-sm">Download App</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-green-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-100 text-sm">
              © 2024 NaturZen. All rights reserved. Made with ♡ for wellness.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/terms" className="text-green-100 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-green-100 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-green-100 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;