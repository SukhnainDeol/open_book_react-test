import { useState, useEffect, useRef } from "react"
import moment from "moment"
import Cookies from 'js-cookie'
import axios from "axios"


export function WallOfFame() {

    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    const [likedEntries, setLikedEntries] = useState([])
    const [dislikedEntries, setDislikedEntries] = useState([])


    useEffect(()=>{ // CODE TO PULL USER ENTRIES FROM THE DATABASE

        if (!initialized.current) {
            initialized.current = true


            // LOAD MOST LIKED ENTRIES
            axios.get('http://localhost:5000/posts/liked').then(
                response => {
                    response.data.forEach(currentEntry => {

                        const didLike = currentEntry.likes.users.includes(user); // CHECKS TO SEE IF THE USER HAS LIKED THE POST
                        const didDislike = currentEntry.dislikes.users.includes(user); // CHECKED TO SEE IF THE USER HAS DISLIKED THE POST

                        setLikedEntries((entries) => {
                            const text = currentEntry.text.split("\n"); // SPLITS UP PARAGRAPHS
                                return [...entries, { id: currentEntry._id, title: currentEntry.title, imageURL: currentEntry.imageURL, entry: text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count, didL: didLike, didD: didDislike }];
                });
                    });
                }
                ).catch(error => {
                    console.log(error.message);
                    return;
                })

            // LOAD MOST DISLIKED ENTRIES
            axios.get('http://localhost:5000/posts/disliked').then(
                response => {
                    response.data.forEach(currentEntry => {

                        const didLike = currentEntry.likes.users.includes(user); // CHECKS TO SEE IF THE USER HAS LIKED THE POST
                        const didDislike = currentEntry.dislikes.users.includes(user); // CHECKED TO SEE IF THE USER HAS DISLIKED THE POST

                        setDislikedEntries((entries) => {
                            const text = currentEntry.text.split("\n"); // SPLITS UP PARAGRAPHS
                                return [...entries, { id: currentEntry._id, title: currentEntry.title, imageURL: currentEntry.imageURL, entry: text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count, didL: didLike, didD: didDislike }];
                });
                    });
                }
                ).catch(error => {
                    console.log(error.message);
                    return;
                })
        }    
    }, [])



    return <>
    <div className = "wof-container">

        <div className="liked-container">

            <h1 style={{"textAlign": "center"}}>Hall of Fame</h1>
            {likedEntries.toReversed().map(entry => {

                return <div className="entry-container" key={entry.id}>
                    <p className="entries">
                        <span className="current-entry-title">{entry.title} ({moment(entry.date).format('lll')}):</span>
                        {
                            entry.imageURL ? <img src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS. IF ONERROR URL IS BAD SO DISPLAY NONE
                        }
                        <span className="current-entry">{entry.entry}</span>
                        <span className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></span>
                    </p>

                </div>
            })}
        </div>
        
        
        <div className="entry-container"></div>
        
        
        <div className="disliked-container">

            <h1 style={{"textAlign": "center"}}>Hall of Shame</h1>
            {dislikedEntries.toReversed().map(entry => {

                return <div className="entry-container" key={entry.id}>
                    <p className="entries">
                        <span className="current-entry-title">{entry.title} ({moment(entry.date).format('lll')}):</span>
                        {
                            entry.imageURL ? <img src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS. IF ONERROR URL IS BAD SO DISPLAY NONE
                        }
                        <span className="current-entry">{entry.entry}</span>
                        <span className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></span>
                    </p>

                </div>
            })}
        </div>

    </div>
    </>
   }
