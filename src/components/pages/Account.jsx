import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';

const Account = () => {
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    totalRides: 127
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    // Would typically clear auth state and redirect
  };

  const menuItems = [
    {
      icon: 'MapPin',
      title: 'Saved Places',
      description: 'Home, work, and favorite locations',
      action: () => console.log('Saved places')
    },
    {
      icon: 'Bell',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      action: () => console.log('Notifications')
    },
    {
      icon: 'Shield',
      title: 'Privacy & Safety',
      description: 'Security settings and safety features',
      action: () => console.log('Privacy')
    },
    {
      icon: 'HelpCircle',
      title: 'Help & Support',
      description: 'FAQ, contact us, and report issues',
      action: () => console.log('Help')
    },
    {
      icon: 'Star',
      title: 'Rate the App',
      description: 'Share your feedback on the app store',
      action: () => console.log('Rate app')
    },
    {
      icon: 'FileText',
      title: 'Legal',
      description: 'Terms of service and privacy policy',
      action: () => console.log('Legal')
    }
  ];

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">Account</h1>
          <p className="text-gray-600">Manage your profile and app settings</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-primary">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Star" size={16} className="text-warning fill-current" />
                      <span className="text-sm font-medium">{user.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Car" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{user.totalRides} rides</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                size="sm"
                icon="Edit"
              >
                Edit
              </Button>
            </div>

            {isEditing && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSaveProfile}
                className="space-y-4 pt-4 border-t border-gray-200"
              >
                <Input
                  label="Full Name"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  required
                />
                
                <Input
                  label="Phone Number"
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  required
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </Card>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover onClick={item.action} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                    <ApperIcon name={item.icon} size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary">{item.title}</h3>
                    <p className="text-sm text-gray-500 break-words">{item.description}</p>
                  </div>
                  <ApperIcon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* App Info */}
        <Card className="p-4 mb-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
              <ApperIcon name="Car" size={24} className="text-white" />
            </div>
            <h3 className="font-semibold text-primary">RideNow</h3>
            <p className="text-sm text-gray-500">Version 2.1.0</p>
            <p className="text-xs text-gray-400">© 2024 RideNow Inc.</p>
          </div>
        </Card>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-error text-error hover:bg-error hover:text-white"
          icon="LogOut"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Account;