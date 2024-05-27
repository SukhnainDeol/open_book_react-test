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

            axios.get('http://localhost:5000/encrypt',{ params: {password: password }}).then(
            response => {

                axios.post('http://localhost:5000/users/', {username: username, password: response.data}).then( response => { // MAKES PASSWORD THE NEW ENCRYPTED PASSWORD
                Cookies.set("username", username, { sameSite:'strict' });
                navigate('/homepage'); // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES
                }).catch(error => {
                console.log(error.message)
                console.log(error.response.data)
                })


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
            <p id="terms">By Creating an Account, You Agree To Our <Link to="#" onClick={() => { document.querySelector("#terms-conditions").style.display="block"; document.querySelector("#terms-conditions").scrollTop = 0}}>Terms & Conditions</Link>.</p>
            <button className="btn">Sign Up</button>
            </form>
            <div id="terms-conditions">
                <h2>Terms & Conditions</h2><br/>
                <p>Ahoy! Currently, there be no "Terms & Conditions" for this vessel. This be a final project for Whatcom Community College's SD299 Capstone course. If ye lay anchor upon this site, be sure to follow <strong>"The Pirate's Code"</strong>.</p><br/>
                <h3>The Pirate's Code:</h3><br/>
                <em>
                <p><strong>Rule #1 of "The Pirate's Code":</strong> Never Make Another Pirate Cry.</p>
                <p><strong>Rule #2 of "The Pirate's Code":</strong> No Naughty Words.</p>
                <p><strong>Rule #3 of "The Pirate's Code":</strong> Bedtime at 8 O'Clock.</p>
                <p><strong>Rule #4 of "The Pirate's Code":</strong> Never Talk to Strangers.</p>
                <p><strong>Rule #5 of "The Pirate's Code":</strong> Sharing is Caring.</p>
                <p><strong>Rule #6 of "The Pirate's Code":</strong> Always Remember to Have Fun!</p>
                </em><br/>
                <p>Now Sign Up and Join Our Crew!</p><br/>
                <p><em>PS: Our site uses two cookies to handle light/dark theme and user context that are created when you sign up/log in, and subsequently removes the context cookie when logging out and theme cookie after 7 days (so by signing up/loging in you agree to the use of these cookies).</em></p><br/>
                <button className="btn" onClick={() => { document.querySelector("#terms-conditions").style.display="none"; document.querySelector("#terms-conditions").scrollTop = 0}}>Close Terms & Conditions</button>
            </div>
    </>
   }