import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import TripHistoryCard from '@/components/molecules/TripHistoryCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import rideService from '@/services/api/rideService';

const Trips = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, cancelled

  useEffect(() => {
    loadRides();
  }, []);

  const loadRides = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRides = await rideService.getUserRides();
      setRides(userRides);
    } catch (err) {
      setError(err.message || 'Failed to load trip history');
      toast.error('Failed to load trip history');
    } finally {
      setLoading(false);
    }
  };

  const handleTripClick = (ride) => {
    // Could navigate to trip details or show modal
    console.log('Trip clicked:', ride);
  };

  const filteredRides = rides.filter(ride => {
    if (filter === 'all') return true;
    return ride.status === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All trips', count: rides.length },
    { value: 'completed', label: 'Completed', count: rides.filter(r => r.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: rides.filter(r => r.status === 'cancelled').length }
  ];

  const totalSpent = rides
    .filter(ride => ride.status === 'completed')
    .reduce((sum, ride) => sum + ride.fare, 0);

  if (loading) {
    return (
      <div className="h-screen bg-background overflow-y-auto">
        <div className="p-6">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <SkeletonLoader count={5} type="trip" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <ErrorState message={error} onRetry={loadRides} />
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon="Clock"
          title="No trips yet"
          description="Your ride history will appear here once you take your first trip"
          actionLabel="Book Your First Ride"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">Your trips</h1>
          <p className="text-gray-600">
            {rides.length} trip{rides.length !== 1 ? 's' : ''} • ${totalSpent.toFixed(2)} total spent
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-sm p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {rides.filter(r => r.status === 'completed').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-sm p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="XCircle" size={16} className="text-error" />
              <span className="text-sm font-medium text-gray-600">Cancelled</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {rides.filter(r => r.status === 'cancelled').length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface rounded-sm p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="DollarSign" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-gray-600">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface rounded-sm p-4 border border-gray-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <ApperIcon name="Star" size={16} className="text-warning" />
              <span className="text-sm font-medium text-gray-600">Avg Rating</span>
            </div>
            <p className="text-2xl font-bold text-primary">4.8</p>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                filter === option.value
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-gray-200 bg-surface text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="font-medium">{option.label}</span>
              <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">
                {option.count}
              </span>
            </button>
          ))}
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRides.map((ride, index) => (
              <motion.div
                key={ride.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <TripHistoryCard
                  ride={ride}
                  onClick={() => handleTripClick(ride)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredRides.length === 0 && filter !== 'all' && (
          <EmptyState
            icon="Filter"
            title={`No ${filter} trips`}
            description={`You don't have any ${filter} trips yet`}
          />
        )}
      </div>
    </div>
  );
};

export default Trips;