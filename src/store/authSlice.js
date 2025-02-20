import { createSlice } from "@reduxjs/toolkit";


const initialState={
    isAuthenticated: false,
    userData:null
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
      login:(state,action)=>{
        console.log("dispatch to store");
        state.isAuthenticated=true;
        state.userData=action.payload.userData;
      },
      logout:(state)=>{
        state.isAuthenticated=false;
        state.userData=null;
      }
    }
})

export const {login,logout}=authSlice.actions;
export default authSlice.reducer;
