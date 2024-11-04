import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router';
import { disableLoading, enableLoading } from '../store/slices/loadingSlice';
import { signout } from '../store/slices/user';
const Signout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(enableLoading());
        dispatch(signout());
        localStorage.setItem("user",null);
        navigate("/");
        dispatch(disableLoading());
    },[])
  return (
    <>
    </>
  )
}

export default Signout