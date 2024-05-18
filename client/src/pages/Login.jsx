import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import Cookies from 'js-cookie'
import axios from "axios"

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
            setPassword("");
            return;
        }

        axios.get('http://localhost:5000/users/username', { 
            params: {
                username: username,
            } 
        } ).then(
            response => {
                    if(response.data[0].password === password) { // IF PASSWORDS MATCH
                        // SETS COOKIE AND CONTEXT
                        Cookies.set("username", username, { expires: 7 });
                        navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES
                    } else {
                        document.querySelector(".ls-warning").innerText = "Username & Password Do Not Match";
                        document.querySelector(".ls-warning").style.color = "lightcoral";
                        setPassword("");
                        return;
                    }
            }
        ).catch(error => {
            console.log(error);
            document.querySelector(".ls-warning").innerText = "Username Does Not Exist";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            setPassword("");
            return;
        })
    }

    return <>
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
