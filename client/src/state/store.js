import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';


export const store = configureStore({
  reducer: userReducer,
  devTools: process.env.NODE_ENV !== 'production',
})