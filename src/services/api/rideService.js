import { toast } from 'react-toastify';

class RideService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
    this.tableName = 'ride_c';
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "vehicle_type_c" } },
          { field: { Name: "fare_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "driver_id_c" } },
          { field: { Name: "eta_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "pickup_location_c" } },
          { field: { Name: "dropoff_location_c" } }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to expected format
      return response.data.map(ride => this.mapRideFromDatabase(ride));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching rides:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "vehicle_type_c" } },
          { field: { Name: "fare_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "driver_id_c" } },
          { field: { Name: "eta_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "pickup_location_c" } },
          { field: { Name: "dropoff_location_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return this.mapRideFromDatabase(response.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching ride with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  mapRideFromDatabase(rideData) {
    return {
      Id: rideData.Id,
      vehicleType: rideData.vehicle_type_c,
      fare: rideData.fare_c,
      status: rideData.status_c,
      driverId: rideData.driver_id_c,
      eta: rideData.eta_c,
      createdAt: rideData.created_at_c || rideData.CreatedOn,
      pickupLocation: rideData.pickup_location_c ? {
        Id: rideData.pickup_location_c.Id,
        name: rideData.pickup_location_c.Name,
        address: rideData.pickup_location_c.address_c || '',
        latitude: rideData.pickup_location_c.latitude_c || 0,
        longitude: rideData.pickup_location_c.longitude_c || 0
      } : null,
      dropoffLocation: rideData.dropoff_location_c ? {
        Id: rideData.dropoff_location_c.Id,
        name: rideData.dropoff_location_c.Name,
        address: rideData.dropoff_location_c.address_c || '',
        latitude: rideData.dropoff_location_c.latitude_c || 0,
        longitude: rideData.dropoff_location_c.longitude_c || 0
      } : null
    };
  }

  async create(rideData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: `Ride ${Date.now()}`,
            vehicle_type_c: rideData.vehicleType,
            fare_c: rideData.fare,
            status_c: rideData.status || 'requested',
            driver_id_c: rideData.driverId,
            eta_c: rideData.eta,
            created_at_c: rideData.createdAt || new Date().toISOString(),
            pickup_location_c: rideData.pickupLocation?.Id || rideData.pickupLocationId,
            dropoff_location_c: rideData.dropoffLocation?.Id || rideData.dropoffLocationId
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ride records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return this.mapRideFromDatabase(successfulRecords[0].data);
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating ride:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const updateData = {};
      if (updates.status) updateData.status_c = updates.status;
      if (updates.vehicleType) updateData.vehicle_type_c = updates.vehicleType;
      if (updates.fare) updateData.fare_c = updates.fare;
      if (updates.driverId) updateData.driver_id_c = updates.driverId;
      if (updates.eta) updateData.eta_c = updates.eta;

      const params = {
        records: [
          {
            Id: parseInt(id, 10),
            ...updateData
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ride records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return this.mapRideFromDatabase(successfulUpdates[0].data);
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating ride:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ride records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return response.results.some(result => result.success);
      }
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting ride:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return false;
    }
  }

  async getUserRides() {
    return await this.getAll();
  }

  async getActiveRide() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "vehicle_type_c" } },
          { field: { Name: "fare_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "driver_id_c" } },
          { field: { Name: "eta_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "pickup_location_c" } },
          { field: { Name: "dropoff_location_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "ExactMatch",
            Values: ["in_progress", "requested"]
          }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data.length) {
        return null;
      }

      return this.mapRideFromDatabase(response.data[0]);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching active ride:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async cancelRide(id) {
    return this.update(id, { status: 'cancelled' });
  }

  async completeRide(id) {
    return this.update(id, { status: 'completed' });
  }

  async requestRide(pickupLocation, dropoffLocation, vehicleType) {
    try {
      // Calculate basic fare (simplified)
      const distance = this.calculateDistance(pickupLocation, dropoffLocation);
      const baseFare = vehicleType.basePrice || vehicleType.base_price_c;
      const distanceFare = distance * (vehicleType.pricePerKm || vehicleType.price_per_km_c);
      const totalFare = Math.round((baseFare + distanceFare) * 100) / 100;

      const rideData = {
        vehicleType: vehicleType.name || vehicleType.Name,
        fare: totalFare,
        status: 'requested',
        driverId: `driver_${Math.floor(Math.random() * 5) + 1}`,
        eta: new Date(Date.now() + Math.random() * 600000).toISOString(),
        createdAt: new Date().toISOString(),
        pickupLocationId: pickupLocation.Id,
        dropoffLocationId: dropoffLocation.Id
      };

      const newRide = await this.create(rideData);
      
      // Simulate driver assignment after a short delay
      if (newRide) {
        setTimeout(() => {
          this.update(newRide.Id, { status: 'driver_assigned' });
        }, 2000);
      }

      return newRide;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error requesting ride:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  calculateDistance(loc1, loc2) {
    // Simplified distance calculation (Haversine formula approximation)
    const R = 6371; // Earth's radius in km
    const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
    const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export default new RideService();

export default new RideService();