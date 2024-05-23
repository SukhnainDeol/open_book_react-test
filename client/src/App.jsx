import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { SignUp } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { Snoop } from "./pages/Snoop.jsx";
import Cookies from 'js-cookie';
import "./styles.css";
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER
import menuIcon from './assets/menuIcon.png'; // HAMBURGER MENU ICON
import { ToggleTheme } from "./pages/ToggleTheme";
import { Settings } from "./pages/Settings";
import axios from "axios";

function App() {
    const navigate = useNavigate();
    const pName = useLocation().pathname;
    const user = Cookies.get("username");
    const [menuOpen, setMenuOpen] = useState(false);
    const [showWarning, setShowWarning] = useState(false); // initally sets show warning to false
    const [hasBeenWarned, setHasBeenWarned] = useState(false); // initally sets has been warned to false
    const inactivityTimer = useRef(null); // timer to display warning box after 15 mins
    const logoutTimer = useRef(null); // timer logs user out after minute on warning box

    const activityCheck = () => {
        const timeLeft = parseInt(localStorage.getItem("Time"), 10);
        const currentTime = Date.now();
        
        if (user && !['/', '/login'].includes(pName)) {
            if (showWarning) {
                // if warning box is currently visible, start the logout timer
                clearLogoutTimer();
                startLogoutTimer();
            } else {
                if (timeLeft < currentTime) {
                    // when the inactivity timer has expired, log out the user
                    handleLogOut();
                } else if (timeLeft - currentTime < 60000 && !hasBeenWarned) {
                    // if the inactivity warning threshold is reached and the user hasn't been warned yet, show the warning box
                    setShowWarning(true);
                    setHasBeenWarned(true);
                    clearLogoutTimer();
                    startLogoutTimer();
                }
            }
        }
    };

    const updateTime = () => { // function updates the timer on user activity
        const time = Date.now() + 15 * 60 * 1000;; // 15 minutes resets from any activity
        localStorage.setItem("Time", time);
        clearInactivityTimer();
        startInactivityTimer();
    };

    const startInactivityTimer = () => { // this starts the inactivity timer once the warning box appears, might be REDUNDANT
                                         // might end up combining with activityCheck but it was easier for me to understand this way 
        inactivityTimer.current = setTimeout(() => {
            setShowWarning(true);
            setHasBeenWarned(true);
            startLogoutTimer();
        }, 14 * 60 * 1000); // 10 seconds of inactivity for testing
    };

    const clearInactivityTimer = () => { // clears the inactivity timer
        if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
            inactivityTimer.current = null;
        }
    };

    const startLogoutTimer = () => { // starts the logout timer
        logoutTimer.current = setTimeout(() => {
            handleLogOut();
        }, 60000); // 60 seconds to respond
    };

    const clearLogoutTimer = () => { // clears the logout timer
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
            logoutTimer.current = null;
        }
    };

    useEffect(() => {
        const timeLapse = setInterval(() => {
            activityCheck();
        }, 1000);

        return () => clearInterval(timeLapse);
    }, []);

    useEffect(() => {
        updateTime();
        window.addEventListener("click", updateTime);
        window.addEventListener("scroll", updateTime);
        window.addEventListener("keypress", updateTime);
        window.addEventListener("mousemove", updateTime);

        return () => {
            window.removeEventListener("click", updateTime);
            window.removeEventListener("scroll", updateTime);
            window.removeEventListener("keypress", updateTime);
            window.removeEventListener("mousemove", updateTime);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen);
    };

    const handleLogOut = (e) => { // handles logging out the user after time's up or logout button is clicked
        if (e) e.preventDefault();
        clearLogoutTimer();
        clearInactivityTimer();
        localStorage.removeItem("Time"); // clears the "Time" item in localStorage
        setHasBeenWarned(false); // resets the hasBeenWarned variable
        setShowWarning(false); // resets showWarning
    };
    
    useEffect(() => {
        if (!showWarning && !hasBeenWarned && user) {
            axios.patch('http://localhost:5000/users/loggedin', { username: user, loggedIn: false })
                .then(() => {
                    Cookies.remove("username");
                    navigate('/');
                })
                .catch(error => console.log(error.message));
        }
    }, [showWarning, hasBeenWarned]);

    const handleStayLoggedIn = () => { // fucntion for when stay logged in is clicked
        updateTime(); // reset the inactivity timer
        setShowWarning(false); // hide the warning box
        clearLogoutTimer(); // clears logout timer
        startInactivityTimer(); // restarts the inactivity timer again
    };

    return (
        <>  
            <header className={`page-title`}>
                <img src={book} className="logo" alt="Book Logo" />
                <h1>open_book</h1>
                <button className="menu-icon" onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu" />
                </button>
                {menuOpen && (
                    <nav className={`hamburger-menu ${menuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            {user && pName !== "/homepage" ? <li><Link to="/homepage" onClick={() => setMenuOpen(false)}>Home</Link></li> : ""}
                            {pName !== "/snoop" ? <li><Link to="/snoop" onClick={() => setMenuOpen(false)}>Snoop</Link></li> : ""}
                            {user ? <li><Settings /></li> : <li><ToggleTheme /></li>}
                            {user ? <li><Link to="/login" onClick={(e) => {setMenuOpen(false); handleLogOut(e);}}>Log Out</Link></li> : <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log In</Link></li>}
                        </ul>
                    </nav>
                )}
                <span style={{visibility: 'hidden'}}><ToggleTheme /></span>
            </header>
            {user && showWarning && !['/', '/login'].includes(pName) && (
                <div className="overlay">
                    <div className="warning-box">
                        <p>You will be logged out in 1 minute due to inactivity.</p>
                        <button onClick={handleLogOut}>Log Out</button>
                        <button onClick={handleStayLoggedIn}>Stay Logged In</button>
                    </div>
                </div>
            )}
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

const PrivateRoutes = () => {
    const user = Cookies.get("username");
    return (
        user ? <Outlet /> : <Navigate to="/" />
    );
};

export default App;