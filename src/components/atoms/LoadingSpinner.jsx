import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ size = 24, className = '' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={className}
    >
      <ApperIcon name="Loader2" size={size} />
    </motion.div>
  );
};

export default LoadingSpinner;