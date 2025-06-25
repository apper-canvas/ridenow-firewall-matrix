import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import LocationSearchBar from '@/components/molecules/LocationSearchBar';
import VehicleTypeCard from '@/components/molecules/VehicleTypeCard';
import MapView from '@/components/organisms/MapView';
import vehicleTypeService from '@/services/api/vehicleTypeService';
import rideService from '@/services/api/rideService';
import locationService from '@/services/api/locationService';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: locations, 2: vehicles, 3: confirm
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    if (step === 2) {
      loadVehicleTypes();
    }
  }, [step]);

  const loadCurrentLocation = async () => {
    try {
      const location = await locationService.getCurrentLocation();
      setPickupLocation(location);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

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
    setStep(2);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    // Calculate estimated fare
    const distance = 5; // Simplified - would use actual distance calculation
    const fare = vehicle.basePrice + (distance * vehicle.pricePerKm);
    setEstimatedFare(Math.round(fare * 100) / 100);
    setStep(3);
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
      navigate(`/ride/${newRide.Id}`);
    } catch (error) {
      toast.error('Failed to book ride. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/');
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-surface border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
            </button>
            <h1 className="text-lg font-semibold text-primary">
              {step === 1 && 'Where to?'}
              {step === 2 && 'Choose your ride'}
              {step === 3 && 'Confirm booking'}
            </h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex gap-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-2 h-2 rounded-full transition-colors ${
                  stepNum <= step ? 'bg-secondary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Map (Top Half) */}
        <div className="flex-1 bg-gray-100">
          <MapView
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            showRoute={step >= 2}
            className="w-full h-full"
          />
        </div>

        {/* Bottom Panel */}
        <div className="bg-surface border-t border-gray-200 p-6 overflow-y-auto max-h-[50vh]">
          <motion.div
            key={step}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Location Selection */}
            {step === 1 && (
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

            {/* Step 2: Vehicle Selection */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-primary mb-4">
                  Available rides
                </h2>
                
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
              </div>
            )}

            {/* Step 3: Booking Confirmation */}
            {step === 3 && selectedVehicle && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-primary mb-2">
                    Confirm your ride
                  </h2>
                  <p className="text-gray-600">Review details before booking</p>
                </div>

                {/* Selected Vehicle Summary */}
                <div className="bg-gray-50 rounded-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-secondary rounded-full">
                      <ApperIcon name={selectedVehicle.iconUrl} size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{selectedVehicle.name}</h3>
                      <p className="text-sm text-gray-600">{selectedVehicle.eta}</p>
                    </div>
                  </div>
                </div>

                {/* Route Summary */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-secondary rounded-full mt-1 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-primary">Pickup</p>
                      <p className="text-sm text-gray-600 break-words">
                        {pickupLocation.name || pickupLocation.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="ml-1.5 border-l-2 border-dashed border-gray-300 h-4"></div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full mt-1 flex-shrink-0"></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-primary">Dropoff</p>
                      <p className="text-sm text-gray-600 break-words">
                        {dropoffLocation.name || dropoffLocation.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fare Breakdown */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Base fare</span>
                    <span className="text-primary">${selectedVehicle.basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Distance (est. 5km)</span>
                    <span className="text-primary">${(5 * selectedVehicle.pricePerKm).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span className="text-primary">Total</span>
                    <span className="text-primary">${estimatedFare}</span>
                  </div>
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
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;