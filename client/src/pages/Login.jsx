import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import { ToggleTheme } from "./ToggleTheme";

export function Login() {

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

    function HandleLogIn(e) {
        e.preventDefault()

        if(username === "" || password === "") { // CHECKS TO SEE IF USERS PUT IN A USERNAME & PASSWORD
            document.querySelector(".ls-warning").innerText = "Please Provide a Username & Password";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        }

        axios.get('http://localhost:5000/users/', {username: username, password: password}).then(

        )

        // SETS COOKIE AND CONTEXT
        Cookies.set("username", username, { expires: 7 });
        navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES
    }

    return <>
        <nav>
            <ul className="nav-list">
                <li><ToggleTheme /></li>
                <li><Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>Snoop</Link></li>
            </ul>
        </nav>
        <h3 className="sign-log"><Link to="/">Sign Up</Link> or Log In</h3>
        <form className="ls-form" onSubmit={HandleLogIn}>
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
            <p className="ls-warning">Sample Warning Message</p>
            <button className="btn">Login</button>
        </form>
    </>
   }
