import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Leaf, Check } from 'lucide-react';
import { resetPassword } from '../lib/auth';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've sent a password reset link to <strong>{email}</strong>. 
            Click the link in the email to reset your password.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <button
              onClick={() => setEmailSent(false)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300"
            >
              Try Different Email
            </button>
            
            <Link
              to="/login"
              className="block w-full border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 text-center"
            >
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </Link>

          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-full mr-3">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">NaturZen</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Forgot Password?</h2>
          <p className="text-gray-600 text-center mb-8">
            No worries! Enter your email address and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending reset link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </motion.button>
          </form>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Need Help?</h3>
            <p className="text-green-700 text-sm">
              If you're having trouble, contact our support team at{' '}
              <a href="mailto:support@naturzen.com" className="underline">
                support@naturzen.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image & Text */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-blue-600 items-center justify-center p-12"
      >
        <div className="text-white text-center max-w-lg">
          <div className="mb-8">
            <img
              src="https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg"
              alt="Peaceful Environment"
              className="w-80 h-80 object-cover rounded-2xl mx-auto shadow-2xl"
            />
          </div>
          
          <h3 className="text-3xl font-bold mb-4">
            Secure Account Recovery
          </h3>
          <p className="text-green-100 text-lg leading-relaxed mb-6">
            Your account security is our priority. We use industry-standard 
            encryption and secure reset processes to protect your information.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h4 className="font-semibold mb-3">Quick Recovery Tips</h4>
            <ul className="text-green-100 text-sm space-y-2 text-left">
              <li>• Check your spam/junk folder for the reset email</li>
              <li>• The reset link expires in 24 hours</li>
              <li>• Contact support if you don't receive the email</li>
              <li>• Use a strong password when you reset</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;