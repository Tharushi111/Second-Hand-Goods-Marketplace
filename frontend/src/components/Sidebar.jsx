// Sidebar.jsx
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
          <a
            key={index}
            href={item.path}
            className="flex items-center p-3 rounded-lg transition-colors mb-2"
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#123499")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FontAwesomeIcon icon={item.icon} className="mr-3" />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
