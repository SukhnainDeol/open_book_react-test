import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import moment from "moment"

export function HomePage() {

    // ------------------------------------------------------------------- DATABASE FETCH CODE

    const [backendData, setbackendData] = useState([{}]) // DB INFORMATION

    useEffect(() => {
        fetch("/api").then(
            response => response.json()
        ).then(
        data => {
            setbackendData(data)
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
        <Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
        <Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>"Snoop"</Link>
        <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Log Out</Link>
    </nav>

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
    </>
   }