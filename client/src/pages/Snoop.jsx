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
                            setEntries((entries) => {
                                    return [...entries, { id: currentEntry._id, title: currentEntry.title, entry: currentEntry.text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count }];
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


    function addLike(id) {

        axios.get('http://localhost:5000/posts/id', {
            params: {
                id: id
            }
        }).then (
            response => {
                // USER ALREADY LIKED
                if (response.data[0].likes.users.includes(user)) {
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
                    )
                }
                // USER ALREADY DISLIKED
                else if (response.data[0].dislikes.users.includes(user)) {
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
                    )

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
                    )
                }
                // USER HASNT LIKED/DISLIKED
                else {
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
                    )
                }

                // reload post on front end
            }
        ).catch(error => {
            console.log(error.message);
            return;
        })
    }


    function addDislike(id) {

        axios.get('http://localhost:5000/posts/id', {
            params: {
                id: id
            }
        }).then (
            response => {
                // USER ALREADY DISLIKED
                if (response.data[0].dislikes.users.includes(user)) {
                    // remove like
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
                    )
                }
                // USER ALREADY LIKED
                else if (response.data[0].likes.users.includes(user)) {
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
                    )

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
                    )
                }
                // USER HASNT LIKED/DISLIKED
                else {
                    // add like
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
                    )
                }

                // reload post on front end
            }
        ).catch(error => {
            console.log(error.message);
            return;
        })
    }


    return <>
        <div className = "homepage-container">
        <aside className="left-aside">
            <p className="sample-text">Left Aside Content</p>
        </aside>
        <div>

    {entries.reverse().map(entry => {

        return <div className="entry-container" key={entry.id}>
            <p className="entries">
                <span className="current-entry-title">{entry.title} ({moment(entry.date).format('lll')}):</span>
                <span className="current-entry">{entry.entry}</span>
                <span className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></span>
            </p>
                <div className="rating">
                    <p className="like" onClick={()=>{addLike(entry.id)}}><a href="#">cool</a></p> 
                    <p className="dislike" onClick={()=>{addDislike(entry.id)}}><a href="#">cringe</a></p>
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
