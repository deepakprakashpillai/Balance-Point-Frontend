import React, { useState } from "react";
import { Menu, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { FaHeartbeat, FaUtensils, FaTint, FaBed, FaBook, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from "../store/userSlice";

const items = [
  {
    key: "1",
    icon: <FaHeartbeat className="text-2xl" />,
    label: "Exercise",
    path: "/exercise",
  },
  {
    key: "2",
    icon: <FaUtensils className="text-2xl" />,
    label: "Diet",
    path: "/diet",
  },
  {
    key: "3",
    icon: <FaTint className="text-2xl" />,
    label: "Hydration",
    path: "/hydration",
  },
  {
    key: "4",
    icon: <FaBed className="text-2xl" />,
    label: "Sleep",
    path: "/sleep",
  },
  {
    key: "5",
    icon: <FaBook className="text-2xl" />,
    label: "Diary",
    path: "/diary",
  },
];

const SideNavbar = ({ isCollapsed, toggleSidebar }) => {
    const dispatch = useDispatch()
    const [selectedKey, setSelectedKey] = useState("1");
  
    const navigate = useNavigate();
  
    const handleMenuClick = (key, path) => {
      setSelectedKey(key);
      navigate(path);
    };

    const handleLogout = () =>{
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        dispatch(setIsLoggedIn(false))
        navigate('./login')
    }
  
    return (
        <div
        className="flex flex-col bg-black pt-[80px] px-2 fixed top-0 left-0 h-full"
        style={{ width: isCollapsed ? '100px' : '250px' }}
      >
        <Button
          type="primary"
          onClick={toggleSidebar}
          className="mb-2 z-10 bg-black"
        >
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
  
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={isCollapsed}
          selectedKeys={[selectedKey]}
          className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-8'}`}
        >
          {items.map((item) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => handleMenuClick(item.key, item.path)}
            >
              {item.label}
            </Menu.Item>
          ))}
          <div className="border-t border-gray-600 mt-24 pl-2">
            <Menu.Item
              key="6"
              icon={<FaUserCircle className="text-2xl" />}
              className="text-white p-3 text-left"
              onClick={() => handleMenuClick("profile", "/profile")}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              key="7"
              icon={<FaSignOutAlt className="text-3xl" />}
              className="text-white p-3 text-left"
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </div>
        </Menu>
      </div>
    );
  };
  

export default SideNavbar;
