import { useState, useEffect, useRef } from "react"
import moment from "moment"
import Cookies from 'js-cookie'
import axios from "axios"


export function Snoop() {

    const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED
    const initialized = useRef(false); // RE-USABLE HOOK TO MAKE SURE THINGS DON'T DOUBLE LOAD AT START

    const [entries, setEntries] = useState([])

    useEffect(()=>{ // CODE TO PULL USER ENTRIES FROM THE DATABASE

        if (!initialized.current) {
            initialized.current = true

            axios.get('http://localhost:5000/posts/random', {params: {
                username: user, // MAKES SURE YOU CAN'T SEE YOUR OWN POSTS
                }}).then( // SEARCH FOR A RANDOM USER
            response => {
                console.log(response.data);
                const username = response.data[0].author; // USERNAME VARIABLE FOR RANDOM USER
                console.log("USERNAME: " + username);

                axios.get('http://localhost:5000/posts/username', { // PULL THEIR POSTS
                params: {
                author: username, // SPECIFIC SEARCH FOR RANDOM USER
                } 
                }).then(
                    response => {
                        response.data.forEach(currentEntry => {

                            const didLike = currentEntry.likes.users.includes(user); // CHECKS TO SEE IF THE USER HAS LIKED THE POST
                            const didDislike = currentEntry.dislikes.users.includes(user); // CHECKED TO SEE IF THE USER HAS DISLIKED THE POST

                            setEntries((entries) => {
                                    return [...entries, { id: currentEntry._id, title: currentEntry.title, entry: currentEntry.text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count, didL: didLike, didD: didDislike }];
                            });
                        });
                    }
                    ).catch(error => {
                        console.log(error.message);
                        return;
                        })
            }).catch(error => {
                console.log(error.message);
            })  
        }    
    }, [])


    function addLikeDislike(e, id, isLike) {

        e.preventDefault();

        let option; // OPTION FOR HOW TO UPDATE THE PAGE AFTER CHANGE

        axios.get('http://localhost:5000/posts/id', {
            params: {
                id: id
            }
        }).then (
            response => {
                // USER ALREADY LIKED
                if (response.data[0].likes.users.includes(user)) {
                    option = 1;
                    // remove like
                    axios.patch('http://localhost:5000/posts/likes',
                        {
                            count: response.data[0].likes.count - 1, // DECREMENT
                            users: response.data[0].likes.users.filter(u => u != user) // REMOVE USER
                        },
                        {
                            params: {
                                id: id
                            }
                        }   
                    ).catch(error => {
                        console.log(error.message);
                        return;
                    })

                    if(!isLike) {
                        option = 2;
                        // add dislike
                    axios.patch('http://localhost:5000/posts/dislikes',
                    {
                        count: response.data[0].dislikes.count + 1, // INCREMENT
                        users: [...response.data[0].dislikes.users, user] // ADD USER
                    },
                    {
                        params: {
                            id: id
                        }
                    }   
                    ).catch(error => {
                        console.log(error.message);
                        return;
                    })
                }
                }
                // USER ALREADY DISLIKED
                else if (response.data[0].dislikes.users.includes(user)) {
                    option = 3;
                    // remove dislike
                    axios.patch('http://localhost:5000/posts/dislikes',
                        {
                            count: response.data[0].dislikes.count - 1, // DECREMENT
                            users: response.data[0].dislikes.users.filter(u => u != user) // REMOVE USER
                        },
                        {
                            params: {
                                id: id
                            }
                        }   
                    ).catch(error => {
                        console.log(error.message);
                        return;
                    })

                    if(isLike) {
                        option = 4;
                        // add like
                    axios.patch('http://localhost:5000/posts/likes',
                    {
                        count: response.data[0].likes.count + 1, // INCREMENT
                        users: [...response.data[0].likes.users, user] // ADD USER
                    },
                    {
                        params: {
                            id: id
                        }
                    }   
                    )}
                }
                // USER HASNT LIKED/DISLIKED
                else {
                    if(isLike) {
                        option = 5;
                        // add like
                    axios.patch('http://localhost:5000/posts/likes',
                    {
                        count: response.data[0].likes.count + 1, // INCREMENT
                        users: [...response.data[0].likes.users, user] // ADD USER
                    },
                    {
                        params: {
                            id: id
                        }
                    }   
                    )} else {
                        option = 6;
                        axios.patch('http://localhost:5000/posts/dislikes',
                        {
                            count: response.data[0].dislikes.count + 1, // INCREMENT
                            users: [...response.data[0].dislikes.users, user] // ADD USER
                        },
                        {
                            params: {
                                id: id
                            }
                        }   
                        )}
                }

                // reload post on front end
                updatePost(id, option);


            }
        ).catch(error => {
            console.log(error.message);
            return;
        })
    }

    function updatePost(id, option) {
        const newArray = entries.map((entry) => {
            if (id === entry.id){ // UPDATES USESTATE BASED ON WHICH ACTIONS WERE TAKEN IN THE DATABASE
                if(option === 1) { // ALREADY LIKED
                    entry.L--;
                    entry.didL = false;
                } else if(option === 2) { // ALREADY LIKED + NOW DISLIKED
                    entry.L--;
                    entry.didL = false;
                    entry.D++;
                    entry.didD = true;
                } else if(option === 3) { // ALREADY DISLIKED
                    entry.D--;
                    entry.didD = false;
                } else if(option === 4) { // ALREADY DISLIKED + NOW LIKED
                    entry.D--;
                    entry.didD = false;
                    entry.L++;
                    entry.didL = true;
                } else if(option === 5) { // NOW LIKED
                    entry.L++;
                    entry.didL = true;
                } else { // NOW DISLIKED
                    entry.D++;
                    entry.didD = true;
                }
            }
            return entry;
          });
          setEntries(newArray);
    }

    return <>
        <div className = "homepage-container">
        <aside className="left-aside">
            <p className="sample-text">Left Aside Content</p>
        </aside>
        <div>

    {entries.toReversed().map(entry => {

        return <div className="entry-container" key={entry.id}>
            <p className="entries">
                <span className="current-entry-title">{entry.title} ({moment(entry.date).format('lll')}):</span>
                {
                    entry.imageURL ? <img src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS. IF ONERROR URL IS BAD SO DISPLAY NONE
                }
                <span className="current-entry">{entry.entry}</span>
                <span className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></span>
            </p>
                <div className="rating">
                    { 
                    user ? <p className="like" style={ entry.didL ? {color: "lightgreen"} : {color: "inherit"}} onClick={(e)=>{addLikeDislike(e, entry.id, true)}}><a href="#">cool</a></p> : ""
                    }
                    { 
                    user ? <p className="dislike" style={ entry.didD ? {color: "lightcoral"} : {color: "inherit"}} onClick={(e)=>{addLikeDislike(e, entry.id, false)}}><a href="#">cringe</a></p> : ""
                    }
                </div>
        </div>
    })}
    <br></br>
    </div>
    <aside className="right-aside">
        <p className="sample-text">Right Aside Content</p>
    </aside>
    </div>
    </>
   }
