import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LocationSearchBar from '@/components/molecules/LocationSearchBar';
import VehicleTypeCard from '@/components/molecules/VehicleTypeCard';
import vehicleTypeService from '@/services/api/vehicleTypeService';
import rideService from '@/services/api/rideService';

const BookingBottomSheet = ({ 
  isOpen, 
  onClose, 
  initialPickup, 
  initialDropoff 
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('locations'); // locations, vehicles, confirm
  const [pickupLocation, setPickupLocation] = useState(initialPickup);
  const [dropoffLocation, setDropoffLocation] = useState(initialDropoff);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState(null);

  useEffect(() => {
    if (isOpen && step === 'vehicles') {
      loadVehicleTypes();
    }
  }, [isOpen, step]);

  const loadVehicleTypes = async () => {
    setIsLoading(true);
    try {
      const types = await vehicleTypeService.getAll();
      setVehicleTypes(types);
    } catch (error) {
      toast.error('Failed to load vehicle options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSet = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Please select both pickup and dropoff locations');
      return;
    }
    setStep('vehicles');
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Calculate estimated fare
    const distance = 5; // Simplified - would use actual distance calculation
    const fare = vehicle.basePrice + (distance * vehicle.pricePerKm);
    setEstimatedFare(Math.round(fare * 100) / 100);
  };

  const handleConfirmBooking = async () => {
    if (!selectedVehicle) return;

    setIsLoading(true);
    try {
      const newRide = await rideService.requestRide(
        pickupLocation,
        dropoffLocation,
        selectedVehicle
      );
      
      toast.success('Ride requested successfully!');
      onClose();
      navigate(`/ride/${newRide.Id}`);
    } catch (error) {
      toast.error('Failed to book ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step === 'vehicles') {
      setStep('locations');
    } else if (step === 'confirm') {
      setStep('vehicles');
    }
  };

  const sheetVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-lg shadow-xl z-50 max-h-[80vh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {step !== 'locations' && (
                  <button
                    onClick={goBack}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" size={20} />
                  </button>
                )}
                <h2 className="text-lg font-semibold text-primary">
                  {step === 'locations' && 'Where to?'}
                  {step === 'vehicles' && 'Choose your ride'}
                  {step === 'confirm' && 'Confirm booking'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Locations Step */}
              {step === 'locations' && (
                <div className="space-y-4">
                  <LocationSearchBar
                    placeholder="Pickup location"
                    initialValue={pickupLocation?.name || ''}
                    onLocationSelect={setPickupLocation}
                  />
                  <LocationSearchBar
                    placeholder="Where to?"
                    initialValue={dropoffLocation?.name || ''}
                    onLocationSelect={setDropoffLocation}
                  />
                  <Button
                    onClick={handleLocationSet}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={!pickupLocation || !dropoffLocation}
                  >
                    Continue
                  </Button>
                </div>
              )}

              {/* Vehicle Selection Step */}
              {step === 'vehicles' && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-200 rounded-sm h-20"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    vehicleTypes.map((vehicle) => (
                      <VehicleTypeCard
                        key={vehicle.Id}
                        vehicleType={vehicle}
                        selected={selectedVehicle?.Id === vehicle.Id}
                        onSelect={handleVehicleSelect}
                      />
                    ))
                  )}

                  {selectedVehicle && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Estimated fare</span>
                        <span className="text-2xl font-bold text-primary">
                          ${estimatedFare}
                        </span>
                      </div>
                      <Button
                        onClick={handleConfirmBooking}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        loading={isLoading}
                      >
                        Request {selectedVehicle.name}
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingBottomSheet;