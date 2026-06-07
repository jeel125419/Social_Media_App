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
      <nav className='flex gap-4 p-4 bg-gray-200 fixed top-4 left-4 right-4 rounded-md z-10 justify-end'>
        <Link to="/" className="bg-amber-500 cursor-pointer hover:scale-125 transition-transform rounded-md p-2 hover:bg-amber-600">Home</Link>
        {!token && <Link to="/register" className="bg-amber-500 cursor-pointer hover:scale-125 transition-transform rounded-md p-2 hover:bg-amber-600">Register</Link>}
        {!token && <Link to="/login" className="bg-amber-500 cursor-pointer hover:scale-125 transition-transform rounded-md p-2 hover:bg-amber-600">Log In</Link>}
        {token && <Link to="/dashboard" className="bg-amber-500 cursor-pointer hover:scale-125 transition-transform rounded-md p-2 hover:bg-amber-600">Dashboard</Link>}

        {
          token && <button onClick={()=> {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            navigation('/')
          }} className="bg-red-600 cursor-pointer hover:scale-125 transition-transform rounded-md p-2 hover:bg-red-700">Log Out</button>
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
