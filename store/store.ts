import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {appReducer} from "@/store/appSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {createTransform, persistReducer, persistStore} from 'redux-persist';
import Flatted from 'flatted';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import * as localForage from "localforage";

// const transformCircular = createTransform(
//     (inboundState, key) => Flatted.stringify(inboundState),
//     (outboundState, key) => Flatted.parse(outboundState),
// )
//
// const persistConfig = {
//     key: 'root',
//     storage: localForage,
//     stateReconciler: autoMergeLevel2,
//     // transforms: [transformCircular]
// }
//
// const rootReducer = combineReducers({
//     app: appReducer,
// })

// @ts-ignore
// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {app: appReducer},
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ thunk: true, serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// export const persistor = persistStore(store);
