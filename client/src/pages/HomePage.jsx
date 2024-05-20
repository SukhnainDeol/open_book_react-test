import { useState, useEffect, useRef } from "react";
import moment from "moment";
import Cookies from 'js-cookie';
import { LinkedList } from "./LinkedList";
import axios from "axios"

export function HomePage() {

    // ON LOAD FUNCTIONS/VARIABLES ------------------------------------- |

    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    const [newTitle, setNewTitle] = useState("");
    const [newEntry, setNewEntry] = useState("");
    const [entries, setEntries] = useState([]);
    const [entryLength, setEntryLength]= useState(0);
    const currentDate = moment().format('lll');

    useEffect(() => {

        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true

        document.querySelector("textarea").placeholder = `Hello, ${user}. What's On Your Mind?`; // SETS TEXTAREA PLACEHOLDER WITH USERNAME SO USER KNOWS LOGIN IS SUCCESSFULL

        axios.get('http://localhost:5000/posts/username', { // PULL THEIR POSTS
            params: {
                author: user, // SPECIFIC SEARCH FOR USER
            } 
            }).then(
                response => {
                    response.data.forEach(currentEntry => {
                            setEntries((entries) => {
                                return [...entries, { id: currentEntry._id, title: currentEntry.title, entry: currentEntry.text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count }];
                        });
                    });
                }
            ).catch(error => {
                console.log(error.message);
                    return;
            })
        }
    }, [])

    useEffect(() => {
        const intervalId = setInterval(promptNext, 10000); // calls promptNext every 10 seconds

            return () => {
                clearInterval(intervalId); // clears the interval after unmount or useEffect dependancies change for cleanup purposes
            };
    }, [])

    // ----------------------------------------------------------------------------------------

    function handleEntry(e) {
        e.preventDefault();

        axios.post('http://localhost:5000/posts/', { // MAKE A NEW POST
        author: user,
        title: newTitle,
        text: newEntry,
        date: currentDate
        }).then(
            response => {
                console.log(response.data);
                axios.get('http://localhost:5000/posts/username-recent', { // GRABS THE POST WE JUST MADE TO THE DATABASE
                    params: {
                    author: user, // SPECIFIC SEARCH FOR RANDOM USER
                } 
                }).then(
                    response => {
                        setEntries((currentEntries) => { // RENDERS NEW POST ON THE SCREEN
                            return [...currentEntries, { id: response.data[0]._id, title: response.data[0].title, entry: response.data[0].text, date: response.data[0].date, L: response.data[0].likes.count, D: response.data[0].dislikes.count }];
                         });

                        setNewTitle("");
                        setNewEntry("");
                        setEntryLength(0);
                }).catch(error => {
                console.log(error.message);
                    return;
                })
            }
        ).catch(error => {
            console.log(error.message);
                return;
        })
    }

    function deleteEntry(id) {

        axios.delete('http://localhost:5000/posts/id', {params: {id: id }}).then(
            response => {
                console.log(response.data);
                setEntries(currentEntries => {
                    return currentEntries.filter(entry => entry.id !== id);
                });
            }
        ).catch(error => {
            console.log(error.message);
                return;
        })
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

    return (
        <>
            <div className="homepage-container">
                <aside className="left-aside">
                    <p className="sample-text">{currentPrompts.left}</p>
                </aside>
                <div id="middle-container">
                    <form id="new-entry-form" onSubmit={(e) => {handleEntry(e)}}>
                        <label htmlFor="title">Entry Title</label>
                        <input type="text" id="title"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                         maxLength={25} required/>
                        <label htmlFor="entry">Entry Content</label>
                        <textarea cols="50" rows="5"
                            value={newEntry} maxLength={1000}
                            onChange={e => { setNewEntry(e.target.value); setEntryLength(e.target.value.length) }} required></textarea>
                            <p id="entry-length">Character Limit: {entryLength}/1000</p>
                        <button id="post-entry" className="btn">Post Journal Entry</button>
                    </form>
                    <div id="entries-container">
                        {entries.toReversed().map((entry) => {
                            return (
                                <div className="entry-container" key={entry.id}>
                                    <p className="entries">
                                        <span className="current-entry-title">{entry.title} ({moment(entry.date).format('lll')}):</span>
                                        <span className="current-entry">{entry.entry}</span>
                                        <span className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></span>
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
