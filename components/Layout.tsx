import React from 'react';
import { Bell, Menu, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  showUserInfo?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, showUserInfo = true }) => {
  return (
    <div className="min-h-screen bg-white max-w-md mx-auto shadow-2xl relative overflow-hidden flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex justify-between items-center bg-white z-10">
        <h1 className="text-2xl font-bold text-gray-800">출석</h1>
        <div className="flex gap-4 text-gray-600">
          <Bell className="w-6 h-6" />
          <Menu className="w-6 h-6" />
        </div>
      </header>

      {/* User Info */}
      {showUserInfo && (
        <div className="px-6 pb-2 flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">
              {user.major} <span className="mx-1">|</span> {user.id}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
};
