import { configureStore } from "@reduxjs/toolkit";
import { gigAPI } from "./gig/gigAPI";
import gigSlice from "./gig/gigSlice";
import authSlice from "./auth/authSlice"
import { authAPI } from "./auth/authAPI";
import { blockApi } from "./blockchain/blockApi";

export const store = configureStore ({
    reducer: {
        auth: authSlice,
        gig: gigSlice,
        [gigAPI.reducerPath]: gigAPI.reducer,
        [authAPI.reducerPath]: authAPI.reducer,
        [blockApi.reducerPath]: blockApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(gigAPI.middleware, authAPI.middleware, blockApi.middleware);
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;