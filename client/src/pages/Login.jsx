import { Link } from "react-router-dom"
import { ToggleTheme } from "./ToggleTheme" // imports toggle theme file


export function Login() {
    return <>

    <label>Username</label>
    <input type="text"/>
    <label>Password</label>
    <input type="password"/>
     <Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}><button id="login-button" className="btn">Login!</button></Link>
     <br></br>
    <ToggleTheme />
    </>
   }
