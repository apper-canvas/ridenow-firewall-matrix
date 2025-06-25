import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';
import locationService from '@/services/api/locationService';

const LocationSearchBar = ({ 
  placeholder = "Where to?", 
  onLocationSelect,
  initialValue = '',
  className = ''
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await locationService.searchLocations(searchQuery);
      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  const handleLocationSelect = (location) => {
    setQuery(location.name);
    setShowSuggestions(false);
    onLocationSelect?.(location);
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const currentLocation = await locationService.getCurrentLocation();
      handleLocationSelect(currentLocation);
    } catch (error) {
      console.error('Error getting current location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Input
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          icon="Search"
          iconPosition="left"
          className="pr-12"
        />
        
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ApperIcon 
            name={isLoading ? "Loader2" : "MapPin"} 
            size={16} 
            className={`text-gray-500 ${isLoading ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-surface shadow-lg rounded-sm border border-gray-200 mt-1 z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((location, index) => (
              <motion.button
                key={location.Id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLocationSelect(location)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
              >
                <ApperIcon name="MapPin" size={16} className="text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary truncate">{location.name}</p>
                  <p className="text-sm text-gray-500 truncate">{location.address}</p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSearchBar;