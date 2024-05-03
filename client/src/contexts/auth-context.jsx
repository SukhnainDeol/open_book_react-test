import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext() // CREATES A CONTEXT TO BE STORED FOR THE USER THROUGHOUT THE PROGRAM

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider(props){
    const [user, setUser] = useState({Username: ""})
    const [loggedIn, setLoggedIn] = useState(false)

    const value = {
        loggedIn,
        setLoggedIn
    }

    return(
        <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
    )
}

