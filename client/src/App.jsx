import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import { Login } from "./pages/Login.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Snoop } from "./pages/Snoop.jsx"
import Cookies from 'js-cookie'
import "./styles.css"
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER
//import menu_Icon from './assests/menu_Icon';//IMAGE FOR HAMBURGER MENU

function App() {

    return <>
            <header className="page-title">
                <img src={book} className="logo"/>
                <h1>open_book</h1>
            </header>
            <Routes>
                <Route element={<PrivateRoutes/>} >
                    <Route path="/homepage" element={<HomePage />} />
            
                </Route>
                <Route path="/snoop" element={<Snoop />} />
                <Route path="/" element={<Login />} />
            </Routes>
 </>
}

const PrivateRoutes = () =>{ // ANY ATTEMPT TO ACCESS HOMEPAGE WITHOUT BEING LOGGED IN WILL NAVIGATE BACK TO LOGIN PAGE
    const user = Cookies.get("username"); // IF COOKIE DOESN'T EXIST USER CAN'T GO TO HOMEPAGE
    return (
        user ? <Outlet/> : <Navigate to="/"/>
      )}
export default App