import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import SighIn from './components/Register'
import LogIn from './components/LogIn'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Log In</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/register" element={<SighIn />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </>
  )
}

export default App
