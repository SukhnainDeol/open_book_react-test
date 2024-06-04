import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import moment from "moment";
import Cookies from 'js-cookie';
import { LinkedList } from "./LinkedList";
import axios from "axios"

export function HomePage() {

    const navigate = useNavigate(); // "react-router-dom" VARIABLE TO NAVIGATE BETWEEN PAGES
    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START
    const [entries, setEntries] = useState([]); // USESTATE ARRAY FOR ENTRIES FROM DATABASE
    const [newTitle, setNewTitle] = useState(""); // VALUE OF TITLE INPUT
    const [newEntry, setNewEntry] = useState(""); // VALUE OF ENTRY TEXTAREA 
    const [newImageURL, setNewImageURL] = useState(""); // VALUE OF IMAGE URL INPUT
    const [entryLength, setEntryLength]= useState(0); // LENGTH OF POST IN TEXTAREA. MAX 10,000 CHARACTERS
    const currentDate = moment().format('lll'); // DATE FORMAT FOR ENTRIES

    useEffect(() => {

        if (!initialized.current) { // MAKES SURE USEFFECT TRIGGERS ONLY ONCE
            initialized.current = true

        document.querySelector("textarea").placeholder = `Hello, ${user}. What's on Your Mind?`; // SETS TEXTAREA PLACEHOLDER WITH USERNAME SO USER KNOWS LOGIN IS SUCCESSFULL

        // PULLS ALL USER ENTRIES FROM DATABASE
        axios.get('https://openbook.azurewebsites.net/posts/username', { // PULL THEIR POSTS
            params: {
                author: user, // SPECIFIC SEARCH FOR USER
            } 
            }).then(
                response => {
                    response.data.forEach(currentEntry => {
                        // ADDS ENTRIES TO ENTRIES USESTATE
                            setEntries((entries) => {
                                const text = currentEntry.text.split("\n"); // SPLITS UP PARAGRAPHS
                                return [...entries, { id: currentEntry._id, title: currentEntry.title, imageURL: currentEntry.imageURL, entry: text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count, comments: currentEntry.comments }];
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

    // USE EFFECT FOR ASIDES LINKED LIST
    useEffect(() => {
        const intervalId = setInterval(promptNext, 15000); // calls promptNext every 10 seconds

            return () => {
                clearInterval(intervalId); // clears the interval after unmount or useEffect dependancies change for cleanup purposes
            };
    }, [])

    // FUNCTION FOR ADDING A NEW ENTRY FROM USER
    function handleEntry(e) {
        e.preventDefault();

        // POSTS THE NEW ENTRY TO THE DATABASE
        axios.post('https://openbook.azurewebsites.net/posts/', { // MAKE A NEW ENTRY
        author: user,
        imageURL: newImageURL,
        title: newTitle,
        text: newEntry,
        date: currentDate
        }).then(
            response => {
                console.log(response.data);
                axios.get('https://openbook.azurewebsites.net/posts/username-recent', { // GRABS THE POST WE JUST MADE TO THE DATABASE
                    params: {
                    author: user, // SPECIFIC SEARCH FOR USER
                } 
                }).then(
                    response => {
                        setEntries((currentEntries) => { // RENDERS NEW POST ON THE SCREEN
                            const text = response.data[0].text.split("\n"); // SPLITS UP PARAGRAPHS
                            return [...currentEntries, { id: response.data[0]._id, title: response.data[0].title, imageURL: response.data[0].imageURL, entry: text, date: response.data[0].date, L: response.data[0].likes.count, D: response.data[0].dislikes.count, comments: response.data[0].comments }];
                         });
                        // CLEARS FORM VALUES
                        setNewTitle("");
                        setNewEntry("");
                        setNewImageURL("");
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

    //FUNCTION FOR DELETING AN ENTRY
    function deleteEntry(id) {
        // DELETES ENTRY BY UNIQUE ID
        axios.delete('https://openbook.azurewebsites.net/posts/id', {params: {id: id }}).then(
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

    // FUNCTION FOR DELETING A COMMENT
    function handleCommentDelete(id, author) {
        // A USER CAN ONLY HAVE ONE COMMENT ON EACH ENTRY, SO IF ANOTHER COMMENT BY THAT USER EXISTS, REMOVE IT
        axios.patch('https://openbook.azurewebsites.net/posts/remove-comment',{ id: id, username: author }) // CALL TO REMOVE EXISTING COMMENT FROM USER
        .catch(error => {
            console.log(error.message);
            return;
        }).then(response => {
            console.log(response.data);
            // RENDER COMMENTS ON THE SCREEN
            const newArray = entries.map((entry) => {
                if (id === entry.id){ // UPDATES USESTATE BASED ON WHICH ACTIONS WERE TAKEN IN THE DATABASE
                    let newComments = entry.comments.filter(function(com) {return com.author !== author;}); // FILTERS OUT OLD COMMENT
                    entry.comments = newComments; // 
                }
                return entry;
            });
            setEntries(newArray);
        })
    }

    // initialize the new linked list for left
    const leftPromptsList = new LinkedList();

    //sample left prompts
    leftPromptsList.insert("What is a childhood memory that stands out to you... like your favorite flavor of paint chips or how you used to collect old toenails in a jar.");
    leftPromptsList.insert("Write about one of your favorite hobbies... just so we're clear, binging Netflix ISN'T a hobby.");
    leftPromptsList.insert("Imagine you were trapped inside of this website, forced to write nonsense prompts. How would you escape? I'm serious.");
    leftPromptsList.insert("If you could have any superpower, what would it be? ...Like the power to open cans without a can opener, leaving a trail of mucus while you walk like a slug, or being able to detect the coolest party in a 100 mile radius that you weren't invited to.");
    leftPromptsList.insert("Create a fake conspiracy theory...like the flat earth conspiracy was made to distract people from the fact that the earth is actually donut shaped.");
    leftPromptsList.insert("You have been elected the leader of your country, what is the first thing you do? Declare a new holiday? Lower taxes? Raise taxes? Nuclear war?");
    leftPromptsList.insert("If you were a realtor trying to sell a haunted house, what information do you think you'd have to illegally withhold from your client in order to successfully close on that home?");
    leftPromptsList.insert("Post about your typical day, unless it's boring... in that case, just make something up...");

    // initialize new linked list for right
    const rightPromptsList = new LinkedList();

    //right sample prompts
    rightPromptsList.insert("Describe a dream you had recently... or describe that nightmare where you're running from an army of cannibal clowns, you're late for your driving test, and when you look down you aren't wearing pants.");
    rightPromptsList.insert("Answer an age-old question like \"could you beat a lion in a fist fight?\"... I mean, obviously yes. Lions can't make fists.");
    rightPromptsList.insert("Write about your dream career... Then make a list of ACTIONABLE steps that you can take to make your dreams a reality.");
    rightPromptsList.insert("What are three things you'd like the change about yourself? I know, this prompt is intense, right?");
    rightPromptsList.insert("Describe your most embarrassing moment in excruciating detail... and don't hold back on the cringe.");
    rightPromptsList.insert('Answer an age-old question like "could you beat a lion in a fist fight?"... I mean, obviously yes. Lions can\'t make fists.');
    rightPromptsList.insert("Write a eulogy for your favorite pair of socks... because they've been through a lot, okay?");
    rightPromptsList.insert("Post about your typical day, unless it's boring... in that case, just make something up...");

    // gets the current prompts for the asides
    const [currentPrompts, setCurrentPrompts] = useState({
        left: leftPromptsList.getCurrent(),
        right: rightPromptsList.getCurrent()
    });

    // FUNCTION FOR MOVING THROUGH LINKED LIST
    function promptNext() {
        leftPromptsList.resetOrNext(); // reset at end, move to the next otherwise for right and left
        rightPromptsList.resetOrNext(); 
        setCurrentPrompts({
            left: leftPromptsList.getCurrent(),
            right: rightPromptsList.getCurrent()
        });
    }

    return (
        <>  {/* HTML for the homepage */}
            <div className="homepage-container">
                <aside className="left-aside">
                    <p className="sample-text">{currentPrompts.left}</p>
                </aside>
                <div id="middle-container">
                    {/* handling and organizing of creation center */}
                    <form id="new-entry-form" onSubmit={(e) => {handleEntry(e)}}>
                        <label htmlFor="title">New Journal Entry</label>
                        <input type="text" id="title" placeholder="Entry Title:"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                         maxLength={30} required/>
                        <input type="text" id="image" placeholder="Image URL (Optional):"
                            value={newImageURL}
                            onChange={e => setNewImageURL(e.target.value)}
                         maxLength={500} />
                         {/* setting limits for the optional image with the user post */}
                        <textarea rows="4"
                            value={newEntry} maxLength={10000}
                            onChange={e => { setNewEntry(e.target.value); setEntryLength(e.target.value.length) }} required></textarea>
                            <p id="entry-length">Character Limit: {entryLength}/10000</p>
                        <button id="post-entry" className="btn">Post Journal Entry</button>
                    </form>
                    <div id="entries-container">
                        {entries.toReversed().map((entry) => {
                            return (
                                <div className="entry-container" key={entry.id}>
                                    <div className="entries">
                                        <h2 className="current-entry-title">{entry.title}</h2>
                                        <h3 className="current-entry-title">Posted on {moment(entry.date).format('lll')}</h3>
                                        {
                                            entry.imageURL ? <img  className="entry-image" src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS
                                        }
                                        { entry.entry.map((paragraph, index) => { return ( <p className="current-entry" key={"p" + index}>{paragraph}</p>);})}
                                        <p className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></p>
                                        {/* formatting for home page with title, paragraph, image, cool/cringe ratings */}
                                        { 
                                            entry.comments.length > 0 ? entry.comments.toReversed().map((comment, index) => { return ( 
                                                <div className="comment-container" key={"c" + index}>
                                                    <p className="current-comment">{comment.comment}</p> 
                                                    <button className="delete" style={{justifySelf: "start"}} onClick={()=>{handleCommentDelete(entry.id, comment.author)}}>X</button>
                                                </div>
                                            );}) : <p className="no-comment">There Are No Comments On This Post</p> 
                                        }
                                        <button className="delete" onClick={() => deleteEntry(entry.id)}>Delete Journal Entry</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <aside className="right-aside">
                    <p className="sample-text">{currentPrompts.right}</p>
                </aside>
                {/* including prompts to give users an idea to write about */}
            </div>
        </>
    );
}
