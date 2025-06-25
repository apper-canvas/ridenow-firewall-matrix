import Home from '@/components/pages/Home';
import Trips from '@/components/pages/Trips';
import Payment from '@/components/pages/Payment';
import Account from '@/components/pages/Account';
import BookingFlow from '@/components/pages/BookingFlow';
import ActiveRide from '@/components/pages/ActiveRide';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'MapPin',
    component: Home
  },
  trips: {
    id: 'trips',
    label: 'Trips',
    path: '/trips',
    icon: 'Clock',
    component: Trips
  },
  payment: {
    id: 'payment',
    label: 'Payment',
    path: '/payment',
    icon: 'CreditCard',
    component: Payment
  },
  account: {
    id: 'account',
    label: 'Account',
    path: '/account',
    icon: 'User',
    component: Account
  },
  bookingFlow: {
    id: 'bookingFlow',
    label: 'Book Ride',
    path: '/book',
    icon: 'Car',
    component: BookingFlow,
    hideFromNav: true
  },
  activeRide: {
    id: 'activeRide',
    label: 'Active Ride',
    path: '/ride/:rideId',
    icon: 'Navigation',
    component: ActiveRide,
    hideFromNav: true
  }
};

export const routeArray = Object.values(routes);
export default routes;