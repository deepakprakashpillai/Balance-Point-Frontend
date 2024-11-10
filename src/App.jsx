import { useState } from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { DietPage } from './pages/DietPage'
import { ExercisePage } from './pages/ExercisePage'
import { LoginPage } from './pages/LoginPage'
import { RegistrationPage } from './pages/RegistrationPage'
import { ProfilePage } from './pages/ProfilePage'
import AssessmentPage from './pages/AssessmentPage'
import { HomePage } from './pages/HomePage'


function App() {

  return (
    
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<HomePage/>}/>
        <Route path="/diet" element={<DietPage/>}/>
        <Route path="/exercise" element={<ExercisePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegistrationPage/>}/>
        <Route path="/assessment" element={<AssessmentPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
