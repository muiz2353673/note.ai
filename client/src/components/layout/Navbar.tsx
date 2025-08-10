// Import React and useState hook for component state management
import React, { useState } from "react";
// Import React Router components for navigation
import { Link } from "react-router-dom";
// Import Heroicons for UI icons
import {
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
// Import authentication context hook
import { useAuth } from "../../contexts/AuthContext";
// Import notification dropdown component
import NotificationDropdown from "../NotificationDropdown";

// Navbar component that provides top navigation for authenticated users
const Navbar: React.FC = () => {
 
  const [showDropdown, setShowDropdown] = useState(false);
 
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="flex justify-between items-center h-16">
         
          
         
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0">
             
              <h1 className="text-2xl font-bold text-gradient">
                Noted.AI
              </h1>
             
            </Link>
          </div>

         
          <div className="hidden md:block flex-1 max-w-lg mx-8">
           
            <div className="relative">
             
              <input
                type="text"
                placeholder="Search notes, flashcards..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
             
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

         
          <div className="flex items-center space-x-4">
           
            
           
            <NotificationDropdown />

           
            <div className="relative">
             
             
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
               
                <div className="hidden md:block text-left">
                 
                  <p className="text-sm font-medium text-gray-900">
                   
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                 
                </div>
              </button>

             
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                 
                  
                 
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <UserCircleIcon className="h-4 h-4 mr-3" />
                   
                    Profile
                  </Link>
                  
                 
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                   
                    Settings
                  </Link>
                  
                 
                  <hr className="my-1" />
                  
                 
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                   
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     
      <div className="md:hidden px-4 pb-4">
       
        <div className="relative">
         
          <input
            type="text"
            placeholder="Search notes, flashcards..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
         
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Export the Navbar component as default
export default Navbar;
