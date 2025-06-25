import locationsData from '../mockData/locations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class LocationService {
  constructor() {
    this.locations = [...locationsData];
  }

  async getAll() {
    await delay(200);
    return [...this.locations];
  }

  async getById(id) {
    await delay(150);
    const location = this.locations.find(l => l.Id === parseInt(id, 10));
    if (!location) {
      throw new Error('Location not found');
    }
    return { ...location };
  }

  async searchLocations(query) {
    await delay(300);
    if (!query || query.length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    return this.locations.filter(location => 
      location.name.toLowerCase().includes(searchTerm) ||
      location.address.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 results
  }

  async getCurrentLocation() {
    await delay(400);
    // Simulate getting user's current location
    return {
      address: "Current Location",
      latitude: 40.7128,
      longitude: -74.0060,
      name: "Your Location"
    };
  }

  async getLocationFromCoordinates(lat, lng) {
    await delay(350);
    // Simulate reverse geocoding
    const nearestLocation = this.locations.reduce((closest, location) => {
      const distance = Math.sqrt(
        Math.pow(location.latitude - lat, 2) + Math.pow(location.longitude - lng, 2)
      );
      return distance < closest.distance ? { location, distance } : closest;
    }, { location: this.locations[0], distance: Infinity });

    return {
      ...nearestLocation.location,
      address: `Near ${nearestLocation.location.name}`,
      latitude: lat,
      longitude: lng
    };
  }
}

export default new LocationService();