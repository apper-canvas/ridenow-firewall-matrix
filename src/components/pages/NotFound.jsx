import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        {/* 404 Graphic */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="mb-8"
        >
          <div className="relative">
            <ApperIcon name="MapPin" size={120} className="text-gray-300 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">404</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-primary mb-4">
            Route Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={handleGoHome}
              variant="primary"
              size="lg"
              icon="Home"
              className="w-full"
            >
              Go Back Home
            </Button>
            
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              icon="ArrowLeft"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-400">
            Need help? Contact our support team
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;