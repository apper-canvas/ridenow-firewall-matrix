import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-surface rounded-sm border-0 shadow-sm overflow-hidden';
  const hoverClasses = hover ? 'cursor-pointer transition-shadow duration-200 hover:shadow-md' : '';
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`.trim();

  const CardComponent = onClick || hover ? motion.div : 'div';
  
  const motionProps = onClick || hover ? {
    whileHover: { y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    whileTap: onClick ? { scale: 0.98 } : {},
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;