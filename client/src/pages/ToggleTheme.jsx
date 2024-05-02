import React, { useState } from "react"

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

    return (
        <span onClick={toggleTheme} className="nav-link">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
    );
}
