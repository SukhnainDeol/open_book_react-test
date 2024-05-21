import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import moment from "moment";
import Cookies from 'js-cookie';
import { LinkedList } from "./LinkedList";
import axios from "axios"

export function HomePage() {

    // ON LOAD FUNCTIONS/VARIABLES ------------------------------------- |

    const navigate = useNavigate();
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
                // THIS WOULD LIKELY MEAN THAT THE ACCOUNT DOESN'T EXIST AFTER DELETION
                console.log(error.message);
                Cookies.remove("username"); // REMOVING THE COOKIE
                navigate('/');
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
    leftPromptsList.insert("Write something about yourself...");
    leftPromptsList.insert("What is a childhood memory that stands out to you?");
    leftPromptsList.insert("What are some of your goals?");
    leftPromptsList.insert("What is your biggest fear?");
    leftPromptsList.insert("Write a letter to your future self...");
    leftPromptsList.insert("If you could have any superpower, what would it be?");
    leftPromptsList.insert("What are your favorite and least favorite foods?");
    leftPromptsList.insert("Create a fake conspiracy theory...");
    leftPromptsList.insert("If you could travel anywhere in the world, where would it be and why?");
    leftPromptsList.insert("Write about your dream career...");
    leftPromptsList.insert("You have been elected the leader of your country, what is the first thing you do?");
    leftPromptsList.insert("What is the most embarrasing thing that has ever happened to you?");

    // initialize new linked list for right
    const rightPromptsList = new LinkedList();

    //right sample prompts
    rightPromptsList.insert("Describe a dream you had recently...");
    rightPromptsList.insert("Write a poem or short story...");
    rightPromptsList.insert("How do you unwind after a busy day?");
    rightPromptsList.insert("What is the funniest thing that has ever happened to you?");
    rightPromptsList.insert("What are three things you are grateful for?");
    rightPromptsList.insert("Reflect on a recent accomplishment...");
    rightPromptsList.insert("What are you most passionate about?");
    rightPromptsList.insert("What are some of your guilty pleasures?");
    rightPromptsList.insert("What person made the biggest impact on your life and why?");
    rightPromptsList.insert("What is the biggest challenge you have overcome?");
    rightPromptsList.insert("What are three things you'd like the change about yourself?");
    rightPromptsList.insert("What does a perfect day look like to you?");

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
