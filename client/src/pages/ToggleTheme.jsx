import React, { useState, useEffect } from "react"

export function ToggleTheme() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    function toggleTheme() {
        setIsDarkMode((prevMode) => !prevMode);
        if (!isDarkMode) {
            document.documentElement.classList.add("dark-theme");
            document.documentElement.classList.remove("light-theme");
        } else {
            document.documentElement.classList.add("light-theme");
            document.documentElement.classList.remove("dark-theme");
        }
    }

    // FIXES A BUG WHERE IS USER LOGS OUT IN DARKMODE AND LOGS BACK IN, IT'S STILL THE DARK MODE CLASS BUT TOGGLE DOESN'T RECOGNIZE IT
    useEffect(() => {
        if(document.documentElement.classList.contains("dark-theme")) {
            setIsDarkMode(true);
        }
    }, [])

    return (
        <span onClick={toggleTheme} className="nav-link">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
    );
}
