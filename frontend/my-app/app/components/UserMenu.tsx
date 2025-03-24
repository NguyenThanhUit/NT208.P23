// components/UserMenu.js
'use client'
import { useState } from 'react';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Xử lý đăng xuất ở đây
    console.log('Đăng xuất');
  };

  return (
    <div>
      <button onClick={toggleMenu} className="user-button">
        User
      </button>
      {isOpen && (
        <div className="menu">
          <ul>
            <li><a href="/orders">Xem đơn hàng của tôi</a></li>
            <li><a href="/create-order">Tạo đơn hàng</a></li>
            <li><button onClick={handleLogout}>Đăng xuất</button></li>
          </ul>
        </div>
      )}
      <style jsx>{`
        .menu {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        .menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .menu li {
          padding: 10px;
        }
        .menu li:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default UserMenu;