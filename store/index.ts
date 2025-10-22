'use client'
import { configureStore } from '@reduxjs/toolkit'
import { supabaseApi } from './api'

export const store = configureStore({
  reducer: {
    [supabaseApi.reducerPath]: supabaseApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(supabaseApi.middleware),
})

// Optional helpful types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
