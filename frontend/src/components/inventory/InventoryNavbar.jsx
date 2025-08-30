import React, { useState } from "react";
import {
  faChartPie,
  faBoxes,
  faPlusCircle,
  faClipboardList,
  faFileAlt,
  faTruckLoading,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const InventoryNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const inventoryMenu = [
    { name: "Stock Dashboard", icon: faChartPie, path: "/inventory/dashboard" },
    { name: "Stock Products", icon: faBoxes, path: "/inventory/products" },
    { name: "Add Stock", icon: faPlusCircle, path: "/inventory/add" },
    { name: "Reorder Details", icon: faClipboardList, path: "/inventory/reorders" },
    { name: "Create Reorder", icon: faTruckLoading, path: "/inventory/create-reorder" },
    { name: "Stock Reports", icon: faFileAlt, path: "/inventory/reports" },
  ];

  return (
    <div className="w-full shadow-md rounded-xl" style={{ backgroundColor: "#A2C3E8" }}>
      {/* Desktop Navbar */}
      <div className="hidden md:flex items-center justify-start gap-3 overflow-x-auto p-3 custom-scroll">
        {inventoryMenu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition 
              ${isActive ? "bg-blue-600 text-white shadow-md" : "bg-white/70 text-gray-800 hover:bg-blue-200"}`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="text-base" />
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden p-3">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-lg" />
          Menu
        </button>

        {isOpen && (
          <div className="flex flex-col gap-2 mt-3">
            {inventoryMenu.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition 
                  ${isActive ? "bg-blue-600 text-white shadow-md" : "bg-white/70 text-gray-800 hover:bg-blue-200"}`
                }
                onClick={() => setIsOpen(false)} // close menu when clicking
              >
                <FontAwesomeIcon icon={item.icon} className="text-base" />
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryNavbar;
