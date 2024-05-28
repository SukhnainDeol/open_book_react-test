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

                        setLikedEntries((entries) => {
                            const text = currentEntry.text.split("\n"); // SPLITS UP PARAGRAPHS
                                return [...entries, { id: currentEntry._id, title: currentEntry.title, imageURL: currentEntry.imageURL, entry: text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count}];
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

                        setDislikedEntries((entries) => {
                            const text = currentEntry.text.split("\n"); // SPLITS UP PARAGRAPHS
                                return [...entries, { id: currentEntry._id, title: currentEntry.title, imageURL: currentEntry.imageURL, entry: text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count}];
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
    <div className = "wof">

        <div className="wof-sub">

            <h1 style={{textAlign: "center"}}><u>Hall of Fame</u></h1>
            {likedEntries.map(entry => {

                return <div className="wof-container" key={entry.id}>
                    <div className="entries" style={{width: "100%"}}>
                        <h4 className="current-entry-title">{entry.title}</h4>
                        <h4 className="current-entry-title">Posted on {moment(entry.date).format('lll')}</h4>
                        {
                            entry.imageURL ? <img src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS. IF ONERROR URL IS BAD SO DISPLAY NONE
                        }
                        { entry.entry.map((paragraph, index) => { return ( <p className="current-entry" key={"p" + index}>{paragraph}</p>);})}
                        <p className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></p>
                    </div>
                </div>
            })}
        </div>
        
        
        <div className="wof-sub">

            <h1 style={{textAlign: "center"}}><u>Hall of Shame</u></h1>
            {dislikedEntries.map(entry => {

                return <div className="wof-container" key={entry.id}>
                    <div className="entries" style={{width: "100%"}}>
                        <h4 className="current-entry-title">{entry.title}</h4>
                        <h4 className="current-entry-title">Posted on {moment(entry.date).format('lll')}</h4>
                        {
                            entry.imageURL ? <img src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS. IF ONERROR URL IS BAD SO DISPLAY NONE
                        }
                        { entry.entry.map((paragraph, index) => { return ( <p className="current-entry" key={"p" + index}>{paragraph}</p>);})}
                        <p className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></p>
                    </div>

                </div>
            })}
        </div>

    </div>
    </>
   }