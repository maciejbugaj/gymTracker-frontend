import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Session from './pages/Session'
import NavBarMobile from './components/NavBarMobile'
import Templates from './pages/Templates'
import EditTemplate from './pages/EditTemplate'
import History from './pages/History'

export default function App() {
  return (
    <div>
      <NavBarMobile />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session" element={<Session />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id/edit" element={<EditTemplate />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  )
}