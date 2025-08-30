import Axios from 'axios';
import { useState } from 'react';

export default function Login(){
    const[username, setUserName]=useState('');
    const[password, setPassword]=useState('');
    const url='http://127.0.0.1:8000/api/auth/login/'
  
    const handleSubmit=(e)=>{
        e.preventDefault();
        
        const credentials={'username': username, 'password':password}
        Axios.post(url, credentials)
        .then((res)=>{
            localStorage.setItem("access_token", res.data.access);
            localStorage.setItem("refresh_token", res.data.refresh);

            alert("logged in Successfully")
            window.location.reload();
        })
        .catch((err)=>{console.error(err.response?.data);
    alert(err.response?.data?.detail || "Login failed");})
    }
    
    return (
        <div className="shadow-lg border border-warning rounded-3 p-3 mx-auto my-5" style={{ maxWidth: "23%", minHeight: "60%" }}>
        <h1 className="text-center mb-5" style={{fontFamily:"Verdana"}}>Sign In</h1>
        

        <div className="container">
            <div>
                <form method="POST" onSubmit={handleSubmit}>
                    
                    <input className="form-control mb-4" name="username"  onChange={(e) => setUserName(e.target.value)} value={username} type="text" placeholder="Username" />
                    <input className="form-control mb-4" name="password" onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" />
                    <div className="">
                        <a href="#" className="nav-link align-middle">Forgot password</a>
                        <button className="btn btn-success float-end" type="submit">Sign In</button>
                    </div>
                </form>
            </div>
            <div className="my-2">
                <center>Don't have an account? 
                    <a href="/register" className="text-decoration-none fw-bold">Register</a>
                </center>
            </div>
        </div>
    </div>
    );
};