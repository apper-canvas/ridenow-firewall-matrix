import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const TripHistoryCard = ({ ride, onClick, className = '' }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: 'CheckCircle', color: 'text-success' };
      case 'cancelled':
        return { icon: 'XCircle', color: 'text-error' };
      default:
        return { icon: 'Clock', color: 'text-warning' };
    }
  };

  const statusConfig = getStatusIcon(ride.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card hover onClick={onClick} className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Date and Status */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                {format(new Date(ride.createdAt), 'MMM dd, yyyy • h:mm a')}
              </p>
              <div className="flex items-center gap-1">
                <ApperIcon name={statusConfig.icon} size={14} className={statusConfig.color} />
                <span className={`text-xs font-medium capitalize ${statusConfig.color}`}>
                  {ride.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 break-words">
                  {ride.pickupLocation.name || ride.pickupLocation.address}
                </p>
              </div>
              <div className="ml-1 border-l border-dashed border-gray-300 h-3"></div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700 break-words">
                  {ride.dropoffLocation.name || ride.dropoffLocation.address}
                </p>
              </div>
            </div>

            {/* Trip Details */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize font-medium">
                  {ride.vehicleType}
                </span>
              </div>
              <p className="font-bold text-primary">${ride.fare}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TripHistoryCard;