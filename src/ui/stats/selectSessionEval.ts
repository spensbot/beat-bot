import { AppState } from "@/engine/AppState"
import { evaluateSession } from "@/engine/loop/SessionEval"
import { createSelector } from "@reduxjs/toolkit"

export const selectSessionEval = createSelector(
  [
    (a: AppState) => a.activeSession,
    (a: AppState) => a.loop,
    (a: AppState) => a.time.tempo,
  ],
  (session, loop, tempo) => {
    if (!session) return undefined
    return evaluateSession(session, loop, tempo)
  }
)
