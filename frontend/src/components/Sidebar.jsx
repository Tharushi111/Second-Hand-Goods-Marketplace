import React from "react";
import {
  faHome,
  faUsers,
  faBoxOpen,
  faClipboardList,
  faBoxes,
  faTruck,
  faChartLine,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom"; 
import logo from "../assets/ReBuy.png";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: faHome, path: "/" },
    { name: "Users", icon: faUsers, path: "/users" },
    { name: "Order", icon: faClipboardList, path: "/order" },
    { name: "Product", icon: faBoxOpen, path: "/product" },
    { name: "Inventory", icon: faBoxes, path: "/inventory" },
    { name: "Supplier", icon: faTruck, path: "/supplier" },
    { name: "Finance", icon: faChartLine, path: "/finance" },
    { name: "Feedback", icon: faCommentDots, path: "/feedback" },
  ];

  return (
    <div
      className="w-64 min-h-screen text-white flex flex-col shadow-lg"
      style={{ backgroundColor: "#001840" }}
    >
      {/* Logo Section */}
      <div className="flex justify-center items-center p-6 border-b border-blue-300">
        <img
          src={logo}
          alt="ReBuy.lk Logo"
          className="h-20 w-auto"
        />
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
          >
            <FontAwesomeIcon icon={item.icon} className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
