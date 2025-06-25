import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';

const Payment = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      lastFour: '4242',
      brand: 'visa',
      isDefault: true,
      name: 'Personal Card'
    },
    {
      id: 2,
      type: 'card',
      lastFour: '8888',
      brand: 'mastercard',
      isDefault: false,
      name: 'Work Card'
    }
  ]);

  const [showAddCard, setShowAddCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetDefault = (methodId) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
    toast.success('Default payment method updated');
  };

  const handleRemoveMethod = (methodId) => {
    setPaymentMethods(methods =>
      methods.filter(method => method.id !== methodId)
    );
    toast.success('Payment method removed');
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCard = {
        id: Date.now(),
        type: 'card',
        lastFour: '9999',
        brand: 'visa',
        isDefault: false,
        name: 'New Card'
      };
      
      setPaymentMethods(methods => [...methods, newCard]);
      setShowAddCard(false);
      setIsLoading(false);
      toast.success('Card added successfully');
    }, 1500);
  };

  const getBrandIcon = (brand) => {
    switch (brand) {
      case 'visa':
        return 'CreditCard';
      case 'mastercard':
        return 'CreditCard';
      default:
        return 'CreditCard';
    }
  };

  const formatCardBrand = (brand) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <div className="h-screen bg-background overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">Payment</h1>
          <p className="text-gray-600">Manage your payment methods and billing</p>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Payment Methods</h2>
            <Button
              onClick={() => setShowAddCard(true)}
              variant="outline"
              size="sm"
              icon="Plus"
            >
              Add Card
            </Button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <ApperIcon name={getBrandIcon(method.brand)} size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">
                          {formatCardBrand(method.brand)} •••• {method.lastFour}
                        </p>
                        <p className="text-sm text-gray-500">{method.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <span className="text-xs bg-secondary text-white px-2 py-1 rounded-full font-medium">
                          Default
                        </span>
                      )}
                      
                      <div className="flex gap-1">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Set as default"
                          >
                            <ApperIcon name="Star" size={16} className="text-gray-400" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleRemoveMethod(method.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Remove card"
                        >
                          <ApperIcon name="Trash2" size={16} className="text-error" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add Card Form */}
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Add New Card</h3>
              
              <form onSubmit={handleAddCard} className="space-y-4">
                <Input
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  icon="CreditCard"
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVV"
                    placeholder="123"
                    required
                  />
                </div>
                
                <Input
                  label="Cardholder Name"
                  placeholder="John Doe"
                  required
                />
                
                <Input
                  label="Card Nickname (Optional)"
                  placeholder="Personal Card"
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isLoading}
                    className="flex-1"
                  >
                    Add Card
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddCard(false)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Billing History */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Recent Transactions</h2>
          
          <div className="space-y-3">
            {[
              { id: 1, date: '2024-01-15', amount: 18.50, description: 'Ride to Central Park', status: 'completed' },
              { id: 2, date: '2024-01-14', amount: 24.75, description: 'Ride to 5th Avenue', status: 'completed' },
              { id: 3, date: '2024-01-13', amount: 32.00, description: 'Ride to Brooklyn Bridge', status: 'refunded' }
            ].map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-primary">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">${transaction.amount}</p>
                      <p className={`text-xs capitalize ${
                        transaction.status === 'completed' ? 'text-success' : 
                        transaction.status === 'refunded' ? 'text-warning' : 'text-gray-500'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Settings */}
        <div>
          <h2 className="text-lg font-semibold text-primary mb-4">Settings</h2>
          
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Auto-pay</p>
                  <p className="text-sm text-gray-500">Automatically charge your default card</p>
                </div>
                <button className="w-12 h-6 bg-secondary rounded-full relative transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform transform"></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">Email receipts</p>
                  <p className="text-sm text-gray-500">Get receipts sent to your email</p>
                </div>
                <button className="w-12 h-6 bg-secondary rounded-full relative transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform transform"></div>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;