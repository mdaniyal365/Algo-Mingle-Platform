import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { CheckmarkIcon } from "react-hot-toast";
import CrossIcon from "../components/CrossIcon";
import zod from "zod";
import { useDispatch } from "react-redux";
import { disableLoading, enableLoading } from "../store/slices/loadingSlice";
import authService from "../services/AuthService";
import {toast} from "react-hot-toast"
import { login } from "../store/slices/user";
import { useNavigate } from "react-router";

const Register = () => {
  const emailSchema = zod.string().email();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPasswordLength, setValidPasswordLength] = useState(false);
  const [charsValid, setCharsValid] = useState(false);
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setValidEmail(true);
      console.log(email);
    } else {
      setValidEmail(false);
      console.log(email + " Not");
    }
    if (password.length >= 8) {
      setValidPasswordLength(true);
    } else {
      setValidPasswordLength(false);
    }
    if (isStrongPassword(password)) {
      setCharsValid(true);
    } else {
      setCharsValid(false);
    }
  }, [email, password, name]);



  const handleRegister = async () => {
    dispatch(enableLoading());
    try {
        
        const res = await authService.signUp({email , password , name});
        if(typeof res !== 'string'){

            toast.success("Congrats ! You are registered successfully" , {
              style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
              },
            });
            
            localStorage.setItem("user" , JSON.stringify(res));
            dispatch(login(res));
            navigate("/");
            
        }else{
            toast.error(res,{
              style: {
                  borderRadius: '10px',
                  background: '#563F15',
                  color: '#FFCE6D',
              },
            });
        }

        
    } catch (error) {
        toast.error("Something went wrong",{
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
      <div className="w-[400px]  flex justify-center items-center m-4 border-1 bg-white rounded-lg shadow-orange-300 shadow-md ">
        <div className="w-full flex flex-col my-10 items-center">
          <img src="./logos/logo14.png" alt="" className="h-[70px] w-[70px]" />
          <p className=" font-lumanosimo font-bold mb-4">Register with us...</p>
          <Input
            placeholder="Enter your Full Name"
            className="w-[80%] my-2"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Input
            placeholder="Enter email address"
            className="w-[80%] my-2"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <Input
            placeholder="Enter your password"
            type="password"
            value={password}
            className="w-[80%] mt-2"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {
            (email.length > 0 || password.length > 0 ||  name.length > 0) && (
                <div className="my-2  transition-all duration-500">
            <div className="flex my-1">
              
              {validEmail ? <CheckmarkIcon /> : <CrossIcon />}
              <p className="text-sm ml-2">Valid email Address</p>
            </div>
            <div className="flex my-1">
            {validPasswordLength ? <CheckmarkIcon /> : <CrossIcon />}
              <p className="text-sm ml-2">Password atleast 8 chars</p>
            </div>
            <div className="flex my-1">
            {charsValid ? <CheckmarkIcon /> : <CrossIcon />}
              <p className="text-sm ml-2">Numbers and Special Chars included</p>
            </div>
          </div>
            )
          }
          

          <Button value={"Register"} className={"w-[80%] mt-4"}
            onClick={(e)=>{
                handleRegister();
            }}
          />
          <p className="w-[80%] text-sm text-right">
            Already a user ?{" "}
            <span className="text-[#1e1e1e] font-semibold hover:text-[#A53F1F] cursor-pointer"
            onClick={(e)=>{
              navigate("/login");
            }}>
              Login Now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};


function isStrongPassword(password) {
  const digitRegex = /\d/;
  const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;

  const hasDigit = digitRegex.test(password);
  const hasSpecialChar = specialCharRegex.test(password);

  return hasDigit && hasSpecialChar;
}

export default Register;
