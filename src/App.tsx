import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Session from './pages/Session'
import NavBarMobile from './components/NavBarMobile'
import Templates from './pages/Templates'
import EditTemplate from './pages/EditTemplate'
import History from './pages/History'
import AiPlanGenerator from './pages/AiPlanGenerator'
import AiPlanPreview from './pages/AiPlanPreview'
import Programs from './pages/Programs'
import ProgramDetail from './pages/ProgramDetail'
import { useEffect } from 'react'
import { useAuth } from 'react-oidc-context'
import { useSyncAuthState } from './hooks/useSyncAuthState'

export default function App() {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth()
  useSyncAuthState()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      signinRedirect()
    }
  }, [isLoading, isAuthenticated, signinRedirect])

  if (isLoading || !isAuthenticated) {
    return <div className="flex h-screen items-center justify-center text-[13px] text-steel">Signing you in…</div>
  }
  return (
    <div>
      <NavBarMobile />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session" element={<Session />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id/edit" element={<EditTemplate />} />
        <Route path="/history" element={<History />} />
        <Route path="/ai-plan" element={<AiPlanGenerator />} />
        <Route path="/ai-plans/:generationId" element={<AiPlanPreview />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<ProgramDetail />} />
      </Routes>
    </div>
  )
}