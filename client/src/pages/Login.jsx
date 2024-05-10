import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import axios from "axios"

export function Login() {

    // AUTH FUNCTIONS ------------------------------------------------------------------------------------------------------------------
    
    const navigate = useNavigate();

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        const user = Cookies.get("username");
        if(user) {
            console.log("should move to homepage");
            navigate('/homepage')
        }
    }, [])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function HandleLogIn(e) {
        e.preventDefault()

        // SETS COOKIE AND CONTEXT
        Cookies.set("username", username, { expires: 7 });

        // axios.post('http://localhost:5000/users/', {username: username, password: password})

        navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES

    }

    return <>
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button id="login-button" className="btn" onClick={(e) => {HandleLogIn(e)}}>Login!</button>
    </>
   }
