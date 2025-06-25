import driversData from '../mockData/drivers.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DriverService {
  constructor() {
    this.drivers = [...driversData];
  }

  async getAll() {
    await delay(200);
    return [...this.drivers];
  }

  async getById(id) {
    await delay(150);
    const driver = this.drivers.find(d => d.Id === parseInt(id, 10));
    if (!driver) {
      throw new Error('Driver not found');
    }
    return { ...driver };
  }

  async getByStringId(stringId) {
    await delay(150);
    // Handle string IDs like "driver_1" by extracting the number
    const numericId = parseInt(stringId.replace('driver_', ''), 10);
    const driver = this.drivers.find(d => d.Id === numericId);
    if (!driver) {
      throw new Error('Driver not found');
    }
    return { ...driver };
  }

  async getNearbyDrivers(location, vehicleType) {
    await delay(400);
    // Simulate finding nearby drivers
    const availableDrivers = this.drivers.filter(d => Math.random() > 0.3); // 70% available
    return availableDrivers.map(driver => ({
      ...driver,
      estimatedArrival: Math.floor(Math.random() * 8) + 2, // 2-10 minutes
      distance: (Math.random() * 2 + 0.5).toFixed(1) // 0.5-2.5 km away
    }));
  }
}

export default new DriverService();