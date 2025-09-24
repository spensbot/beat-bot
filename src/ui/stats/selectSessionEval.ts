import { AppState } from "@/engine/AppState"
import { evaluateSession } from "@/engine/session/SessionEval"
import { createSelector } from "@reduxjs/toolkit"

export const selectSessionEval = createSelector(
  [
    (a: AppState) => a.activeSession,
    (a: AppState) => a.loop,
    (a: AppState) => a.time.tempo,
  ],
  (session, loop, tempo) => {
    if (!session) return undefined
    return evaluateSession(session, loop.data, tempo)
  }
)
