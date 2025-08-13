import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const VehicleTypeCard = ({ 
  vehicleType, 
  selected = false, 
  onSelect,
  estimatedPrice,
  className = '' 
}) => {
  const handleSelect = () => {
    onSelect?.(vehicleType);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        onClick={handleSelect}
        className={`p-4 cursor-pointer border-2 transition-all duration-200 ${
          selected 
            ? 'border-secondary bg-green-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${selected ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-600'}`}>
<ApperIcon name={vehicleType.iconUrl} size={20} />
            </div>
            
            <div>
<h3 className="font-semibold text-primary">{vehicleType.name}</h3>
              <p className="text-sm text-gray-500">
                {vehicleType.capacity} seats • {vehicleType.eta}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {vehicleType.description}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-primary">
${estimatedPrice || vehicleType.basePrice}
            </p>
            <p className="text-xs text-gray-500">
+ ${vehicleType.pricePerKm}/km
            </p>
          </div>
        </div>
        
        {selected && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="mt-3 h-1 bg-secondary rounded-full origin-left"
          />
        )}
      </Card>
    </motion.div>
  );
};

export default VehicleTypeCard;