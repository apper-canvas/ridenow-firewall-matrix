import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'font-medium rounded transition-colors duration-200 flex items-center justify-center gap-2 border-2';
  
  const variants = {
    primary: 'bg-secondary text-white border-secondary hover:bg-green-600 hover:border-green-600 active:bg-green-700',
    secondary: 'bg-white text-primary border-primary hover:bg-gray-50 active:bg-gray-100',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white active:bg-gray-800',
    ghost: 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-error text-white border-error hover:bg-red-600 hover:border-red-600 active:bg-red-700'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';
  const loadingClasses = 'cursor-wait';

  const buttonClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${disabled ? disabledClasses : ''}
    ${loading ? loadingClasses : ''}
    ${className}
  `.trim();

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={16} />
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={16} />
      )}
    </motion.button>
  );
};

export default Button;