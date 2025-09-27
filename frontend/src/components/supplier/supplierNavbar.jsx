import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const SupplierNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { 
      name: "Offers", 
      path: "/suppliers/offers",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      name: "Replies", 
      path: "/suppliers/replies",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
  ];

  return (
    <div className="w-full shadow-md rounded-xl bg-blue-200">
      {/* Desktop Navbar */}
      <div className="hidden md:flex gap-3 p-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${isActive ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden p-3">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {isOpen ? "Close Menu" : "Menu"}
        </button>
        {isOpen && (
          <div className="flex flex-col mt-2 gap-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${isActive ? "bg-blue-600 text-white" : "bg-white text-gray-800"}`
                }
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierNavbar;