import {configureStore} from "@reduxjs/toolkit"
import loadingSlice from "./slices/loadingSlice";
import user from "./slices/user";
const store = configureStore({
    reducer:{
        loading: loadingSlice,
        user : user
    }
})
export default store;