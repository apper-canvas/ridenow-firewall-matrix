import { toast } from 'react-toastify';

class LocationService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
    this.tableName = 'location_c';
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
          { field: { Name: "address_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
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
      return response.data.map(location => ({
        Id: location.Id,
        name: location.Name,
        address: location.address_c,
        latitude: location.latitude_c,
        longitude: location.longitude_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching locations:", error?.response?.data?.message);
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
          { field: { Name: "address_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      // Map database fields to expected format
      return {
        Id: response.data.Id,
        name: response.data.Name,
        address: response.data.address_c,
        latitude: response.data.latitude_c,
        longitude: response.data.longitude_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching location with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async searchLocations(query) {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "address_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
        ],
        where: [
          {
            FieldName: "Name",
            Operator: "Contains",
            Values: [query]
          }
        ],
        pagingInfo: { limit: 5, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Map database fields to expected format
      return response.data.map(location => ({
        Id: location.Id,
        name: location.Name,
        address: location.address_c,
        latitude: location.latitude_c,
        longitude: location.longitude_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching locations:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async getCurrentLocation() {
    // Simulate getting user's current location
    return {
      address: "Current Location",
      latitude: 40.7128,
      longitude: -74.0060,
      name: "Your Location"
    };
  }

  async getLocationFromCoordinates(lat, lng) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "address_c" } },
          { field: { Name: "latitude_c" } },
          { field: { Name: "longitude_c" } }
        ],
        pagingInfo: { limit: 10, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data.length) {
        return {
          address: `${lat}, ${lng}`,
          latitude: lat,
          longitude: lng,
          name: "Unknown Location"
        };
      }

      // Find nearest location (simplified)
      const nearestLocation = response.data[0];
      
      return {
        Id: nearestLocation.Id,
        name: nearestLocation.Name,
        address: `Near ${nearestLocation.Name}`,
        latitude: lat,
        longitude: lng
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting location from coordinates:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return {
        address: `${lat}, ${lng}`,
        latitude: lat,
        longitude: lng,
        name: "Unknown Location"
      };
    }
  }

  async create(locationData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: locationData.name,
            address_c: locationData.address,
            latitude_c: locationData.latitude,
            longitude_c: locationData.longitude
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
          console.error(`Failed to create location records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const createdRecord = successfulRecords[0].data;
          return {
            Id: createdRecord.Id,
            name: createdRecord.Name,
            address: createdRecord.address_c,
            latitude: createdRecord.latitude_c,
            longitude: createdRecord.longitude_c
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating location:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
}

export default new LocationService();