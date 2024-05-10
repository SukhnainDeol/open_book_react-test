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
        console.log("LOGGED IN AS: " + user);
    });

    // ------------------------------------------------------------------- DATABASE FETCH CODE

    const [backendData, setbackendData] = useState([{}]); // DB INFORMATION

    useEffect(() => {
        fetch("http://localhost:5000/users").then(
            response => response.json()
        ).then(
            data => {
                setbackendData(data);
                console.log(data);
            });
    }, []);

    // ----------------------------------------------------------------------------------------

    const [newTitle, setNewTitle] = useState("");
    const [newEntry, setNewEntry] = useState("");
    const [entries, setEntries] = useState([]);
    const [color, setColor] = useState(["black"]);
    const currentDate = moment().format('l');

    function handleEntry(e) {
        e.preventDefault();
        setEntries((currentEntries) => {
            return [...currentEntries, { id: Math.random(), title: newTitle, entry: newEntry, date: currentDate }];
        });
        setNewTitle("");
        setNewEntry("");
    }

    function deleteEntry(id) {
        setEntries(currentEntries => {
            return currentEntries.filter(entry => entry.id !== id);
        });
    }

    // FUNCTIONS TO TURN TEXTAREA TEXT RED AFTER HITTING CHARACTER LIMIT

    useEffect(() => { // ONCE NEW COLOR IS SET BY CHECKENTRY(), COLOR CAN BE CHANGED FOR TEXTAREA USING USEEFFECT HOOK
        document.getElementById("entry").style.color = color;
    }, [color]);

    function checkEntry(val) { // SETS COLOR BASED ON CHARACTER LIMIT
        console.log(val.length);
        if (val.length > 10) {
            if (color !== "red") {
                setColor("red");
            }
        } else {
            if (color !== "black") {
                setColor("black");
            }
        }
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
                            onChange={e => { setNewEntry(e.target.value); checkEntry(e.target.value) }}></textarea>
                        <button id="post-entry" className="btn">Post Journal Entry</button>
                    </form>
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
                    <br></br>
                </div>
                <aside className="right-aside">
                    <p className="sample-text">{currentPrompts.right}</p>
                </aside>
            </div>
        </>
    );
}
