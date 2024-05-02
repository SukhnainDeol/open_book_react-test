import { Link, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Snoop } from "./pages/Snoop.jsx"
import book from './assets/book.png'; // BOOK IMAGE FOR HEADER 
import { AuthProvider } from "./contexts/auth-context.jsx";
//import Context, { UserContext } from './contexts/auth-context.jsx';
import "./styles.css"

function App() {

 return <>
    <AuthProvider>
        <header className="page-title">
            <img src={book} className="logo"/>
            <h1>open_book</h1>
        </header>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/homepage" element={<HomePage />} />
            <Route path="/snoop" element={<Snoop />} />
        </Routes>
    </AuthProvider>
 </>
}

export default App