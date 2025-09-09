import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;