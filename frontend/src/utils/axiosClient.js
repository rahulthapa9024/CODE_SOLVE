import axios from "axios"

const axiosClient = axios.create({
    baseURL:"https://leetcode-backend-1tm4.onrender.com"|| 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosClient;