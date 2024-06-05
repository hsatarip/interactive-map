import React, { useState } from 'react';
import './Menu.css';

const Menu = ({ onAddProperty, onViewProperties }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="menu-container">
      <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>Menu</button>
      {showMenu && (
        <div className="popup">
          <button onClick={onAddProperty}>Add Property</button>
          <button onClick={onViewProperties}>View Properties</button>
        </div>
      )}
    </div>
  );
};

export default Menu;