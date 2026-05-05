import { useState } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()

      try {
        const response = await api.post('/register', {username, email, password})

        setMessage("User registered successfully")
        setError('')
        navigate('/login')

      } catch (error) {
        setError(error.response?.data?.message || 'Registration failed')
        setMessage('')
      } finally{
        setUsername('')
        setEmail('')
        setPassword('')
      }
    }

  return (
    <div>
      <h1>This is register page</h1>

      <form onSubmit={handleSubmit}>

        <label htmlFor="username">Username:</label>
      <input 
        type="text" 
        id="username"
        placeholder="Enter your username " 
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
      />
      <label htmlFor="email">Email:</label>
      <input 
        type="email" 
        id="email"
        placeholder="Enter your email id " 
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input 
        type="password" 
        id="password"
        placeholder="Enter your password " 
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">Register</button>

      {error && <p >{error}</p>}
      {message && <p >{message}</p>}

      </form>

      
    </div>
  )
}

export default Register
