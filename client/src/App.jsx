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
    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES
    const pName = useLocation().pathname; // PATHNAME
    const user = Cookies.get("username"); // VALUE FOR COOKIE IF IT EXISTS UPON LANDING ON THE SITE
    const [menuOpen, setMenuOpen] = useState(false); // USESTATE FOR MANAGING HAMBURGER MENU
    const logoutTimer = useRef(null); // COUNT DOWN INTERVAL FOR LOG IN SCREEN
    const timer = useRef((60 * 14.5)); // AMOUNT OF TIME A USER IS ALLOWED TO BE IDLE 14.5 MINUTES
    const countdown = useRef(30); // COUNT DOWN UNTIL LOGGED OUT

    // USEEFFECT FOR IDLE TIMER. GOES FOR 14.5 MINUTES ON 1 SEC INTERVALS AND REFRESHES EVERY TIME A USER DOES AN EVENT. IF THE USER IS IDLE FOR 14.5 MINUTES A 30 SECOND TIME WILL LOG THE USER OUT IF THEY DONT RESPOND
    useEffect(() => {
        const timeLapse = setInterval(() => {
        const user = Cookies.get("username"); // COOKIE WILL EXIST IF USER IS LOGGED IN
        
        if (user) { // TIMER ONLY MATTERS IF USER IS LOGGED IN
            timer.current = timer.current - 1; // SUBTRACT A SECOND FROM THE TIME
            if(timer.current === 0) { // IF TIMER DROPS TO 0
                document.querySelector(".overlay").style.display = "flex";
                countdown.current = 30;
                document.querySelector(".warning-box-span").innerText = 30;
                logoutTimer.current = setInterval(() => {
                    countdown.current = countdown.current -1;
                    document.querySelector(".warning-box-span").innerText = countdown.current;
                    if(countdown.current === 0) {
                        handleIdleLogOut(); // LOGOUT IF USER DOESN'T RESPOND IN 30 SECONDS
                    }
                    }, 1000); // 30 seconds to respond
                }       
        }}, 1000);
        return () => clearInterval(timeLapse);
    }, []);

    const updateTime = () => { // UPDATES TIMER ON USER ACTIVITY
        timer.current = ((60 * 14.5));
    };

    const clearLogoutTimer = () => { // CLEARS LOGOUT TIMER
        if (logoutTimer.current) {
            clearTimeout(logoutTimer.current);
            logoutTimer.current = null;
        }
    };

    // USEEFFECT TO HANDLE EVENTLISTENERS FOR IDLE TIMER
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

    // FOR MANAGING HAMBURGER MENU STATE WHEN USER CLICKS ON MENU
    const toggleMenu = () => {
        setMenuOpen(prevMenuOpen => !prevMenuOpen);
    };

    const handleIdleLogOut = () => { // HANDLES LOGOUT FOR IDLE TIMER AND IDLE TIMER BUTTON
        axios.patch('https://openbook.azurewebsites.net/users/loggedin', { username: user, loggedIn: false })
        .then(() => {
            clearInterval(logoutTimer);
            clearLogoutTimer();
            document.querySelector(".overlay").style.display = "none";
            Cookies.remove("username");
            navigate('/');
        })
        .catch(error => console.log(error.message));
    };

    function handleLogOut(e) { // HANDLES LOG OUT FOR LOGOUT BUTTON IN HAMBURGER MENU
         e.preventDefault();
        axios.patch('https://openbook.azurewebsites.net/users/loggedin', { username: user, loggedIn: false }).then(() => {
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

// FUNCTION FOR PRIVATE ROUTES. HOMEPAGE IS A PRIVATE ROUTE AND ISN'T AVAILABLE UNTIL A USER LOGGS IN. ENSURES USERS DON'T MANUALLY PUT HOMEPAGE INTO THE SEARCH BAR
const PrivateRoutes = () => {
    const user = Cookies.get("username");
    return (
        user ? <Outlet /> : <Navigate to="/" />
    );
};

export default App;