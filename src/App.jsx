import { Link, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login.jsx"
import { HomePage } from "./pages/HomePage.jsx"
import { Snoop } from "./pages/Snoop.jsx"
import "./styles.css"

function App() {
 return <>
 <header>
       <h1 className="page-title">open_book</h1>
  </header>
  <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route path="/snoop" element={<Snoop />} />
  </Routes>
 </>
}

export default App