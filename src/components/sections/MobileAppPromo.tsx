import React from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Star, Gift, Bell, Shield } from 'lucide-react';

const MobileAppPromo = () => {
  const features = [
    { icon: Gift, title: "Exclusive Offers", desc: "App-only deals and discounts" },
    { icon: Bell, title: "Push Notifications", desc: "Never miss a sale or restock" },
    { icon: Shield, title: "Secure Checkout", desc: "Safe and fast payments" },
    { icon: Star, title: "Easy Reorders", desc: "One-tap purchase history" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-900 via-teal-800 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-400 p-3 rounded-full mr-4">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Get Our Mobile App
              </h2>
            </div>

            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Experience wellness on the go! Download the NaturZen app for a 
              seamless shopping experience with exclusive mobile-only benefits.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <feature.icon className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-green-200 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <button className="flex items-center justify-center bg-white text-green-800 px-6 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg group">
                <Download className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Download for</div>
                  <div className="font-bold">Android</div>
                </div>
              </button>

              <button className="flex items-center justify-center bg-white text-green-800 px-6 py-4 rounded-xl font-semibold hover:bg-green-50 transition-colors shadow-lg group">
                <Download className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Download for</div>
                  <div className="font-bold">iOS</div>
                </div>
              </button>
            </motion.div>

            {/* App Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center space-x-8 mt-8 text-green-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.8</div>
                <div className="text-sm flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-sm">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative mx-auto w-72">
              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                <div className="bg-black rounded-[2.5rem] p-1">
                  <div className="bg-white rounded-[2rem] h-[600px] overflow-hidden">
                    {/* App Screenshot */}
                    <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 p-6">
                      {/* App Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
                            <span className="text-white font-bold text-xs">NZ</span>
                          </div>
                          <span className="font-bold text-gray-900">NaturZen</span>
                        </div>
                        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          30% OFF
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="bg-white rounded-full p-3 mb-6 shadow-sm">
                        <div className="text-gray-400 text-sm">Search wellness products...</div>
                      </div>

                      {/* Product Cards */}
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex space-x-3">
                              <div className="w-16 h-16 bg-gradient-to-r from-green-200 to-blue-200 rounded-lg"></div>
                              <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                                <div className="h-2 bg-gray-100 rounded w-3/4 mb-2"></div>
                                <div className="flex items-center">
                                  <div className="h-3 bg-green-500 rounded w-12 mr-2"></div>
                                  <div className="h-2 bg-gray-300 rounded w-8"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Tab */}
                      <div className="absolute bottom-6 left-6 right-6 bg-white rounded-full p-3 shadow-lg">
                        <div className="flex justify-around">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg"
              >
                <Gift className="h-6 w-6 text-green-500" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute top-1/3 -left-4 bg-white rounded-full p-3 shadow-lg"
              >
                <Bell className="h-6 w-6 text-blue-500" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-1/4 -right-6 bg-white rounded-full p-3 shadow-lg"
              >
                <Star className="h-6 w-6 text-yellow-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppPromo;