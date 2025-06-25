import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import MapView from '@/components/organisms/MapView';
import RideStatusCard from '@/components/molecules/RideStatusCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import rideService from '@/services/api/rideService';
import driverService from '@/services/api/driverService';

const ActiveRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadRideData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (ride && (ride.status === 'requested' || ride.status === 'driver_assigned' || ride.status === 'in_progress')) {
        updateRideStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [rideId]);

  const loadRideData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const rideData = await rideService.getById(rideId);
      setRide(rideData);
      
      if (rideData.driverId) {
        const driverData = await driverService.getByStringId(rideData.driverId);
        setDriver(driverData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load ride details');
    } finally {
      setLoading(false);
    }
  };

  const updateRideStatus = async () => {
    if (!ride) return;
    
    try {
      // Simulate status progression
      let newStatus = ride.status;
      if (ride.status === 'requested') {
        newStatus = 'driver_assigned';
      } else if (ride.status === 'driver_assigned') {
        newStatus = 'in_progress';
      }
      
      if (newStatus !== ride.status) {
        const updatedRide = await rideService.update(ride.Id, { status: newStatus });
        setRide(updatedRide);
        
        if (newStatus === 'driver_assigned') {
          toast.success('Driver assigned! They are on their way.');
        } else if (newStatus === 'in_progress') {
          toast.success('Driver has arrived! Enjoy your ride.');
        }
      }
    } catch (error) {
      console.error('Error updating ride status:', error);
    }
  };

  const handleCancelRide = async () => {
    if (!ride) return;
    
    setIsUpdating(true);
    try {
      await rideService.cancelRide(ride.Id);
      toast.success('Ride cancelled successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to cancel ride');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteRide = async () => {
    if (!ride) return;
    
    setIsUpdating(true);
    try {
      await rideService.completeRide(ride.Id);
      toast.success('Thank you for riding with us!');
      navigate('/trips');
    } catch (error) {
      toast.error('Failed to complete ride');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleContactDriver = () => {
    if (driver) {
      toast.info(`Calling ${driver.name}...`);
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'requested':
        return 'Looking for a driver near you...';
      case 'driver_assigned':
        return 'Your driver is on the way';
      case 'in_progress':
        return 'En route to destination';
      case 'completed':
        return 'Trip completed successfully';
      case 'cancelled':
        return 'Trip was cancelled';
      default:
        return 'Processing your request...';
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-background">
        <div className="p-6">
          <SkeletonLoader count={1} type="map" />
          <div className="mt-6">
            <SkeletonLoader count={1} type="trip" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <ErrorState 
          message={error} 
          onRetry={loadRideData}
        />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <ErrorState message="Ride not found" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-primary">
                {getStatusMessage(ride.status)}
              </h1>
              <p className="text-sm text-gray-600">
                Ride #{ride.Id} • {format(new Date(ride.createdAt), 'MMM dd, h:mm a')}
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            ride.status === 'requested' ? 'bg-orange-100 text-orange-700' :
            ride.status === 'driver_assigned' ? 'bg-blue-100 text-blue-700' :
            ride.status === 'in_progress' ? 'bg-green-100 text-green-700' :
            ride.status === 'completed' ? 'bg-green-100 text-green-700' :
            'bg-red-100 text-red-700'
          }`}>
            {ride.status.replace('_', ' ').toUpperCase()}
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapView
          pickupLocation={ride.pickupLocation}
          dropoffLocation={ride.dropoffLocation}
          driverLocation={driver ? { latitude: 40.7200, longitude: -74.0000 } : null}
          showRoute={true}
          className="w-full h-full"
        />

        {/* Floating Action Buttons */}
        {ride.status === 'in_progress' && driver && (
          <div className="absolute top-4 right-4 space-y-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleContactDriver}
              className="w-12 h-12 bg-secondary rounded-full shadow-lg flex items-center justify-center text-white"
            >
              <ApperIcon name="Phone" size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => toast.info('Sharing location...')}
              className="w-12 h-12 bg-info rounded-full shadow-lg flex items-center justify-center text-white"
            >
              <ApperIcon name="Share" size={20} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Bottom Panel */}
      <div className="flex-shrink-0 bg-surface border-t border-gray-200 p-6">
        <RideStatusCard
          ride={ride}
          driver={driver}
          onAction={ride.status === 'requested' || ride.status === 'driver_assigned' ? 
            () => handleCancelRide() : null
          }
        />

        {/* Action Buttons */}
        <div className="mt-4 space-y-3">
          {ride.status === 'in_progress' && (
            <Button
              onClick={handleCompleteRide}
              variant="primary"
              size="lg"
              className="w-full"
              loading={isUpdating}
            >
              Complete Ride
            </Button>
          )}
          
          {(ride.status === 'completed' || ride.status === 'cancelled') && (
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/trips')}
                variant="outline"
                className="flex-1"
              >
                View All Trips
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="primary"
                className="flex-1"
              >
                Book Another Ride
              </Button>
            </div>
          )}
        </div>

        {/* Emergency Button */}
        {ride.status === 'in_progress' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full mt-4 py-3 text-error font-medium border-2 border-error rounded-sm hover:bg-error hover:text-white transition-colors duration-200"
            onClick={() => toast.info('Emergency services contacted')}
          >
            <div className="flex items-center justify-center gap-2">
              <ApperIcon name="AlertTriangle" size={16} />
              Emergency
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ActiveRide;