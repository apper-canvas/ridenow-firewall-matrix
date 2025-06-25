import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MapView from '@/components/organisms/MapView';
import BookingBottomSheet from '@/components/organisms/BookingBottomSheet';
import rideService from '@/services/api/rideService';
import locationService from '@/services/api/locationService';

const Home = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load current location
      const location = await locationService.getCurrentLocation();
      setCurrentLocation(location);

      // Check for active ride
      const ride = await rideService.getActiveRide();
      setActiveRide(ride);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookRide = () => {
    setIsBookingOpen(true);
  };

  const handleViewActiveRide = () => {
    if (activeRide) {
      navigate(`/ride/${activeRide.Id}`);
    }
  };

  const handleQuickDestination = async (destinationName) => {
    try {
      const locations = await locationService.searchLocations(destinationName);
      if (locations.length > 0) {
        setIsBookingOpen(true);
        // Pre-fill destination in booking sheet
      }
    } catch (error) {
      toast.error('Failed to find destination');
    }
  };

  const quickDestinations = [
    { name: 'Airport', icon: 'Plane' },
    { name: 'Train Station', icon: 'Train' },
    { name: 'Mall', icon: 'ShoppingBag' },
    { name: 'Hospital', icon: 'Heart' }
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface border-b border-gray-200 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-primary">Good morning</h1>
              <p className="text-sm text-gray-600">
                {currentLocation ? 'Ready to ride?' : 'Getting your location...'}
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ApperIcon name="Bell" size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <MapView
          currentLocation={currentLocation}
          pickupLocation={activeRide?.pickupLocation}
          dropoffLocation={activeRide?.dropoffLocation}
          showRoute={!!activeRide}
          className="w-full h-full"
        />

        {/* Active Ride Card */}
        {activeRide && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-4 right-4"
          >
            <div className="bg-surface rounded-sm shadow-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-full">
                    <ApperIcon name="Car" size={16} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary">Ride in progress</p>
                    <p className="text-sm text-gray-600">
                      {activeRide.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleViewActiveRide}
                  variant="primary"
                  size="sm"
                >
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {!activeRide && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="bg-surface rounded-sm shadow-lg border border-gray-200 p-6">
              {/* Main Book Ride Button */}
              <Button
                onClick={handleBookRide}
                variant="primary"
                size="lg"
                className="w-full mb-4"
                icon="MapPin"
              >
                Where to?
              </Button>

              {/* Quick Destinations */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-600">Quick destinations</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickDestinations.map((destination, index) => (
                    <motion.button
                      key={destination.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickDestination(destination.name)}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors"
                    >
                      <ApperIcon name={destination.icon} size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {destination.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Booking Bottom Sheet */}
      <BookingBottomSheet
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialPickup={currentLocation}
      />
    </div>
  );
};

export default Home;