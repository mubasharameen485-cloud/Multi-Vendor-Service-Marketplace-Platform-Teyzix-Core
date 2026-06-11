import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-lg font-semibold text-green-400 mb-2">Teyzix Core Marketplace</h3>
        <p className="text-gray-400 text-sm mb-4">
          Connecting trusted service providers with businesses locally and globally.
        </p>
        <div className="text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Teyzix Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;