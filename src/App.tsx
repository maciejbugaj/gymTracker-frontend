import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Session from './pages/Session'
import NavBarMobile from './components/NavBarMobile'

export default function App() {
  return (
    <div>
      <NavBarMobile />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session" element={<Session />} />
      </Routes>
    </div>
  )
}