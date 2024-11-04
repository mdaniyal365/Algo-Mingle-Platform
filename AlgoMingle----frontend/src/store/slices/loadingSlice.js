import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    isLoading : false
}
const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers : {
        disableLoading : (state , action) => {
            state.isLoading = false
        },
        enableLoading : (state , action) => {
            state.isLoading = true
        }
    }
})
export const {enableLoading , disableLoading} = loadingSlice.actions;
export default loadingSlice.reducer;