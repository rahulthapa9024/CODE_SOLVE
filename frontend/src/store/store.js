import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage by default
import authReducer from '../../slices/userSlice'; // adjust path if needed

// ✅ Persist config for AUTH slice
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user', 'email', 'status'], 
  // whitelist only the fields you want to persist
};

// ✅ Wrap the auth reducer with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// ✅ Configure Store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// ✅ Create the persistor
export const persistor = persistStore(store);
