import axios from "../utils/axios"

export class InterviewService {
    constructor(){

    }
    async checkInterviewId(id){
        try {
            const result = await axios.get(`checkInterviewId?roomId=${id}`);
            if(result){
                return true
            }else{
                return "";
            }
        } catch (error) {
            return "";
        }
    }

    async createInterviewSession(token){
        try {
            const result = await axios.get("createinterviewroom",{
                headers: {
                    Authorization : `Bearer ${token}`
                }
            });

            console.log("Result from Server " , result);
            return result.data;
        } catch (error) {
            if(error.response.status === 400){
                return "Invalid Interview Id"
            }else if(error.response.status === 401){
                return "Unauthorized: Access Restricted"
            }
            else{
                return "Something went wrong"
            }
            console.log(error);
        }
    }
}
const interviewService = new InterviewService();
export default interviewService;