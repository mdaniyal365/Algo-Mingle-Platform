import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { disableLoading, enableLoading } from '../store/slices/loadingSlice'
import authService from '../services/AuthService'
import { login } from '../store/slices/user'
import { useNavigate } from 'react-router'


const Signin = () => {
  const isLoggedIn = useSelector(state => state.user.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");

  if(isLoggedIn){
    
    navigate("/");
  }

  const handleLoginSubmit = async () => {
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      toast.error("Invalid Email Address",{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
      return;
    }
    if(password.length < 8){
      toast.error("Password should not be less than 8 characters",{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
      return;
    }

    dispatch(enableLoading());
    try {
      
      const result = await authService.login({email , password});
      if(typeof result === 'string'){
        toast.error(result)
      }else{
        toast.success("Congrats ! You are logged in",{
          style: {
              borderRadius: '10px',
              background: '#563F15',
              color: '#FFCE6D',
          },
        });
        const impData = {
          token : result.token,
          user : result.user
        }
        localStorage.setItem("user" , JSON.stringify(impData));
        dispatch(login(impData));
        navigate("/");

        console.log(result);
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid Credentails",{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      })
    }finally{
      dispatch(disableLoading());
    }


  }

  return (
    <div className="w-full flex justify-center bg-[url('/wal/wal1.png')]">
        <div className='w-[400px]  flex justify-center items-center m-4 border-1 bg-white rounded-lg shadow-orange-300 shadow-md '>
            <div className='w-full flex flex-col my-10 items-center'>
            <img src="./logos/logo14.png" alt="" className='h-[70px] w-[70px]' />
            <p className=' font-lumanosimo font-bold mb-4'>Login to continue...</p>
            <Input placeholder="Enter email address" className="w-[80%] my-2" value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
            <Input placeholder="Enter your password" type="password" className="w-[80%] mt-2"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            
            />
            <p 
            onClick={(e)=>{
              navigate("/forgotpassword");
            }}

            className='w-[80%]  text-right text-sm cursor-pointer text-[#1e1e1e] hover:text-[#A53F1F]'>Forgot Password ?</p>
            <Button value={"Login"} className={"w-[80%] mt-2"}

              onClick = {(e)=>{
                handleLoginSubmit();
              }}
            
            />
            <p className='w-[80%] text-sm text-right'>New to AlgoMingle ? <span className=' font-semibold text-[#1e1e1e]   hover:text-[#A53F1F] cursor-pointer'
            onClick={(e)=>{
              navigate("/register")
            }}>Register Now</span></p>
            </div>
            
        </div>
    </div>
  )
}

export default Signin