import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';
import cartReducer from './features/cartSlice'
const persistConfig = {
  key: 'mentora',
  storage
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
});

export type AppDispatch = typeof store.dispatch;

export default store;
