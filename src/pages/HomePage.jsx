import { Link } from "react-router-dom"
import { useState } from "react" 

export function HomePage() {

    const [newTitle, setNewTitle] = useState("")
    const [newEntry, setNewEntry] = useState("")
    const [entries, setEntries] = useState([])

    function handleEntry(e) {

        e.preventDefault();

        setEntries((currentEntries) => {
            return [...currentEntries, { id: Math.random(), title: newTitle, entry: newEntry}]
        })

        setNewTitle("")
        setNewEntry("")
    }

    function deleteEntry(id) {

        setEntries(currentEntries => {
            return currentEntries.filter(entry => entry.id !== id)
        })
    }


    return <>
       
    <ul>
        <li><Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}>Home</Link></li>
        <li><Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>"Snoop"</Link></li>
        <li><Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Log Out</Link></li>
    </ul>

    <form id="new-entry-form" onSubmit={handleEntry}>

       <label htmlFor="title">Entry Title</label>
       <input type="text" id="title"  
       value={newTitle}
       onChange={e => setNewTitle(e.target.value)}
       />

       <label htmlFor="entry">Entry Content</label>
       <textarea placeholder="Write About Your Day..." id="entry" cols="50" rows="5" 
       value={newEntry}
       onChange={e => setNewEntry(e.target.value)}></textarea>

       <button id="post-entry" className="btn">Post Journal Entry</button>
    </form>

    {entries.reverse().map((entry) => {

        return <div className="entry-container" key={entry.id}>
            <p className="entries">
                <span className="current-entry-title">{entry.title}:</span>
                <span className="current-entry">{entry.entry}</span></p>
            <button className="delete" onClick={() => deleteEntry(entry.id)}>Delete</button>
        </div>
    })}
    </>
   }