import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const RideStatusCard = ({ ride, driver, className = '', onAction }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'requested':
        return {
          color: 'text-warning',
          bgColor: 'bg-orange-100',
          icon: 'Clock',
          message: 'Finding your driver...'
        };
      case 'driver_assigned':
        return {
          color: 'text-info',
          bgColor: 'bg-blue-100',
          icon: 'Car',
          message: 'Driver on the way'
        };
      case 'in_progress':
        return {
          color: 'text-secondary',
          bgColor: 'bg-green-100',
          icon: 'Navigation',
          message: 'En route to destination'
        };
      case 'completed':
        return {
          color: 'text-success',
          bgColor: 'bg-green-100',
          icon: 'CheckCircle',
          message: 'Trip completed'
        };
      case 'cancelled':
        return {
          color: 'text-error',
          bgColor: 'bg-red-100',
          icon: 'XCircle',
          message: 'Trip cancelled'
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: 'Clock',
          message: 'Unknown status'
        };
    }
  };

  const statusConfig = getStatusConfig(ride.status);

  return (
    <Card className={`p-6 ${className}`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
            <ApperIcon name={statusConfig.icon} size={20} className={statusConfig.color} />
          </div>
          <div>
            <h3 className="font-semibold text-primary">{statusConfig.message}</h3>
            <p className="text-sm text-gray-500">
              {format(new Date(ride.createdAt), 'MMM dd, yyyy • h:mm a')}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="font-bold text-lg text-primary">${ride.fare}</p>
          <p className="text-sm text-gray-500 capitalize">{ride.vehicleType}</p>
        </div>
      </div>

      {/* Driver Info */}
      {driver && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm mb-4"
        >
          <img
            src={driver.photoUrl}
            alt={driver.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.name)}&background=00D46A&color=fff`;
            }}
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-primary">{driver.name}</h4>
            <div className="flex items-center gap-2">
              <ApperIcon name="Star" size={12} className="text-warning fill-current" />
              <span className="text-sm text-gray-600">{driver.rating}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-600">{driver.vehicleModel}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">{driver.plateNumber}</p>
          </div>
        </motion.div>
      )}

      {/* Route Info */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-secondary rounded-full mt-1 flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-primary">Pickup</p>
            <p className="text-sm text-gray-600 break-words">
              {ride.pickupLocation.name || ride.pickupLocation.address}
            </p>
          </div>
        </div>
        
        <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-4"></div>
        
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-primary rounded-full mt-1 flex-shrink-0"></div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-primary">Dropoff</p>
            <p className="text-sm text-gray-600 break-words">
              {ride.dropoffLocation.name || ride.dropoffLocation.address}
            </p>
          </div>
        </div>
      </div>

      {/* ETA Display */}
      {ride.eta && ride.status === 'in_progress' && (
        <div className="mt-4 p-3 bg-secondary/10 rounded-sm">
          <div className="flex items-center justify-center gap-2">
            <ApperIcon name="Clock" size={16} className="text-secondary" />
            <span className="font-medium text-secondary">
              ETA: {format(new Date(ride.eta), 'h:mm a')}
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      {onAction && (ride.status === 'requested' || ride.status === 'driver_assigned') && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAction(ride)}
          className="w-full mt-4 py-3 text-error font-medium border-2 border-error rounded-sm hover:bg-error hover:text-white transition-colors duration-200"
        >
          Cancel Ride
        </motion.button>
      )}
    </Card>
  );
};

export default RideStatusCard;