import React, { useState, useEffect } from "react"
import { ToggleTheme } from "./ToggleTheme"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"
import axios from "axios"

export function Settings() {

    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
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

        /* AXIOS CALL GOES HERE
        TIPS:
        1. LOOK AT SERVER.JS API ROUTES TO FIGURE OUT WHICH ROUTE YOU ARE SENDING IT TO
        2. GO TO USERS.ROUTE.JS OR POSTS.ROUTE.JS TO FIGURE OUT ROUTE EXTENSION

        axios.(get/put/patch?)('http://localhost:5000/<ROUTE GOES HERE>/<ROUTE EXTENSION GOES HERE>', { BODY INFO GOES HERE... USERNAME CAN BE DERIVED BY THE COOKIE ON LINE 8}).then(
            response => {
                console.log(response);
                PUT THIS IN THE RESPONSE: 
                document.querySelector(".ls-warning").innerText = "Password Successfully Changed!";
                document.querySelector(".ls-warning").style.color = "lightgreen";
        }).catch(error => {
            console.log(error);
                return;
        })

        */
       axios.patch('https://localhost:5000/users/password', { 
        username: user, password: newPass,
        }).then (
            response => {
                console.log(response);
                document.querySelector(".ls-warning").innerText = "Password Successfully Changed!";
                document.querySelector(".ls-warning").style.color = "lightgreen";
        }).catch(error => {
            console.log(error);
            return;
        })
    }

    return (<>
        <span className="nav-link"><Link to="#" onClick={() => {setViz(!viz)}}>Settings</Link></span>
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
            <button className="delete">Delete Account</button>
        </div>
        </>
    );
}