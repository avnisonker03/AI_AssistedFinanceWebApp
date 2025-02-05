import React from 'react'
import Navbar from './components/HomePageComponents/Navbar'
import Footer from './components/HomePageComponents/Footer'
import HeroSection from './components/HomePageComponents/HeroSection'
import Login from './components/login/Login'
import Registration from './components/registeration/Registeration'
import { Outlet } from 'react-router-dom'


export default function App() {
  return (
    <div className='bg-blue-200'>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </div>
  )
}
