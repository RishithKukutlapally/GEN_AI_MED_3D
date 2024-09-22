import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import {ToastContainer} from 'react-toastify';

function Home(){
    const [loggedInuser, setLoggedInuser] = useState('');
    const navigate =useNavigate();
    useEffect(()=>{
        setLoggedInuser(localStorage.getItem('loggedInUser'))
    },[])

    const handleLogout=(e)=>{
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(()=>{
            navigate('/login');
        })
    }
    return(
        <div>
            <h1>Welcome{loggedInuser}</h1>
            <h1>Hi</h1>
            <button onClick={handleLogout}>Logout</button>

            <ToastContainer/>
        </div>
    )
}

export default Home