import React from "react";

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <button>Routes</button>
        <button>Map</button>
        <button>Settings</button>
      </nav>
    </header>
  );
};

export default Header;
