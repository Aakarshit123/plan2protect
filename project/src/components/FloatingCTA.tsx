import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function FloatingCTA() {
  return (
    <Link
      to="/start-assessment"
      className="fixed bottom-6 right-6 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
    >
      <Search className="h-6 w-6" />
    </Link>
  );
}