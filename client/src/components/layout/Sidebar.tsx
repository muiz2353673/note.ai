// Import React for component creation
import React from "react";
// Import NavLink for navigation with active state styling
import { NavLink } from "react-router-dom";
// Import custom authentication context hook
import { useAuth } from "../../contexts/AuthContext";
// Import Heroicons for navigation and UI icons
import {
  HomeIcon,
  DocumentTextIcon,
  LightBulbIcon,
  AcademicCapIcon,
  UserIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

// Sidebar component that provides left navigation for authenticated users
const Sidebar: React.FC = () => {
 
  const { user } = useAuth();

 
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Notes", href: "/notes", icon: DocumentTextIcon },
    { name: "AI Features", href: "/ai-features", icon: LightBulbIcon },
    { name: "Flashcards", href: "/flashcards", icon: BookOpenIcon },
    { name: "Citations", href: "/citations", icon: AcademicCapIcon },
    { name: "Profile", href: "/profile", icon: UserIcon },
  ];

 
  const getNavLinkClass = (isActive: boolean) => {
    return `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? "bg-primary-100 text-primary-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      {" "}
     
      <div className="p-6">
        {" "}
       
       
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            {" "}
           
           
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </span>
            </div>
           
            <div>
              <p className="text-sm font-medium text-gray-900">
                {" "}
               
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {" "}
               
                {user?.subscription?.plan || "Free"} Plan
              </p>
            </div>
          </div>
        </div>
       
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => getNavLinkClass(isActive)}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
       
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          {" "}
         
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {" "}
           
            Usage This Month
          </h3>
          <div className="space-y-2">
            {" "}
           
           
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">AI Summaries</span>{" "}
             
              <span className="text-gray-900">
                {user?.usage?.totalSummaries || 0} /
                {user?.subscription?.features?.aiSummaries || 0}{" "}
               
              </span>
            </div>
           
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Flashcards</span>{" "}
             
              <span className="text-gray-900">
                {user?.usage?.totalFlashcards || 0} /
                {user?.subscription?.features?.flashcardGeneration || 0}{" "}
               
              </span>
            </div>
           
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Assignments</span>{" "}
             
              <span className="text-gray-900">
                {user?.usage?.totalAssignments || 0} /
                {user?.subscription?.features?.assignmentHelp || 0}{" "}
               
              </span>
            </div>
          </div>
        </div>
       
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {" "}
           
            Quick Actions
          </h3>
          <div className="space-y-2">
            {" "}
           
           
            <NavLink
              to="/notes/new"
              className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <DocumentTextIcon className="mr-2 h-4 w-4" />
              New Note
            </NavLink>
           
            <NavLink
              to="/ai-features"
              className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <LightBulbIcon className="mr-2 h-4 w-4" />
              AI Summary
            </NavLink>
           
            <NavLink
              to="/flashcards"
              className="flex items-center px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
            >
              <BookOpenIcon className="mr-2 h-4 w-4" />
              Study Mode
            </NavLink>
          </div>
        </div>
       
        {user?.university && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            {" "}
           
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              {" "}
             
              University
            </h3>
            <p className="text-xs text-blue-700">{user.university.name}</p>{" "}
           
          </div>
        )}
      </div>
    </div>
  );
};

// Export the Sidebar component as default
export default Sidebar;
