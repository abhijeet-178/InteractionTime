import React from 'react';
import Navbar from "./Navbar.jsx"
import Sidebar from './sideBar';

const Layout = ({ children, showSidebar = false }) => {
  return (
    // h-screen ensures the layout always matches the window height
    <div className='h-screen flex overflow-hidden'>
      {showSidebar && <Sidebar />}

      {/* min-w-0 is a flexbox trick to prevent child overflow from breaking the layout */}
      <div className='flex-1 flex flex-col min-w-0'>
        <Navbar />

        {/* flex-1: Fills the remaining vertical space 
          overflow-hidden: Prevents the main container from scrolling so individual parts can 
        */}
        <main className="flex-1 flex flex-col overflow-hidden bg-base-100 text-base-content transition-colors duration-300">
          
          {/* Inner container for the chat content. 
             Note: I removed "p-6" because chat apps usually need messages 
             to touch the edges, but you can add 'p-4' here if you want padding.
          */}
          <div className="flex-1 relative overflow-y-auto">
            {children}
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default Layout;