import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routeArray } from '@/config/routes';

const Layout = () => {
  const location = useLocation();
  const visibleRoutes = routeArray.filter(route => !route.hideFromNav);
  
  // Hide navigation on booking flow and active ride screens
  const hideNavigation = location.pathname.includes('/book') || location.pathname.includes('/ride/');

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      {!hideNavigation && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="flex-shrink-0 bg-surface border-t border-gray-200 z-40"
        >
          <div className="flex justify-around items-center h-16 px-4">
            {visibleRoutes.map((route) => {
              const isActive = location.pathname === route.path;
              
              return (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className="flex flex-col items-center justify-center flex-1 py-2 relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className={`flex flex-col items-center ${
                      isActive ? 'text-secondary' : 'text-gray-500'
                    }`}
                  >
                    <ApperIcon 
                      name={route.icon} 
                      size={20}
                      className="mb-1"
                    />
                    <span className="text-xs font-medium">
                      {route.label}
                    </span>
                  </motion.div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute top-0 left-1/2 w-8 h-1 bg-secondary rounded-b-full"
                      style={{ x: '-50%' }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </motion.nav>
      )}
    </div>
  );
};

export default Layout;