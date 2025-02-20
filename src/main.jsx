import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromChildren, RouterProvider,Route } from 'react-router-dom'
import HeroSection from './components/HomePageComponents/HeroSection.jsx'
import Login from './components/login/Login.jsx'
import Registration from './components/registeration/Registeration.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import MyBudgetList from './components/Budget/MyBudgetList.jsx'
import ExpenseLists from './components/Expenses/ExpenseLists.jsx'
import IncomeLists from './components/Income/IncomeLists.jsx'

const router=createBrowserRouter(createRoutesFromChildren(
  <Route path='/' element={<App/>}>
     <Route path='/home' element={<HeroSection/>}/>
     <Route path='/login' element={<Login/>}/>
     <Route path='/registeration' element={<Registration/>}/>
     <Route path='/dashboard' element={<Dashboard/>}/>
     <Route path='/my-budget-list' element={<MyBudgetList/>}/>
     <Route path='/my-expense-list' element={<ExpenseLists/>}/>
     <Route path='/my-income-list' element={<IncomeLists/>}/>
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
