import React from "react";

const Navbar = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <span className="font-medium">User: Admin</span>
        <button className="btn btn-sm btn-ghost">Logout</button>
      </div>
    </header>
  );
};

export default Navbar;
