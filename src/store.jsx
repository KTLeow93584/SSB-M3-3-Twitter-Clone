import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from "redux";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import activeUserReducer from './feature/activeUser/activeUserSlice.jsx';

const reducers = combineReducers({
    activeUser: activeUserReducer
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["activeUser"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    // Ignore warnings of non-serializable data from actions, (FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER) coming
    // from "configureStore".
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export const persistor = persistStore(store);