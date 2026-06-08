import {useState} from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigation = useNavigate()
  const token = localStorage.getItem('token')
  return (
    <div className='flex justify-center items-center bg-[#F8FAFC] h-screen'>
        {
          token && <button onClick={()=> {
            localStorage.removeItem('token')
            localStorage.removeItem('username')
            navigation('/')
          }} className="bg-red-600 cursor-pointer hover:scale-125 transition-transform rounded-md p-2 hover:bg-red-700">Log Out</button>
        }
    </div>
  )
}

export default Dashboard
