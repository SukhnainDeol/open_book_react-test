import React, { useState } from "react";// UseStates from React
import { Route, Routes, Outlet, Navigate, Link } from "react-router-dom";
import { SignUp } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { Snoop } from "./pages/Snoop.jsx";
import Cookies from 'js-cookie';
import "./styles.css";
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER
import menuIcon from './assets/menuIcon.png'; // HAMBURGER MENU ICON

function App() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [lightMode, setLightMode] = useState(false);
    // Use of two state variables to track menu options and light/dark mode 
    const toggleMenu = () => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen);
    };// Function for menu to open or revert to when it was closed

    const toggleLightMode = () => {
        setLightMode(!lightMode);
        document.body.classList.toggle("dark-theme", lightMode);
    };// Same idea as before but for light and dark modes

    return (
        <>  {/* Set up for the Main Header and top menus */}
            <header className={`page-title ${lightMode ? 'light-mode' : 'dark-mode'}`}>
                <img src={book} className="logo" alt="Book Logo" />
                <h1>open_book</h1>
                <button className="menu-icon" onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu" />
                </button>
                {/* Set up for hamburger menu and drop down link */}
                {menuOpen && (
                    <nav className={`hamburger-menu ${menuOpen ? 'active' : ''} ${lightMode ? 'light-mode' : 'dark-mode'}`}>
                        <ul className="nav-list">
                            {/* Closes the menu after clicking on one of the options  */}
                            <li><Link to="/homepage" onClick={() => setMenuOpen(false)}>Home</Link></li>
                            <li><Link to="/snoop" onClick={() => setMenuOpen(false)}>Snoop</Link></li>
                            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
                            <li>
                                {/* Light/Dark mode toggle in drop down menu */}
                                <button className="btn" onClick={toggleLightMode}>
                                    {lightMode ? "Dark Mode" : "Light Mode"}
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </header>
            <Routes>
                <Route element={<PrivateRoutes />} >
                    <Route path="/homepage" element={<HomePage />} />
                </Route>
                <Route path="/snoop" element={<Snoop />} />
                <Route path="/" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

const PrivateRoutes = () => {//ANY ATTEMPT TO ACCESS HOMEPAGE WITHOUT BEING LOGGED IN WILL NAVIGATE BACK TO LOGIN PAGE
    const user = Cookies.get("username"); // IF COOKIE DOESN'T EXIST USER CAN'T GO TO HOMEPAGE
    return (
        user ? <Outlet /> : <Navigate to="/" />
    );
};

export default App;
