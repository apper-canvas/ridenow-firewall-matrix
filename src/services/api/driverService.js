import { toast } from 'react-toastify';

class DriverService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
    this.tableName = 'driver_c';
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
          { field: { Name: "rating_c" } },
          { field: { Name: "vehicle_model_c" } },
          { field: { Name: "plate_number_c" } },
          { field: { Name: "photo_url_c" } }
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
      return response.data.map(driver => ({
        Id: driver.Id,
        name: driver.Name,
        rating: driver.rating_c,
        vehicleModel: driver.vehicle_model_c,
        plateNumber: driver.plate_number_c,
        photoUrl: driver.photo_url_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching drivers:", error?.response?.data?.message);
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
          { field: { Name: "rating_c" } },
          { field: { Name: "vehicle_model_c" } },
          { field: { Name: "plate_number_c" } },
          { field: { Name: "photo_url_c" } }
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
        rating: response.data.rating_c,
        vehicleModel: response.data.vehicle_model_c,
        plateNumber: response.data.plate_number_c,
        photoUrl: response.data.photo_url_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching driver with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getByStringId(stringId) {
    try {
      // Handle string IDs like "driver_1" by extracting the number
      const numericId = parseInt(stringId.replace('driver_', ''), 10);
      return await this.getById(numericId);
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching driver with string ID ${stringId}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getNearbyDrivers(location, vehicleType) {
    try {
      const allDrivers = await this.getAll();
      
      // Simulate finding nearby drivers
      const availableDrivers = allDrivers.filter(d => Math.random() > 0.3); // 70% available
      return availableDrivers.map(driver => ({
        ...driver,
        estimatedArrival: Math.floor(Math.random() * 8) + 2, // 2-10 minutes
        distance: (Math.random() * 2 + 0.5).toFixed(1) // 0.5-2.5 km away
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching nearby drivers:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  async create(driverData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: driverData.name,
            rating_c: driverData.rating,
            vehicle_model_c: driverData.vehicleModel,
            plate_number_c: driverData.plateNumber,
            photo_url_c: driverData.photoUrl
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
          console.error(`Failed to create driver records:${JSON.stringify(failedRecords)}`);
          
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
            rating: createdRecord.rating_c,
            vehicleModel: createdRecord.vehicle_model_c,
            plateNumber: createdRecord.plate_number_c,
            photoUrl: createdRecord.photo_url_c
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating driver:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
}

export default new DriverService();