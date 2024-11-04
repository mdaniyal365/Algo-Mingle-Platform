import React, { useState } from 'react'
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import authService from '../services/AuthService';
import { useDispatch } from 'react-redux';
import { disableLoading, enableLoading } from '../store/slices/loadingSlice';
import { useNavigate } from 'react-router';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email , setEmail] = useState("");
  
    const handleSubmit = async() => {
        dispatch(enableLoading());
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            toast.error("Invalid email",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
            dispatch(disableLoading());
            return;
        }
        const result = await authService.forgotPassword({email});
        if(typeof result === 'string'){
            toast.error(result,{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
        }else{
            toast.success("Password Reset link has been sent to your mail address",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            })
            navigate("/");
        }
        dispatch(disableLoading());
    }
    return (
    <div className="w-full flex justify-center bg-[url('./wal/wal1.png')]">
        <div className='w-[400px]  flex justify-center items-center m-4 border-1 bg-white rounded-lg shadow-orange-300 shadow-md '>
            <div className='w-full flex flex-col my-10 items-center'>
            <img src="./logos/logo14.png" alt="" className='h-[70px] w-[70px]' />
            <p className=' font-lumanosimo font-bold mb-4'>Forgot password..?</p>
            <Input placeholder="Enter email address" className="w-[80%] my-2" value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
            <Button value={"Reset Password"} className={"w-[80%] mt-2"}

              onClick = {(e)=>{
                handleSubmit();
              }}
            
            />
            </div>
            
            
        </div>
    </div>
  )
}

export default ForgotPassword