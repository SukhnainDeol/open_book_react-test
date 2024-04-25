import { Link } from "react-router-dom"

export function Login() {
    return <>
     <Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}><button id="login-button" className="btn">Login!</button></Link>
    </>
   }