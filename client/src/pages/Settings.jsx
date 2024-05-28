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
                const checkPass = response.data[0].password; // CURRENT DATABASE PASSWORD

                axios.get('http://localhost:5000/encrypt',{ params: {password: oldPass }}).then(
                    response => {
                    if (checkPass === response.data) // CHECK IF PASSWORDS MATCH
                    {
                        // ENCRYPTION
                        axios.get('http://localhost:5000/encrypt',{ params: {password: newPass }}).then(
                            response => {
                                console.log(response.data);
                                axios.patch('http://localhost:5000/users/password', { // UPDATE PASSWORD
                                username: user, password: response.data,
                                }).then (
                                    response => {
                                        console.log(response.data);
                                        document.querySelector(".ls-warning").innerText = response.data.message;
                                        document.querySelector(".ls-warning").style.color = "lightgreen";
                                        Reset(false);
                                    }).catch(error => {
                                        console.log(error.message);
                                        return;
                                    })
                            })
                    } 
                else { // ERROR WARNING IF THEY DONT MATCH
                    document.querySelector(".ls-warning").innerText = "Old Password is Incorrect!";
                    document.querySelector(".ls-warning").style.color = "lightcoral";
                    return;
                }
                })

        }).catch(error => {
            console.log(error.message);
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
                    Cookies.remove("theme"); // REMOVES COOKIE
                    navigate('/'); // SENDS THEM BACK TO SIGN IN PAGE
            }).catch( error => {
                console.log(error.message);
                return;
            })

        }
    }

    function Reset(fullReset) {
        if(fullReset) {
            document.querySelector(".ls-warning").style.color = "transparent"; // REMOVES WARNING MESSAGE
        }
        initialized.current = false; // RESETS DELETE TO 2 Clicks
        setOldPass("");
        setNewPass("");
        setConNewPass("");
    }

    return (<>
        <span className="nav-link"><Link to="#" onClick={() => {{Reset(true), setViz(!viz)}}}>Settings</Link></span>
        <div id="settings-menu">
            <h3>Change Display: </h3>
            <button className="btn"><ToggleTheme /></button>
            <form onSubmit={(e) => {changepass(e)}}>
                <h3>Change Password:</h3><br/>
                <label>Old Password:</label>
                <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} maxLength={15} />
                <label>New Password:</label>
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} maxLength={15} />
                <label>Confirm New Password:</label>
                <input type="password" value={conNewPass} onChange={e => setConNewPass(e.target.value)} maxLength={15} />
                <button className="btn">Change</button>
                <p className="ls-warning">Sample Warning Message</p>
            </form>
            <button className="delete" onClick={(e)=>{warnDelete(e)}}>Delete Account</button>
        </div>
        </>
    );
}