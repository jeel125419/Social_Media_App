import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import SighIn from './pages/Register'
import LogIn from './pages/LogIn'
import ProtectRoutes from './components/ProtectRoutes'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PostPage from './pages/PostPage'

function App() {
  const navigation = useNavigate()

  const token = localStorage.getItem('token')

  return (
    <>
      <nav className='flex gap-4 p-2 bg-white fixed top-4 left-4 right-4 rounded-md z-10 justify-between'>
        <div className='flex gap-8 justify-center items-center'>
        <Link to="/" className="cursor-pointer hover:bg-[#DBEAFE] p-2 rounded-2xl text-[#475569] hover:text-[#2563EB] border border-transparent border-[#E2E8F0] hover:border-[#E2E8F0] hover:box-border transition-all duration-200">Home</Link>
        {!token && <Link to="/register" className="cursor-pointer hover:bg-[#DBEAFE] p-2 rounded-2xl text-[#475569] hover:text-[#2563EB] border border-transparent hover:border-[#E2E8F0] hover:box-border transition-all duration-200">Register</Link>}
        {!token && <Link to="/login" className="cursor-pointer hover:bg-[#DBEAFE] p-2 rounded-2xl text-[#475569] hover:text-[#2563EB] border border-transparent hover:border-[#E2E8F0] hover:box-border transition-all duration-200">Log In</Link>}
        {token && <Link to="/dashboard" className="cursor-pointer hover:bg-[#DBEAFE] p-2 rounded-2xl text-[#475569] hover:text-[#2563EB] border border-transparent hover:border-[#E2E8F0] hover:box-border transition-all duration-200">Dashboard</Link>}

        </div>

        {
          token && <div onClick={() => navigation('/login')} className="cursor-pointer h-10 w-10 bg-[#CBD5E1] text-[#334155] rounded-full flex items-center justify-center">J</div>
        }
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SighIn />} />
        <Route path="/login" element={<LogIn />} />

        <Route path='/dashboard' element={
          <ProtectRoutes>
            {<Dashboard />}
          </ProtectRoutes>
        }> </Route>
        <Route path='/post/:postId' element={<PostPage />} />

      </Routes>
    </>
  )
}

export default App
