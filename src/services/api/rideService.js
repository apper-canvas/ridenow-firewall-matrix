import ridesData from '../mockData/rides.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RideService {
  constructor() {
    this.rides = [...ridesData];
  }

  async getAll() {
    await delay(300);
    return [...this.rides];
  }

  async getById(id) {
    await delay(200);
    const ride = this.rides.find(r => r.Id === parseInt(id, 10));
    if (!ride) {
      throw new Error('Ride not found');
    }
    return { ...ride };
  }

  async create(rideData) {
    await delay(400);
    const newRide = {
      ...rideData,
      Id: Math.max(...this.rides.map(r => r.Id), 0) + 1,
      status: 'requested',
      createdAt: new Date().toISOString()
    };
    this.rides.push(newRide);
    return { ...newRide };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.rides.findIndex(r => r.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...this.rides[index],
      ...updates,
      Id: this.rides[index].Id // Prevent Id modification
    };
    
    this.rides[index] = updatedRide;
    return { ...updatedRide };
  }

  async delete(id) {
    await delay(250);
    const index = this.rides.findIndex(r => r.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Ride not found');
    }
    
    const deletedRide = { ...this.rides[index] };
    this.rides.splice(index, 1);
    return deletedRide;
  }

  async getUserRides() {
    await delay(300);
    return [...this.rides].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getActiveRide() {
    await delay(200);
    const activeRide = this.rides.find(r => r.status === 'in_progress' || r.status === 'requested');
    return activeRide ? { ...activeRide } : null;
  }

  async cancelRide(id) {
    await delay(300);
    return this.update(id, { status: 'cancelled' });
  }

  async completeRide(id) {
    await delay(300);
    return this.update(id, { status: 'completed' });
  }

  async requestRide(pickupLocation, dropoffLocation, vehicleType) {
    await delay(500);
    
    // Calculate basic fare (simplified)
    const distance = this.calculateDistance(pickupLocation, dropoffLocation);
    const baseFare = vehicleType.basePrice;
    const distanceFare = distance * vehicleType.pricePerKm;
    const totalFare = Math.round((baseFare + distanceFare) * 100) / 100;

    const newRide = {
      Id: Math.max(...this.rides.map(r => r.Id), 0) + 1,
      pickupLocation,
      dropoffLocation,
      vehicleType: vehicleType.name.toLowerCase(),
      fare: totalFare,
      status: 'requested',
      driverId: `driver_${Math.floor(Math.random() * 5) + 1}`,
      eta: new Date(Date.now() + Math.random() * 600000).toISOString(), // Random ETA within 10 mins
      createdAt: new Date().toISOString()
    };

    this.rides.push(newRide);
    
    // Simulate driver assignment after a short delay
    setTimeout(() => {
      this.update(newRide.Id, { status: 'driver_assigned' });
    }, 2000);

    return { ...newRide };
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