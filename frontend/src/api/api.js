import Axios from 'axios';
const axiosInstance=Axios.create({
    baseURL: 'http://127.0.0.1:8000/api/'
})
axiosInstance.interceptors.request.use((config)=>{
    const token =localStorage.getItem("access_token")
    if (token){
        config['headers']=`Bearer ${token}`
    }
})