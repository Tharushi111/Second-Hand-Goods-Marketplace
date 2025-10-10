import React, { useState } from "react";
import {
  faHome,
  faUsers,
  faBoxOpen,
  faClipboardList,
  faBoxes,
  faTruck,
  faChartLine,
  faCommentDots,
  faBars,
  faTimes,
  faDolly,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import logo from "../assets/ReBuy.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", icon: faHome, path: "/" },
    { name: "Users", icon: faUsers, path: "/users" },
    { name: "Order", icon: faClipboardList, path: "/orders" },
    { name: "Product", icon: faBoxOpen, path: "/product" },
    { name: "Inventory", icon: faBoxes, path: "/inventory" },
    { name: "Supplier", icon: faTruck, path: "/suppliers" },
    { name: "Finance", icon: faChartLine, path: "/finance" },
    { name: "Delivery", icon: faDolly, path: "/delivery" },
    { name: "Feedback", icon: faCommentDots, path: "/feedback" },
  ];

  return (
    <>
      {/* Mobile Navbar Toggle */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#001840] text-white">
        <img src={logo} alt="ReBuy.lk Logo" className="h-12 w-auto" />
        <button onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-[#001840] text-white shadow-lg z-50 flex flex-col overflow-y-auto transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo Section for Desktop */}
        <div className="hidden md:flex justify-center items-center p-6 border-b border-blue-300">
          <img src={logo} alt="ReBuy.lk Logo" className="h-20 w-auto" />
        </div>

        {/* Menu Section */}
        <nav className="flex-1 p-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-200 hover:bg-blue-500"
                }`
              }
              onClick={() => setIsOpen(false)} // Close mobile menu on click
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
