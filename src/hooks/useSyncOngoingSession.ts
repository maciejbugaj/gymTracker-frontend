import { useEffect } from "react"
import { useLastOngoingSession } from "./useSessions"
import { useStore } from "../stores/StoreSession"


export function useSyncOngoingSession() {
     const { data: ongoingSession, error } = useLastOngoingSession()
     useEffect(() => {
         useStore.getState().setOngoingSession(ongoingSession ?? null)
     }, [ongoingSession, error])
 }
