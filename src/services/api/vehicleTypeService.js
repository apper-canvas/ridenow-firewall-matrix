import vehicleTypesData from '../mockData/vehicleTypes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class VehicleTypeService {
  constructor() {
    this.vehicleTypes = [...vehicleTypesData];
  }

  async getAll() {
    await delay(200);
    return [...this.vehicleTypes];
  }

  async getById(id) {
    await delay(150);
    const vehicleType = this.vehicleTypes.find(vt => vt.Id === parseInt(id, 10));
    if (!vehicleType) {
      throw new Error('Vehicle type not found');
    }
    return { ...vehicleType };
  }

  async getAvailableTypes(location) {
    await delay(300);
    // Simulate checking availability based on location
    return this.vehicleTypes.map(type => ({
      ...type,
      available: Math.random() > 0.2, // 80% availability
      estimatedPrice: this.calculateEstimatedPrice(type, location)
    }));
  }

  calculateEstimatedPrice(vehicleType, location) {
    // Simplified price calculation based on time of day and demand
    const baseMultiplier = 1 + (Math.random() * 0.5); // 1.0x to 1.5x surge
    const estimatedDistance = 5; // km average trip
    return Math.round((vehicleType.basePrice + (estimatedDistance * vehicleType.pricePerKm)) * baseMultiplier * 100) / 100;
  }
}

export default new VehicleTypeService();