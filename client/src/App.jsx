import React, { useState, useEffect } from "react";// UseStates from React
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { SignUp } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { Snoop } from "./pages/Snoop.jsx";
import Cookies from 'js-cookie';
import "./styles.css";
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER
import menuIcon from './assets/menuIcon.png'; // HAMBURGER MENU ICON
import { ToggleTheme } from "./pages/ToggleTheme"
import { Settings } from "./pages/Settings"
import axios from "axios"

function App() {

    
    const navigate = useNavigate();
    const pName = useLocation().pathname;
    const user = Cookies.get("username");
    const [menuOpen, setMenuOpen] = useState(false);

    // ------------------------------------ CREATING OUR OWN IDLE TIMER FOR USERS
    //FUNCTION TO CHECK FOR INACTIVITY
    const activityCheck = () => {
        const timeLeft = localStorage.getItem("Time");
        const currentTime = Date.now();
        if(user) { // IF USER IS LOGGED IN
            if(timeLeft < currentTime) { // IF USER HASN'T BEEN ACTIVE FOR 15 MINUTES
                axios.patch('http://localhost:5000/users/loggedin', {username: user, loggedIn: false},).then(
                    response => {
                        Cookies.remove("username");
                        navigate('/');
                }).catch( error => {
                    console.log(error.message);
                    return;
                })
            } else if(timeLeft - currentTime <  60000) { // IF THERE'S LESS THAN A MINUTE BEFORE LOGOUT
                console.log("YOU WILL BE LOGGED OUT IN 1 MINUTE!");
            }
        }
    }

    // FUNCTION TO UPDATE TIME WHEN USER IS ACTIVE
    const updateTime = () => {
        const time = Date.now() + (1000 * 60 * 15); // UPDATES TIME BY 15 Minutes
        localStorage.setItem("Time",  time);
    }

    // CHECKS FOR ACTIVITY EVERY SECOND
    useEffect(() => {
        const timeLapse = setInterval(() => {
            activityCheck();
        }, 1000)

        return () => clearInterval(timeLapse);
    }, [])


    // UPDATES TIME WHEN USER IS ACTIVE
    useEffect(() => {
        // SETS INITIAL TIME WHEN USER LANDS ON THE SITE
        updateTime();

        // EVENT LISTENERS FOR CLICKING, SCROLLING, PRESSING KEYS, MOVING MOUSE
        window.addEventListener("click", updateTime);
        window.addEventListener("scroll", updateTime);
        window.addEventListener("keypress", updateTime);
        window.addEventListener("mousemove", updateTime);

        return () => { // REMOVES EVENT LISTENERS
            window.removeEventListener("click", updateTime);
            window.removeEventListener("scroll", updateTime);
            window.removeEventListener("keypress", updateTime);
            window.removeEventListener("mousemove", updateTime);
        }
    },
    [])


    // --------------------------------------------

    const toggleMenu = () => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen);
    };// Function for menu to open or revert to when it was closed

    function HandleLogOut(e) {
        e.preventDefault();

        axios.patch('http://localhost:5000/users/loggedin', 
            {username: user, loggedIn: false},
        ).then(
            response => {
                Cookies.remove("username");
                navigate('/');
        }).catch( error => {
            console.log(error.message);
            return;
        })
        
    }


    return (
        <>  {/* Set up for the Main Header and top menus */}
            <header className={`page-title`}>
                <img src={book} className="logo" alt="Book Logo" />
                <h1>open_book</h1>
                <button className="menu-icon" onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu" />
                </button>
                {/* Set up for hamburger menu and drop down link */}
                {menuOpen && (
                    <nav className={`hamburger-menu ${menuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            {/* Closes the menu after clicking on one of the options  */}

                            { // IF USER ISN'T SIGNED IN, DON'T SHOW HOME
                                user && pName !== "/homepage" ? <li><Link to="/homepage" onClick={() => setMenuOpen(false)}>Home</Link></li> : ""
                            }

                            { // IF ON SNOOP PAGE, DON'T SHOW SNOOP LINK
                                pName !== "/snoop" ? <li><Link to="/snoop" onClick={() => setMenuOpen(false)}>Snoop</Link></li> : ""
                            }
                            { user ? <li><Settings /></li> : <li><ToggleTheme /></li>}
                            { // IF USER ISN'T SIGNED IN, DON'T SHOW LOG OUT
                                user ? <li><Link to="/login" onClick={(e) => {setMenuOpen(false), HandleLogOut(e)}}>Log Out</Link></li> : <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log In</Link></li>
                            }
                        </ul>
                    </nav>
                )}
                { /* INVISIBLE SPAN FOR THEME COOKIE */}
                <span style={{visibility: 'hidden'}}><ToggleTheme /></span>
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
