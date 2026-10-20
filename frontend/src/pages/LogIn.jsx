import { useState, useRef } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const changeRef = useRef()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both email and password.')
      setMessage('')
      return
    }


    try {

      setLoading(true)
      setError('')

      const response = await api.post('/login', { email, password })

      setMessage(response.data.message)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('username', response.data.username)



      navigate('/')

    } catch (e) {
      setError(e.response?.data?.message || 'Login failed')
      setMessage('')
    } finally {
      setEmail('')
      setPassword('')
      setLoading(false)
    }
  }

  return (

    <div className="auth-page bg-[#F8FAFC] flex items-center justify-center min-h-screen px-3 py-20 sm:py-8">
      <div className="bg-white min-h-[31rem] w-full max-w-2xl px-4 sm:px-8 py-8 flex flex-col items-center justify-center rounded-[10px] shadow-lg border border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#0F172A] font-family-['Iosevka Charon']">Welcome Back</h1>
          <h1 className="text-lg sm:text-[24px] font-normal text-[#64748B] font-family-['Iosevka Charon']">Sign in to Continue</h1>
        </div>
        <div >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-sm px-1">
            <input
              type="text"
              placeholder='Enter your email'
              value={email}
              className='bg-[#F5F5F5] rounded-md p-2 h-10 w-full sm:w-96 max-w-full outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200'
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  changeRef.current.focus()
                }
              }}
            />
            <input
              type="password"
              ref={changeRef}
              placeholder='Enter your password'
              className='bg-[#F5F5F5] rounded-md p-2 h-10 w-full sm:w-96 max-w-full outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {loading ? 'Logging in...' : <button className="bg-blue-400 rounded-full p-1 cursor-pointer h-10 w-full sm:w-96 max-w-full hover:scale-95 transition-transform" type="submit" disabled={loading}>
              Log in
            </button>}
            {error && <p className="text-red-500 text-sm text-center animate-fadeIn">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center animate-fadeIn">{message}</p>}
          </form>
        </div>
        <div className="flex flex-col justify-center items-center gap-1 mt-4">
          <p className="text-black">
            Don't have an account?
          </p>
          <p>
            <span onClick={() => navigate('/register')} className="text-blue-500 cursor-pointer hover:underline"> Sign Up</span>
          </p>
        </div>
      </div>
    </div>

  )
}

export default LogIn
