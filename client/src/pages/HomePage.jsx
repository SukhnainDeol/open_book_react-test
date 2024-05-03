import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ToggleTheme } from "./ToggleTheme" // imports the new toggle theme file
import moment from "moment"
import Cookies from 'js-cookie'

export function HomePage() {

    // AUTH FUNCTIONS ------------------------------------------------------------------------------------------------------------------

    const navigate = useNavigate();

    function HandleLogOut(e) {
        e.preventDefault()

        // RESETS CONTEXT/COOKIE
        Cookies.remove("username")

        navigate('/') // NAVIGATES TO LOGIN PAGE WHEN USER LOGS OUT

    }

    useEffect(() => {
        const user = Cookies.get("username");
        console.log("LOGGED IN AS: " + user)
    })

    // ------------------------------------------------------------------- DATABASE FETCH CODE

    const [backendData, setbackendData] = useState([{}]) // DB INFORMATION

    useEffect(() => {
        fetch("http://localhost:5000/users").then(
            response => response.json()
        ).then(
        data => {
            setbackendData(data)
            console.log(data)
        })
    }, [])

    // ----------------------------------------------------------------------------------------

    const [newTitle, setNewTitle] = useState("")
    const [newEntry, setNewEntry] = useState("")
    const [entries, setEntries] = useState([])

    const [color, setColor] = useState(["black"]) // FOR TEXTAREA WARNING COLOR ABOUT CHARACTER LIMIT

    const currentDate = moment().format('l'); // CURRENT DATE FORMAT WITH MOMENT.JS

    function handleEntry(e) {

        e.preventDefault();

        setEntries((currentEntries) => {
            return [...currentEntries, { id: Math.random(), title: newTitle, entry: newEntry, date: currentDate}]
        })

        setNewTitle("")
        setNewEntry("")
    }

    function deleteEntry(id) {

        setEntries(currentEntries => {
            return currentEntries.filter(entry => entry.id !== id)
        })
    }

    // FUNCTIONS TO TURN TEXTAREA TEXT RED AFTER HITTING CHARACTER LIMIT

    useEffect(() => { // ONCE NEW COLOR IS SET BY CHECKENTRY(), COLOR CAN BE CHANGED FOR TEXTAREA USING USEEFFECT HOOK
        document.getElementById("entry").style.color = color;
    }, [color])

    function checkEntry(val) { // SETS COLOR BASED ON CHARACTER LIMIT

        console.log(val.length);
        if(val.length > 10) {
            if(color != "red") {
                setColor("red")
            }
        } else {
            if(color != "black") {
                setColor("black")
            }
        }
    }

    return <>

    <nav>
        <ul className="nav-list">
            <li><Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}>Home</Link></li>
            <li><Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>Snoop</Link></li>
            <li><ToggleTheme /></li>
            <li><Link to="#" style={{ textDecoration: 'none', color: 'black' }} onClick={(e) => {HandleLogOut(e)}}>Log Out</Link></li>
        </ul>  
    </nav>
    <div className = "homepage-container">
    <aside className="left-aside">
            <p class="sample-text">Left Aside Content</p>
    </aside>
    <div>
    <form id="new-entry-form" onSubmit={handleEntry}>

       <label htmlFor="title">Entry Title</label>
       <input type="text" id="title"  
       value={newTitle}
       onChange={e => setNewTitle(e.target.value)}
       />

       <label htmlFor="entry">Entry Content</label>
       <textarea placeholder="Write About Your Day..." id="entry" cols="50" rows="5" 
       value={newEntry}
       onChange={e => {setNewEntry(e.target.value); checkEntry(e.target.value)}}></textarea>

       <button id="post-entry" className="btn">Post Journal Entry</button>
    </form>

    {entries.reverse().map((entry) => {

        return <div className="entry-container" key={entry.id}>
            <p className="entries">
                <span className="current-entry-title">{entry.title} ({entry.date}):</span>
                <span className="current-entry">{entry.entry}</span></p>
            <button className="delete" onClick={() => deleteEntry(entry.id)}>Delete</button>
        </div>
    })}
    <br></br>
    </div>
    <aside className="right-aside">
        <p class="sample-text">Right Aside Content</p>
    </aside>
    </div>
    </>
   }
