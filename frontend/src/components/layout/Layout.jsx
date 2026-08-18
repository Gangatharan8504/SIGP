import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { AIAssistantDrawer } from '../common/AIAssistantDrawer';

export const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const publicRoutes = ['/', '/features', '/pricing', '/about', '/contact', '/login', '/register'];
  const isPublicPage = publicRoutes.includes(location.pathname) && !user;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-rose-500 selection:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex w-full max-w-full">
        {/* Portal Sidebar if logged in */}
        {user && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 w-full transition-all duration-200 ${
            user ? 'lg:pl-64' : ''
          } flex flex-col`}
        >
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
            <Outlet />
          </div>

          {isPublicPage && <Footer />}
        </main>
      </div>

      {/* Persistent Floating Multi-Agent AI Drawer */}
      <AIAssistantDrawer />
    </div>
  );
};
