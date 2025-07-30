import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FloatingCTA from './FloatingCTA';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <FloatingCTA />
    </div>
  );
}