import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import { ToggleTheme } from "./ToggleTheme";

export function SignUp() {

    // AUTH FUNCTIONS ------------------------------------------------------------------------------------------------------------------
    
    const navigate = useNavigate();

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        const user = Cookies.get("username");
        if(user) {
            navigate('/homepage')
        }
    }, [])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [conPassword, setConPassword] = useState("")

    function HandleSignIn(e) {
        e.preventDefault()

        // SETS COOKIE AND CONTEXT
        Cookies.set("username", username, { expires: 7 });

        // axios.post('http://localhost:5000/users/', {username: username, password: password})

        navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES

    }

    return <>
        <nav>
            <ul className="nav-list">
                <li><ToggleTheme /></li>
            </ul>
        </nav>
        <h3 className="sign-log">Sign Up or <Link to="/login">Log In</Link></h3>
        <label>Create Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        <label>Create Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <label>Confirm Password</label>
        <input type="password" value={conPassword} onChange={e => setConPassword(e.target.value)}/>
        <p className="ls-warning">Sample Warning Message</p>
            <label id="terms-label">By Checking This Box You Agree To Our <Link to="#">Terms & Conditions</Link> <input type="checkbox" id="terms"/></label>
        <button className="btn" onClick={(e) => {HandleSignIn(e)}}>Sign Up</button>
    </>
   }
