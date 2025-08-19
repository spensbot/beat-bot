import { configureStore } from '@reduxjs/toolkit'
import appReducer from './appSlice'
import { SaveManager } from '@/utils/persistence/SaveManager'
import { PersistedAppStateSchema, initialState } from '@/engine/AppState'

const saveManager = new SaveManager({
  debounce_s: 3,
  maxWait_s: 20
}, {
  'PersistedAppState': PersistedAppStateSchema
})

const loadedStateResult = saveManager.load('PersistedAppState')
const loadedState = loadedStateResult.isOk() ? loadedStateResult.value : null

export const store = configureStore({
  reducer: {
    app: appReducer
  },
  preloadedState: {
    app: loadedState ? { ...initialState, ...loadedState } : initialState
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

store.subscribe(() => {
  const persistedState = {
    ...store.getState().app,
    activeSession: undefined // Don't persist the active session
  }

  saveManager.stateUpdated('PersistedAppState', persistedState)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch