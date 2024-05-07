import React, { useState, useEffect } from "react"
import Cookies from 'js-cookie'

export function ToggleTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleTheme() {
        setIsDarkMode((prevMode) => !prevMode);
        if (!isDarkMode) {
            Cookies.set('theme', true); // SETS COOKIE TRUE
            document.documentElement.classList.add("dark-theme");
            document.documentElement.classList.remove("light-theme");
        } else {
            Cookies.set('theme', false); // SETS COOKIE FALSE
            document.documentElement.classList.add("light-theme");
            document.documentElement.classList.remove("dark-theme");
        }
    }

    // USEEFFECT() TO HANDLE COOKIES/MODE CONTEXT BUG
    useEffect(() => {

        const Theme = Cookies.get("theme"); // COOKIE VALUE IF IT EXISTS, OR UNDECLARED

        if(Theme) { // IF IT EXISTS DISPLAY PROPER MODE SETTING

            setIsDarkMode(Boolean(Theme)); // SETS DARKMODE TO THEME VALUE

            if(Theme === 'true') {
                document.documentElement.classList.add("dark-theme");
                document.documentElement.classList.remove("light-theme");
            } else if(Theme === 'false') {
                document.documentElement.classList.add("light-theme");
                document.documentElement.classList.remove("dark-theme");
            }
        } else { // FIXES A BUG WHERE IS USER LOGS OUT IN DARKMODE AND LOGS BACK IN, IT'S STILL THE DARK MODE CLASS BUT TOGGLE DOESN'T RECOGNIZE IT
            if(document.documentElement.classList.contains("dark-theme")) {
                setIsDarkMode(true);
            }
        }
    }, [])

    return (
        <span onClick={toggleTheme} className="nav-link">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
    );
}
