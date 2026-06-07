import { useState, useRef } from "react"
import api from "../api/axios"
import { useNavigate } from "react-router-dom"

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const usernameErrorRef = useRef()
    const emailErrorRef = useRef()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault()

      try {
        await api.post('/register', {username, email, password})

        setMessage("User registered successfully")
        setError('')
        navigate('/login')

      } catch (e) {
        setError(e.response?.data?.message || 'Registration failed')
        setMessage('')

        if (e.response?.data?.message === "User already exists") {
            usernameErrorRef.current.focus()
        }
        if (e.response?.data?.message === "Email already exists") {
            emailErrorRef.current.focus()
        }
      }

        if (error === 'User registered successfully') {
        setUsername('')
        setEmail('')
        setPassword('')
        }
        
      
    }

  return (
    <div className='flex justify-center items-center bg-[#F8FAFC] h-screen'>
      <div className='bg-white h-125 w-175 rounded-[10px] shadow-lg border border-[#E2E8F0] flex flex-col items-center justify-center'>
        <div className="flex flex-col justify-center items-center gap-1">
          <h1 className='text-[32px] font-bold text-[#0F172A] font-family-["Iosevka Charon"]'>Create an Account</h1>
          <h1 className='text-[24px] font-normal text-[#64748B] font-family-["Iosevka Charon"]'>Join Us Today</h1>
        </div>
        <div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-6 w-100'>
            <input
              type="text"
              placeholder='Enter your username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameErrorRef}
              className='bg-[#F5F5F5] rounded-md p-1 h-10 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200'
            />
            <input
              type="email"
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailErrorRef}
              className='bg-[#F5F5F5] rounded-md p-1 h-10 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200'
            />
            <input
              type="password"
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-[#F5F5F5] rounded-md p-1 h-10 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200'
            />
            <button type="submit" className="bg-blue-400 rounded-full p-1 cursor-pointer h-10 hover:scale-95 transition-transform" disabled={!(username && email && password)}>
              Register
            </button>
            {error && <p className="text-red-500 text-sm text-center animate-fadeIn">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center animate-fadeIn">{message}</p>}
          </form>
        </div>
        <div className="flex flex-col justify-center items-center gap-1 mt-4">
          <p >
            Already have an account?
          </p>
          <p>
            <span onClick={() => navigate('/login')} className="text-blue-500 cursor-pointer hover:underline transition-all duration-200"> Log In</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
