import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromChildren, RouterProvider,Route } from 'react-router-dom'
import HeroSection from './components/HomePageComponents/HeroSection.jsx'
import Login from './components/login/Login.jsx'
import Registration from './components/registeration/Registeration.jsx'

const router=createBrowserRouter(createRoutesFromChildren(
  <Route path='/' element={<App/>}>
     <Route path='/home' element={<HeroSection/>}/>
     <Route path='/login' element={<Login/>}/>
     <Route path='/registeration' element={<Registration/>}/>
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
