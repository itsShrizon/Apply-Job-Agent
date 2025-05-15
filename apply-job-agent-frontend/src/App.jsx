import { useState } from 'react'
import './App.css'

import {Routes, Route } from 'react-router-dom'
import ResumeProcessPage from './pages/ResumeProcessPage/ResumeProcessPage'
import Layout from './pages/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>

        <Route path="/" element={<Layout/>}>
          <Route index element={<ResumeProcessPage/>}/>
        </Route>

      </Routes>
      
    </>
  )
}

export default App
