import {Routes, Route } from 'react-router-dom'
import ResumeProcessPage from './pages/ResumeProcessPage/ResumeProcessPage'
import Layout from './pages/Layout'
import ProfilePage from './pages/ProfilePage/ProfilePage'

function App() {

  return (
    <>
      <Routes>

        <Route path="/" element={<Layout/>}>
          <Route index element={<ResumeProcessPage/>}/>
          <Route path="profile" element={<ProfilePage/>}/>
        </Route>

      </Routes>
      
    </>
  )
}

export default App
