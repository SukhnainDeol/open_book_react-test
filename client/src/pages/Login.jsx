import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

export function Login() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function Try() {

        console.log(username);
        console.log(password);

        axios.post('http://localhost:5000/users/', {username: username, password: password})

        window.location = '/homepage'
    }


    return <>
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        < Link to="#" style={{ textDecoration: 'none', color: 'black' }}><button id="login-button" className="btn" onClick={() => Try()} >Login!</button></Link>
    </>
   }
