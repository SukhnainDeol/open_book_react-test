import React, { useState, useEffect } from "react"
import { ToggleTheme } from "./ToggleTheme"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"

export function Settings() {

    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
    const [oldPass, setOldPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [conNewPass, setConNewPass] = useState("")
    const [viz, setViz] = useState(false)
    
    useEffect(()=>{
        viz ?  document.querySelector("#settings-menu").style.display = "block" : document.querySelector("#settings-menu").style.display = "none"
    },[viz])

    return (<>
        <span className="nav-link"><Link to="#" onClick={() => {setViz(!viz)}}>Settings</Link></span>
        <div id="settings-menu">
            <h4>Change Display: </h4>
            <button className="btn"><ToggleTheme /></button>
            <h4>Change Password:</h4><br/>
            <label>Old Password:</label>
            <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)}/>
            <label>New Password:</label>
            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}/>
            <label>Confirm New Password:</label>
            <input type="password" value={conNewPass} onChange={e => setConNewPass(e.target.value)}/>
            <p className="ls-warning">Sample Warning Message</p>
            <button className="delete">Delete Account</button>
        </div>
        </>
    );
}