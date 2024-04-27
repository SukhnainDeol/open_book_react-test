import { Link } from "react-router-dom"
import book from '../assets/book.png'; // BOOK IMAGE FOR HEADER

export function Login() {
    return <>

    <header className="page-title">
        <img src={book} className="logo"/>
       <h1>open_book</h1>
    </header>

    <label>Username</label>
    <input type="text"/>
    <label>Password</label>
    <input type="password"/>
     <Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}><button id="login-button" className="btn">Login!</button></Link>
    </>
   }