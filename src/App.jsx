import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DietPage } from './pages/DietPage';
import { ExercisePage } from './pages/ExercisePage';
import { LoginPage } from './pages/LoginPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { ProfilePage } from './pages/ProfilePage';
import AssessmentPage from './pages/AssessmentPage';
import { HomePage } from './pages/HomePage';
import DiaryLog from "./pages/DiaryLog";
import HydrationPage from "./pages/HydrationPage";
import SleepPage from "./pages/SleepPage";
import SideNavbar from "./components/SideNavbar";
import TopNavbar from "./components/TopNavbar";
import { useSelector } from 'react-redux';
function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isLoggedIn = useSelector((state)=> state.user.isLoggedIn)
  // Toggle Sidebar visibility
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <BrowserRouter>
      <div className="App flex flex-col">
        <TopNavbar />
        <div className="App" style={{ display: "flex" }}>
          {/* Conditionally render SideNavbar only if logged in */}
          {isLoggedIn && (
            <SideNavbar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
          )}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginLeft: isLoggedIn ? (isCollapsed ? '100px' : '250px') : '0',
              paddingTop: '60px',
            }}
          >
            <Routes>
              
              <Route path='/home' element={<HomePage />} />
              <Route path="/diet" element={<DietPage />} />
              <Route path="/exercise" element={<ExercisePage />} />
              <Route path="/login" element={<LoginPage/>} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/diary" element={<DiaryLog />} />
              <Route path="/hydration" element={<HydrationPage />} />
              <Route path="/sleep" element={<SleepPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
