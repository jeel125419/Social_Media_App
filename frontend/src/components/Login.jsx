import {useState} from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function LogIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const response = await api.post('/login', {email, password})

            setMessage(response.data.message)
            setError('')

            localStorage.setItem('token', response.data.token)

            navigate('/')
            
        } catch(e) {
            setError(e.response?.data?.message || 'Login failed')
            setMessage('')
        } finally{
            setEmail('')
            setPassword('')
        }
    }

  return (
    <div>
      <h1>Log In page</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email:</label>
        <input 
            type="email"
            id='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
         />

         <label htmlFor="password">Password:</label>
         <input 
            type="password" 
            id='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
         />

         <button type="submit">Log in</button>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
      </form>
    </div>
  )
}

export default LogIn
