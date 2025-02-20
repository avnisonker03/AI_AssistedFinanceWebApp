import React from 'react';
import { LayoutDashboard, Wallet, PiggyBank, Receipt, ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Drawer = ({ isOpen, toggleDrawer }) => {
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Wallet className="w-5 h-5" />, label: 'Income', path: '/my-income-list' },
    { icon: <PiggyBank className="w-5 h-5" />, label: 'Budget', path: '/my-budget-list' },
    { icon: <Receipt className="w-5 h-5" />, label: 'Expenses', path: '/my-expense-list' },
  ];

  return (
    <>
      {/* Overlay - only shown on mobile when drawer is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleDrawer}
        />
      )}

      {/* Fixed Drawer - always in DOM when authenticated */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-40 w-64 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-800 mt-8 flex gap-2">
          {/* <Home className="h-7 w-7 text-blue-400" /> */}
          {/* <span className="text-2xl font-bold text-gray-100">SpendWise</span> */}
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="text-lg">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Pro Tip</h3>
            <p className="text-gray-300 text-sm">
              Track your finances with ease and gain insights into your spending habits
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Drawer;