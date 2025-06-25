import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, type = 'default' }) => {
  const skeletonVariants = {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSkeleton = (index) => {
    switch (type) {
      case 'trip':
        return (
          <motion.div
            key={index}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-surface rounded-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </motion.div>
        );
      
      case 'vehicle':
        return (
          <motion.div
            key={index}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-surface rounded-sm p-4 border-2 border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-5 bg-gray-200 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </motion.div>
        );
      
      case 'map':
        return (
          <motion.div
            key={index}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-gray-300 rounded-sm h-64 flex items-center justify-center"
          >
            <div className="space-y-2 text-center">
              <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto"></div>
              <div className="h-3 bg-gray-400 rounded w-24"></div>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <motion.div
            key={index}
            variants={skeletonVariants}
            animate="pulse"
            className="bg-surface rounded-sm p-4 space-y-3"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => renderSkeleton(index))}
    </div>
  );
};

export default SkeletonLoader;