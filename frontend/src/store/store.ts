import { configureStore } from "@reduxjs/toolkit"

import { userReducer } from "./UserSlice/UserSlice";
import { adminReducer } from "./AdminDataSlice/AdminDataSlice";
const store = configureStore({
    reducer: { userState: userReducer, AdminDataState: adminReducer }
});


export default store;
export type AppDispatch = typeof store.dispatch;