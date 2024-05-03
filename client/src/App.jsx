import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import { Login } from "./pages/Login.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Snoop } from "./pages/Snoop.jsx"
import { AuthProvider, useAuth } from "./contexts/auth-context.jsx";
import { CookiesProvider, useCookies } from 'react-cookie'
import "./styles.css"
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER 

function App() {

    return <>
        <AuthProvider>
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
        </AuthProvider>
 </>
}

const PrivateRoutes = () =>{ // ANY ATTEMPT TO ACCESS HOMEPAGE WITHOUT BEING LOGGED IN WILL NAVIGATE BACK TO LOGIN PAGE
    const Auth = useAuth();
    return (
        Auth.loggedIn ? <Outlet/> : <Navigate to="/"/>
      )}
export default App