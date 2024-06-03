import React, { useState, useEffect, useRef } from "react";
import { Route, Routes, Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import { SignUp } from "./pages/Signup.jsx";
import { Login } from "./pages/Login.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { Snoop } from "./pages/Snoop.jsx";
import { WallOfFame } from "./pages/WallOfFame.jsx";
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
    const logoutTimer = useRef(null); // COUNT DOWN INTERVAL FOR LOG IN SCREEN
    const timer = useRef((60 * 14.5)); // AMOUNT OF TIME A USER IS ALLOWED TO BE IDLE 14.5 MINUTES
    const countdown = useRef(30); // COUNT DOWN UNTIL LOGGED OUT

    useEffect(() => {
        const timeLapse = setInterval(() => {
        const user = Cookies.get("username");
        
        if (user) {
            timer.current = timer.current - 1;
            if(timer.current === 0) {
                document.querySelector(".overlay").style.display = "flex";
                countdown.current = 30;
                document.querySelector(".warning-box-span").innerText = 30;
                logoutTimer.current = setInterval(() => {
                    countdown.current = countdown.current -1;
                    document.querySelector(".warning-box-span").innerText = countdown.current;
                    if(countdown.current === 0) {
                        handleIdleLogOut();
                    }
                    }, 1000); // 30 seconds to respond
                }       
        }}, 1000);
        return () => clearInterval(timeLapse);
    }, []);

    const updateTime = () => { // UPDATES TIMER ON USER ACTIVITY
        timer.current = ((60 * 14.5));
    };

    const clearLogoutTimer = () => { // clears the logout timer
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
            logoutTimer.current = null;
        }
    };

    useEffect(() => {
        timer.current = ((60 * 14.5)); // UPDATES THE TIME VIA EVENT LISTENERS
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

    const handleIdleLogOut = () => { // handles logging out the user after time's up or logout button is clicked
        axios.patch('http://localhost:5000/users/loggedin', { username: user, loggedIn: false })
        .then(() => {
            clearInterval(logoutTimer);
            clearLogoutTimer();
            document.querySelector(".overlay").style.display = "none";
            Cookies.remove("username");
            navigate('/');
        })
        .catch(error => console.log(error.message));
    };

    function handleLogOut(e) { // handles logging out the user after time's up or logout button is clicked
         e.preventDefault();
        axios.patch('http://localhost:5000/users/loggedin', { username: user, loggedIn: false }).then(() => {
            Cookies.remove("username");
            navigate('/');
        }).catch(error => console.log(error.message));
    }

    const handleStayLoggedIn = () => { // fucntion for when stay logged in is clicked
        updateTime();
        clearLogoutTimer(); // clears logout timer
        document.querySelector(".overlay").style.display = "none";
    };

    return (
        <>
            <header className={`page-title`}>
                <div className="logo">
                <img src={book} alt="Book Logo" />
                <h1>open_book</h1>
                </div> {/* setting the banner that is seen the whole time in the app */}
                <button className="menu-icon" onClick={toggleMenu}>
                    <img src={menuIcon} alt="Menu" />
                </button>
                {menuOpen && (
                    <nav className={`hamburger-menu ${menuOpen ? 'active' : ''}`}>
                        <ul className="nav-list">
                            {user && pName !== "/homepage" ? <li><Link to="/homepage" onClick={() => setMenuOpen(false)}>Home</Link></li> : ""}
                            {pName !== "/snoop" ? <li><Link to="/snoop" onClick={() => setMenuOpen(false)}>Snoop</Link></li> : ""}
                            {pName !== "/wof" ? <li><Link to="/wof" onClick={() => setMenuOpen(false)} >Wall Of Fame</Link></li>: ""}
                            {user ? <li><Settings /></li> : <li><Link to="#"><ToggleTheme /></Link></li>}
                            {user ? <li><Link to="/login" onClick={(e) => {setMenuOpen(false); handleLogOut(e);}}>Log Out</Link></li> : <li><Link to="/login" onClick={() => setMenuOpen(false)}>Log In</Link></li>}
                        </ul>
                        {/* will present the other pages in the website and give a link to access them */}
                    </nav>
                )} {/* placing the hamburger menu and handling the opening, and closing */}
                <span style={{visibility: 'hidden'}}><ToggleTheme /></span>
            </header>
            <div className="overlay">
                <div className="warning-box">
                    <p>You Will Be Logged Out In <span className="warning-box-span" style={{color: "lightcoral"}}></span> Seconds Due To Inactivity.</p>
                    <button onClick={handleIdleLogOut}>Log Out</button>
                    <button onClick={handleStayLoggedIn}>Stay Logged In</button>
                </div>
            </div>{/* structure for the a warning box to appear when user is idle (option to log out or continue) */}
            
            <Routes>
                <Route element={<PrivateRoutes />} >
                    <Route path="/homepage" element={<HomePage />} />
                </Route>
                <Route path="/snoop" element={<Snoop />} />
                <Route path="/wof" element={<WallOfFame />} />
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