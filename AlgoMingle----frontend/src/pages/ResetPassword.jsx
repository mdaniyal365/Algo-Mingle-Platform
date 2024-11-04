import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import authService from '../services/AuthService';
import toast, { CheckmarkIcon } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { disableLoading, enableLoading } from '../store/slices/loadingSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import CrossIcon from '../components/CrossIcon';

const ResetPassword = () => {
    const dispatch = useDispatch();
    const {forgotToken}  = useParams();
    const [password , setPassword] = useState("");
    const [charsIncluded, setCharsIncluded] = useState(false);
    const [secondPassword , setSecondPassword] = useState("");
    const navigate = useNavigate();


    useEffect(()=>{

        if(isStrongPassword){
            setCharsIncluded(true);
        }else{
            setCharsIncluded(false);
        }
    },[password])


    useEffect(()=>{
        validateForgotToken();
        
        return () => {
            validateForgotToken;
        }
    },[forgotToken])

    const validateForgotToken = async () => {
        dispatch(enableLoading());
        const result = await authService.checkForgotToken(forgotToken);
        if(!result){
            toast.error("Reset Link is invalid",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
            navigate("/");
        }
        dispatch(disableLoading());
        
    }

    const handleSubmit = async () => {
        dispatch(enableLoading());
        if(password !== secondPassword){
            toast.error("Password Mismatch",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
            return;
        }
        if(!charsIncluded){
            toast.error("Password should contain Numbers and Characters",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            })
            return;
        }
        if(password.length < 8){
            toast.error("Password length should be atleast 8 ",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
            return;
        }
        try {
            const res = authService.resetPassword({token:forgotToken,password});
            toast.success("Password changed successfully",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
            navigate("/login");
        } catch (error) {
            toast.error("Something went wrong ! Retry after sometime",{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            })
        }
        dispatch(disableLoading());


    }

  return (
    <div className="w-full flex justify-center bg-[url('./wal/wal1.png')]">
        <div className='w-[400px]  flex justify-center items-center m-4 border-1 bg-white rounded-lg shadow-orange-300 shadow-md '>
            <div className='w-full flex flex-col my-10 items-center'>
            <img src="/logos/logo14.png" alt="" className='h-[70px] w-[70px]' />
            <p className=' font-lumanosimo font-bold mb-4'>Reset Password</p>
            <Input placeholder="Enter new Password" type="password" className="w-[80%] my-2" value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <Input placeholder="Re-Enter the Password" type="password" className="w-[80%] mt-2"
              value={secondPassword}
              onChange={(e)=> setSecondPassword(e.target.value)}
            
            />
            {
            (password.length > 0) && (
                <div className="my-2  transition-all duration-500">
            
            <div className="flex my-1">
            {password.length >=8 ? <CheckmarkIcon /> : <CrossIcon />}
              <p className="text-sm ml-2">Password atleast 8 chars</p>
            </div>
            <div className="flex my-1">
            {charsIncluded ? <CheckmarkIcon /> : <CrossIcon />}
              <p className="text-sm ml-2">Numbers and Special Chars included</p>
            </div>
            <div className="flex my-1">
            {password === secondPassword ? <CheckmarkIcon /> : <CrossIcon />}
              <p className="text-sm ml-2">Both password should be identical</p>
            </div>
          </div>
            )
          }
            <Button value={"Change Password"} className={"w-[80%] mt-2"}

              onClick = {(e)=>{
                handleSubmit();
              }}
            
            />
            </div>
            
        </div>
    </div>
  )
}
function isStrongPassword(password) {
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
  
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
  
    return hasDigit && hasSpecialChar;
  }
export default ResetPassword