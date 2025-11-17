import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const localFileContent = localStorage.getItem('markdown')

createRoot(document.getElementById('root')).render(
    <App localFileContent={localFileContent}/>
)
