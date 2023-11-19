import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  PreloadedState,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import { telegramApi } from "@/api/telegram";

export type RootState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export const reducer = combineReducers({
  [telegramApi.reducerPath]: telegramApi.reducer,
});

function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer,
    preloadedState,
    devTools: process.env.NODE_ENV === "production" ? false : true,
    middleware: (middleware) => middleware().concat(telegramApi.middleware),
  });
}

export const store = setupStore();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
