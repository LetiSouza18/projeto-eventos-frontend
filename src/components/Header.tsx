import React from 'react';
import { Calendar, Plus, Heart } from 'lucide-react';

interface HeaderProps {
  activeTab: 'events' | 'create';
  onTabChange: (tab: 'events' | 'create') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-pink-200" />
            <h1 className="text-2xl font-bold">Women in Tech Events</h1>
          </div>
          
          <nav className="flex space-x-1">
            <button
              onClick={() => onTabChange('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'events'
                  ? 'bg-white text-pink-600 shadow-md'
                  : 'text-pink-100 hover:bg-pink-600'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </button>
            
            <button
              onClick={() => onTabChange('create')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'create'
                  ? 'bg-white text-pink-600 shadow-md'
                  : 'text-pink-100 hover:bg-pink-600'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};