import React, { useState, useEffect, useRef } from "react"
import { ToggleTheme } from "./ToggleTheme"
import Cookies from 'js-cookie'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

export function Settings() {

    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
    const navigate = useNavigate();

    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [conNewPass, setConNewPass] = useState("")
    const [viz, setViz] = useState(false)
    
    useEffect(()=>{
        viz ?  document.querySelector("#settings-menu").style.display = "block" : document.querySelector("#settings-menu").style.display = "none"
    },[viz])

    function changepass(e) {
        e.preventDefault() // PREVENTS FORM SUBMISSION TO NOTHING

        if(oldPass === "" || newPass === "" || conNewPass === "") { // CHECKS TO SEE IF USERS PUT EVERYTHING
            document.querySelector(".ls-warning").innerText = "Please Fill Out All Inputs";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        } else if(newPass !== conNewPass) { // MAKES SURE PASSWORDS MATCH
            document.querySelector(".ls-warning").innerText = "New Password & Confirm New Password Don't Match";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        } else if(newPass.length < 5 ) { // MAKES SURE NEW PASS IS MIN LENGTH
            document.querySelector(".ls-warning").innerText = "New Password Must Be Atleast 5 Characters";
            document.querySelector(".ls-warning").style.color = "lightcoral";
            return;
        }

        
        axios.get('http://localhost:5000/users/username', { // GET USER INFO
            params: {
                username: user,
            }
        }).then(
            response => {
                if (response.data[0].password === oldPass) // CHECK IF PASSWORDS MATCH
                {
                    axios.patch('http://localhost:5000/users/password', { // UPDATE PASSWORD
                        username: user, password: newPass,
                    }).then (
                        response => {
                            console.log(response);
                            document.querySelector(".ls-warning").innerText = response.data.message;
                            document.querySelector(".ls-warning").style.color = "lightgreen";
                    }).catch(error => {
                        console.log(error);
                        return;
                    })
                } 
                else { // ERROR WARNING IF THEY DONT MATCH
                    document.querySelector(".ls-warning").innerText = "Old Password is Incorrect!";
                    document.querySelector(".ls-warning").style.color = "lightcoral";
                    return;
                }
        }).catch(error => {
            console.log(error);
            return;
        })

        
    }

    function warnDelete(e) {
        e.preventDefault() // PREVENTS FORM SUBMISSION TO NOTHING

        if (!initialized.current) { // USER CAN'T DELETE ON FIRST PUSH
            initialized.current = true
            document.querySelector(".ls-warning").innerText = 'Click "Delete Account" Again To Confirm';
            document.querySelector(".ls-warning").style.color = "lightcoral";
        } else { // AXIOS CALL GOES HERE 

            axios.delete('http://localhost:5000/users', {
                params: {
                    username: user,
                }
            }).then(
                response => {
                    Cookies.remove("username"); // REMOVES COOKIE
                    navigate('/'); // SENDS THEM BACK TO SIGN IN PAGE
            }).catch( error => {
                console.log(error);
                return;
            })

        }
    }

    function Reset() {
        document.querySelector(".ls-warning").style.color = "transparent"; // REMOVES WARNING MESSAGE
        initialized.current = false; // RESETS DELETE TO 2 Clicks
    }

    return (<>
        <span className="nav-link"><Link to="#" onClick={() => {{Reset(), setViz(!viz)}}}>Settings</Link></span>
        <div id="settings-menu">
            <h4>Change Display: </h4>
            <button className="btn"><ToggleTheme /></button>
            <form onSubmit={(e) => {changepass(e)}}>
                <h4>Change Password:</h4><br/>
                <label>Old Password:</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} />
                <label>New Password:</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                <label>Confirm New Password:</label>
                <input type="password" value={conNewPass} onChange={e => setConNewPass(e.target.value)} />
                <button className="btn">Change</button>
                <p className="ls-warning">Sample Warning Message</p>
            </form>
            <button className="delete" onClick={(e)=>{warnDelete(e)}}>Delete Account</button>
        </div>
        </>
    );
}