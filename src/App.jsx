import { Link, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Snoop } from "./pages/Snoop.jsx"
import "./styles.css"
import logo from './assets/logo.png'; // BOOK LOGO FOR HEADER

function App() {
 return <>
 <header className="page-title">
        <img src={logo} className="logo"/>
       <h1>open_book</h1>
  </header>
  <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/snoop" element={<Snoop />} />
  </Routes>
 </>
}

export default App