import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ProcessProvider } from './Contexts/ProcessIndicator.jsx'
import { ResumeProcessProvider } from './Contexts/ResumeProcessContext.jsx'
import { ModalProvider } from './Contexts/ModalContext.jsx'
import { AuthProvider } from './Contexts/AuthContext.jsx'
import { CustomResumeProvider } from './Contexts/CustomResumeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>
    <AuthProvider>
      <CustomResumeProvider>
      <ProcessProvider>
        <ModalProvider>
          <ResumeProcessProvider>
            
              <App />
              
          </ResumeProcessProvider>
        </ModalProvider>
      </ProcessProvider>
      </CustomResumeProvider>
    </AuthProvider>
    </BrowserRouter>
    
  </StrictMode>,
)
