import axios from "axios"
const api = axios.create({
    baseURL : "https://aws.hayatsoftwares.com/api/v1"
})
export default api;
