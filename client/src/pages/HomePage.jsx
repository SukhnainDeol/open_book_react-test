import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import moment from "moment";
import { ToggleTheme } from "./ToggleTheme";
import Cookies from 'js-cookie';
import { LinkedList } from "./LinkedList";

export function HomePage() {

    // AUTH FUNCTIONS ------------------------------------------------------------------------------------------------------------------
    
    const navigate = useNavigate();

    function HandleLogOut(e) {
        e.preventDefault();
        Cookies.remove("username");
        navigate('/');
    }

    useEffect(() => {
        const user = Cookies.get("username");
        document.querySelector("textarea").placeholder = `Hello, ${user}. What's On Your Mind?`;
    });

    // ------------------------------------------------------------------- DATABASE FETCH CODE

    const [backendData, setbackendData] = useState([{}]); // DB INFORMATION

    // ----------------------------------------------------------------------------------------

    const [newTitle, setNewTitle] = useState("");
    const [newEntry, setNewEntry] = useState("");
    const [entries, setEntries] = useState([]);
    const [entryLength, setEntryLength] =useState(0);
    const currentDate = moment().format('l');

    function handleEntry(e) {
        e.preventDefault();
        setEntries((currentEntries) => {
            return [...currentEntries, { id: Math.random(), title: newTitle, entry: newEntry, date: currentDate }];
        });
        setNewTitle("");
        setNewEntry("");
        setEntryLength(0);
    }

    function deleteEntry(id) {
        setEntries(currentEntries => {
            return currentEntries.filter(entry => entry.id !== id);
        });
    }

    // initialize the new linked list for left
    const leftPromptsList = new LinkedList();

    //sample left prompts
    leftPromptsList.insert("Sample Left Prompt 1");
    leftPromptsList.insert("Sample Left Prompt 2");
    leftPromptsList.insert("Sample Left Prompt 3");

    // initialize new linked list for right
    const rightPromptsList = new LinkedList();

    //right sample prompts
    rightPromptsList.insert("Sample Right Prompt 1");
    rightPromptsList.insert("Sample Right Prompt 2");
    rightPromptsList.insert("Sample Right Prompt 3");

    // gets the current prompts for the asides
    const [currentPrompts, setCurrentPrompts] = useState({
        left: leftPromptsList.getCurrent(),
        right: rightPromptsList.getCurrent()
    });

    function promptNext() {
        leftPromptsList.resetOrNext(); // reset at end, move to the next otherwise for right and left
        rightPromptsList.resetOrNext(); 
        setCurrentPrompts({
            left: leftPromptsList.getCurrent(),
            right: rightPromptsList.getCurrent()
        });
    }

    useEffect(() => {
        const intervalId = setInterval(promptNext, 10000); // calls promptNext every 10 seconds

        return () => {
            clearInterval(intervalId); // clears the interval after unmount or useEffect dependancies change for cleanup purposes
        };
    }, []);

    return (
        <>
            <nav>
                <ul className="nav-list">
                    <li><Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}>Home</Link></li>
                    <li><Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>Snoop</Link></li>
                    <li><ToggleTheme /></li>
                    <li><Link to="#" style={{ textDecoration: 'none', color: 'black' }} onClick={(e) => { HandleLogOut(e) }}>Log Out</Link></li>
                </ul>
            </nav>
            <div className="homepage-container">
                <aside className="left-aside">
                    <p className="sample-text">{currentPrompts.left}</p>
                </aside>
                <div id="middle-container">
                    <form id="new-entry-form" onSubmit={handleEntry}>
                        <label htmlFor="title">Entry Title</label>
                        <input type="text" id="title"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                         maxLength={40}/>
                        <label htmlFor="entry">Entry Content</label>
                        <textarea cols="50" rows="5"
                            value={newEntry} maxLength={1000}
                            onChange={e => { setNewEntry(e.target.value); setEntryLength(e.target.value.length) }}></textarea>
                            <p id="entry-length">Character Limit: {entryLength}/1000</p>
                        <button id="post-entry" className="btn">Post Journal Entry</button>
                    </form>
                    <div id="entries-container">
                        {entries.reverse().map((entry) => {
                            return (
                                <div className="entry-container" key={entry.id}>
                                    <p className="entries">
                                        <span className="current-entry-title">{entry.title} ({entry.date}):</span>
                                        <span className="current-entry">{entry.entry}</span>
                                    </p>
                                    <button className="delete" onClick={() => deleteEntry(entry.id)}>Delete</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <aside className="right-aside">
                    <p className="sample-text">{currentPrompts.right}</p>
                </aside>
            </div>
        </>
    );
}
