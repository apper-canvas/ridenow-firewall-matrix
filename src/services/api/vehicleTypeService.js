import { toast } from 'react-toastify';

class VehicleTypeService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
    this.tableName = 'vehicle_type_c';
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
          { field: { Name: "capacity_c" } },
          { field: { Name: "base_price_c" } },
          { field: { Name: "price_per_km_c" } },
          { field: { Name: "icon_url_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "eta_c" } }
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
      return response.data.map(vehicleType => ({
        Id: vehicleType.Id,
        name: vehicleType.Name,
        capacity: vehicleType.capacity_c,
        basePrice: vehicleType.base_price_c,
        pricePerKm: vehicleType.price_per_km_c,
        iconUrl: vehicleType.icon_url_c,
        description: vehicleType.description_c,
        eta: vehicleType.eta_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching vehicle types:", error?.response?.data?.message);
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
          { field: { Name: "capacity_c" } },
          { field: { Name: "base_price_c" } },
          { field: { Name: "price_per_km_c" } },
          { field: { Name: "icon_url_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "eta_c" } }
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
        capacity: response.data.capacity_c,
        basePrice: response.data.base_price_c,
        pricePerKm: response.data.price_per_km_c,
        iconUrl: response.data.icon_url_c,
        description: response.data.description_c,
        eta: response.data.eta_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching vehicle type with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }

  async getAvailableTypes(location) {
    try {
      const allTypes = await this.getAll();
      
      // Simulate checking availability based on location
      return allTypes.map(type => ({
        ...type,
        available: Math.random() > 0.2, // 80% availability
        estimatedPrice: this.calculateEstimatedPrice(type, location)
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching available vehicle types:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return [];
    }
  }

  calculateEstimatedPrice(vehicleType, location) {
    // Simplified price calculation based on time of day and demand
    const baseMultiplier = 1 + (Math.random() * 0.5); // 1.0x to 1.5x surge
    const estimatedDistance = 5; // km average trip
    return Math.round((vehicleType.basePrice + (estimatedDistance * vehicleType.pricePerKm)) * baseMultiplier * 100) / 100;
  }

  async create(vehicleTypeData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        records: [
          {
            Name: vehicleTypeData.name,
            capacity_c: vehicleTypeData.capacity,
            base_price_c: vehicleTypeData.basePrice,
            price_per_km_c: vehicleTypeData.pricePerKm,
            icon_url_c: vehicleTypeData.iconUrl,
            description_c: vehicleTypeData.description,
            eta_c: vehicleTypeData.eta
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
          console.error(`Failed to create vehicle type records:${JSON.stringify(failedRecords)}`);
          
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
            capacity: createdRecord.capacity_c,
            basePrice: createdRecord.base_price_c,
            pricePerKm: createdRecord.price_per_km_c,
            iconUrl: createdRecord.icon_url_c,
            description: createdRecord.description_c,
            eta: createdRecord.eta_c
          };
        }
      }
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating vehicle type:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      return null;
    }
  }
}

export default new VehicleTypeService();