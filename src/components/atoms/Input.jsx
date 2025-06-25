import React, { forwardRef } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  error,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'text',
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 border-2 rounded-sm bg-surface text-primary placeholder-gray-500
    focus:outline-none focus:border-secondary focus:ring-0
    ${error ? 'border-error' : 'border-gray-300'}
    ${icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''}
    ${className}
  `.trim();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={16} className="text-gray-500" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <ApperIcon name={icon} size={16} className="text-gray-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;