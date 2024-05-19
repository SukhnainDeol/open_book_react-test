import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Cookies from 'js-cookie'
import axios from "axios"

export function SignUp() {

    // AUTH FUNCTIONS ------------------------------------------------------------------------------------------------------------------
    
    const navigate = useNavigate();
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true
            const user = Cookies.get("username");
            if(user) {
             navigate('/homepage')
            }
    }}, [])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [conPassword, setConPassword] = useState("")

    function HandleSignIn(e) {
        e.preventDefault()

        if(username === "" || password === "" || conPassword === "") { // CHECKS TO SEE IF USERS PUT IN A USERNAME/PASSWORD/CONFIRM PASSWORD
            document.querySelector(".ls-warning").innerText = "Please Fill Out the Sign Up Form";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        } else if(password !== conPassword) { // MAKES SURE PASSWORDS MATCH
            document.querySelector(".ls-warning").innerText = "Password & Confirm Password Don't Match";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        } else if(username.length < 5 || password.length < 5) { // MAKES SURE USERNAME AND PASSWORD ARE THE SAME LENGTH
            document.querySelector(".ls-warning").innerText = "Username & Password Must Each Be Atleast 5 Characters";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        }

        axios.get('http://localhost:5000/users/username', { 
            params: {
                username: username,
            } 
        } ).then( // CHECKS IF USER ALREADY EXISTS IN THE DATABASE
            response => {
                    if(response.data[0].username === username) { // IF PASSWORDS MATCH
                        document.querySelector(".ls-warning").innerText = "That Username is Already Taken";
                        document.querySelector(".ls-warning").style.color = "lightcoral";
                        return;
                    }
            }
        ).catch(error => { // ATTEMPTS TO ADD USER TO THE DATABASE

            // ENCRYPTION FUNCTION GOES HERE
            
            axios.post('http://localhost:5000/users/', {username: username, password: password}).then( response => {
                Cookies.set("username", username, { expires: 7 });
                navigate('/homepage'); // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES
            }).catch(error => {
                console.log(error.message)
                console.log(error.response.data)
            })
        })
    }

    return <>
        <h3 className="sign-log">Sign Up or <Link to="/login">Log In</Link></h3>
        <form className="ls-form" onSubmit={(e) => {HandleSignIn(e)}}>
            <label>Create Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} maxLength={10} />
            <label>Create Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} />
            <label>Confirm Password</label>
            <input type="password" value={conPassword} onChange={e => setConPassword(e.target.value)} maxLength={15} />
            <p className="ls-warning">Sample Warning Message</p>
            <p id="terms">By Creating an Account, You Agree To Our <Link to="#" onClick={() => alert("Currently There Are No Terms & Conditions")}>Terms & Conditions</Link>.</p>
            <button className="btn">Sign Up</button>
            </form>
    </>
   }
