import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

//global states
export type RootState = ReturnType<typeof store.getState>;
//actions on the store
export type AppDispatch = typeof store.dispatch;