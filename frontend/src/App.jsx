import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import SighIn from './components/Register'
import LogIn from './components/LogIn'
import ProtectRoutes from './components/ProtectRoutes'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PostPage from './components/PostPage'

function App() {
  const navigation = useNavigate()

  const token = localStorage.getItem('token')

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {!token && <Link to="/register">Register</Link>}
        {!token && <Link to="/login">Log In</Link>}
        {token && <Link to="/dashboard">Dashboard</Link>}

        {
          token && <button onClick={()=> {
            localStorage.removeItem('token')
            navigation('/')
          }}>Log Out</button>
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
