import { useSelector } from "react-redux";
import axios from "../utils/axios";
export class AuthService{
    constructor(){

    }

    async forgotPassword({email}){
        try {
            
            const res = await axios.post("forgotpassword" , {email});
            return res.data;
        } catch (error) {
            if(error.response.status === 400){
                return "You are not registered with us"
            }else{
                return "Something is wrong, try again"
            }
        }
    }
    async resetPassword({password , token}){
        try {
            const res = await axios.post(`reset/password/${token}`,{
                password
            });
        } catch (error) {
            
        }
    }
    async checkForgotToken(token){
        try {
            const res = await axios.get(`reset/check/${token}`);
            if(res) return true;
        } catch (error) {
            return false;
        }
        return false;
    }

    async signUp({email , password , name}){
        try {
            const data = {
                email,
                password , 
                name
            }
            const result = await axios.post("signup" , data )
            
            return result.data;
        } catch (error) {
            if(error.response.status === 409){
                return "Email already in use"
            }
            console.log(error);
            return "Something is wrong, try after some time"
            

        }
    }
    async login({email , password}){
        try {
            const data = {
                email,
                password
            }
            const result = await axios.post("signin" , data);
            if(result){
                return result.data;
            }
            return false;
        } catch (error) {
            
            if(error.response.status){
                if(error.response.status === 400){
                    return "You are not registered with us"
                }else if(error.response.status === 401){
                    return "Incorrect Password"
                }
            }
            return "Something is wrong. Try after sometime"
        }
    }
    async getCurrentUser(token){
        try {
            if(token !== undefined && token !== null && token !== false){
            const result = await axios.get("getCurrentUser" , {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })
            console.log(result.data);
            if(result){
                return result.data;
            }
            return false;
        }else return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

}
const authService = new AuthService();
export default authService;