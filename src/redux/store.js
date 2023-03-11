import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { loginReducer } from "./reducers/login.reducer";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["loginReducer"],
};

const combinedReducers = combineReducers({ loginReducer });

const persistedReducer = persistReducer(persistConfig, combinedReducers);

let store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
let persistor = persistStore(store);

export { store, persistor };
