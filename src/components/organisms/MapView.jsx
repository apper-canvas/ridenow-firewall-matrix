import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import locationService from '@/services/api/locationService';

const MapView = ({ 
  pickupLocation, 
  dropoffLocation, 
  currentLocation,
  driverLocation,
  showRoute = false,
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update map center based on locations
    if (currentLocation) {
      setMapCenter({
        lat: currentLocation.latitude,
        lng: currentLocation.longitude
      });
    } else if (pickupLocation) {
      setMapCenter({
        lat: pickupLocation.latitude,
        lng: pickupLocation.longitude
      });
    }
  }, [currentLocation, pickupLocation]);

  const MapSkeleton = () => (
    <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-center"
      >
        <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading map...</p>
      </motion.div>
    </div>
  );

  const MapDisplay = () => (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Route Line */}
      {showRoute && pickupLocation && dropoffLocation && (
        <svg className="absolute inset-0 w-full h-full">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d={`M ${30} ${40} Q ${50} ${30} ${70} ${60}`}
            stroke="#00D46A"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="drop-shadow-sm"
          />
        </svg>
      )}

      {/* Current Location Marker */}
      {currentLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute"
          style={{ 
            left: '50%', 
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-lg"
            />
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-secondary rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Pickup Location Marker */}
      {pickupLocation && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute"
          style={{ left: '30%', top: '35%' }}
        >
          <div className="relative">
            <div className="w-8 h-10 bg-secondary rounded-t-full rounded-b-lg shadow-lg flex items-center justify-center">
              <ApperIcon name="MapPin" size={16} className="text-white -mt-1" />
            </div>
            <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-secondary transform -translate-x-1/2 rotate-45" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium border">
              Pickup
            </div>
          </div>
        </motion.div>
      )}

      {/* Dropoff Location Marker */}
      {dropoffLocation && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute"
          style={{ left: '70%', top: '55%' }}
        >
          <div className="relative">
            <div className="w-8 h-10 bg-primary rounded-t-full rounded-b-lg shadow-lg flex items-center justify-center">
              <ApperIcon name="Flag" size={16} className="text-white -mt-1" />
            </div>
            <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-primary transform -translate-x-1/2 rotate-45" />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium border">
              Dropoff
            </div>
          </div>
        </motion.div>
      )}

      {/* Driver Location Marker */}
      {driverLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute"
          style={{ left: '45%', top: '60%' }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 bg-info rounded-full shadow-lg flex items-center justify-center border-2 border-white"
          >
            <ApperIcon name="Car" size={20} className="text-white" />
          </motion.div>
        </motion.div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
          <ApperIcon name="Plus" size={16} className="text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
          <ApperIcon name="Minus" size={16} className="text-gray-600" />
        </motion.button>
      </div>

      {/* Current Location Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
      >
        <ApperIcon name="Crosshair" size={20} className="text-secondary" />
      </motion.button>
    </div>
  );

  return (
    <div className={`relative rounded-sm overflow-hidden ${className}`}>
      {isLoading ? <MapSkeleton /> : <MapDisplay />}
    </div>
  );
};

export default MapView;