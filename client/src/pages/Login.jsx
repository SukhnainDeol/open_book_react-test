import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import moment from "moment";

export function Login() {
    
    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START
    const [username, setUsername] = useState(""); // HOLDS USERNAME VALUE OF USERNAME INPUT
    const [password, setPassword] = useState(""); // HOLDS PASSWORD VALUE OF PASSWORD INPUT

    useEffect(() => { // PREVENTS USER FROM GOING BACK TO LOGGIN PAGE IF ALREADY LOGGED IN
        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true
            const user = Cookies.get("username");
            if(user) { // IF COOKIE EXISTS, USER MUST BE LOGGED IN SO GO TO HOMEPAGE
             navigate('/homepage');
            }
    }}, [])

    function HandleLogIn(e) {
        e.preventDefault()

        if(username === "" || password === "") { // CHECKS TO SEE IF USERS PUT IN A USERNAME & PASSWORD
            document.querySelector(".ls-warning").innerText = "Please Provide a Username & Password";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            setPassword("");
            return;
        }
        // AXIOS CALL TO SEE IF USERNAME IS IN OUR DATABASE
        axios.get('https://openbook.azurewebsites.net/users/username', { 
            params: {
                username: username,
            } 
        } ).then(
            response => {
                    if (response.data[0].loggedIn === true) { // SO TWO USERS CAN'T LOG IN ON THE SAME ACCOUNT
                        if(moment().diff(moment(response.data[0].updatedAt), 'hours') < 2) { // IF USER HAS BEEN LOGGED IN FOR OVER 2 HOURS ON ANOTHER DEVICE (WHICH MEANS THEY HAVE LIKELY CLEARED THEIR COOKIES WITHOUT LOGGING OUT
                            document.querySelector(".ls-warning").innerText = "This Account is Already Logged in on Another Device. Please Log Out on That Device or Wait " +
                            (1 - moment().diff(moment(response.data[0].updatedAt), 'hours')) + " Hours & " +
                            (59 - (moment().diff(moment(response.data[0].updatedAt), 'minutes') % 60)) + " Minutes.";
                            document.querySelector(".ls-warning").style.color = "lightcoral";
                            return;
                        }
                    } 

                    const checkPass = response.data[0].password; // CURRENT DATABASE PASSWORD
                    // ENCRYPTS PASSWORD USER IS TRYING TO SEE IF IT MATCHES PASSWORD IN DATABASE
                    axios.get('https://openbook.azurewebsites.net/encrypt',{ params: {password: password }}).then(
                        response => {
                            if(checkPass === response.data) { // IF PASSWORDS MATCH
                        
                            axios.patch('https://openbook.azurewebsites.net/users/loggedin', { // UPDATE LOGGED IN STATUS
                                username: username, loggedIn: true,
                            }).then (
                                response => {
                                    console.log(response.data);
                                    Cookies.set("username", username, { sameSite:'strict', secure: true }); // SETS COOKIE AND CONTEXT
                                    navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES
                            }).catch(error => {
                                console.log(error.message);
                                return;
                            })
                            } else { // PASSWORD DOESN'T MATCH DATABASE
                                document.querySelector(".ls-warning").innerText = "Username & Password Do Not Match";
                                document.querySelector(".ls-warning").style.color = "lightcoral";
                                setPassword("");
                                return;
                            }
                        }
                    )
            }
        ).catch(error => { // IF USERNAME IS NOT FOUND
            console.log(error.message); 
            document.querySelector(".ls-warning").innerText = "Username Does Not Exist";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            setPassword("");
            return;
        })
    }

    return <> 
        <h3 className="sign-log"><Link to="/">Sign Up</Link> or Log In</h3>
        <form className="ls-form" onSubmit={(e)=>{HandleLogIn(e)}}>
             {/* handling for form when user submits on sign in or log in */}
            <label>Username</label>
            {/* requirements for password and user name and error for when it is exceeded */}
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} maxLength={10} />
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} maxLength={15} />
            <p className="ls-warning">Sample Warning Message</p>
            <button className="btn">Login</button>
            {/* populating warning message, and "login" button for the login functionalities */}
        </form>
    </>
   }