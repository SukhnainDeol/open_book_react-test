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
                                const text = currentEntry.text.split("\n"); // SPLITS UP PARAGRAPHS
                                    return [...entries, { id: currentEntry._id, title: currentEntry.title, imageURL: currentEntry.imageURL, entry: text, date: currentEntry.date, L:  currentEntry.likes.count, D:  currentEntry.dislikes.count, didL: didLike, didD: didDislike, comments: currentEntry.comments }];
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

    function handleAddComment(e, comment, id) {
        e.preventDefault();
        const user = Cookies.get("username"); // COOKIE WILL BE ESTABLISHED IF LOGIN IS WORKED

        if(comment.length === 0) { // IF THE COMMENT IS AN EMPTY STRING, DO NOTHING
            console.log("EMPTY STRING");
            return;
        }

        axios.patch('http://localhost:5000/posts/remove-comment',{ id: id, username: user }) // CALL TO REMOVE EXISTING COMMENT FROM USER
        .catch(error => {
            console.log(error.message);
            return;
        }).then(response => {
            axios.patch('http://localhost:5000/posts/add-comment',{ id: id, comment: comment, username: user }) // CALL TO ADD NEW COMMENT
            .catch(error => {
                console.log(error.message);
                return;
             }).then(response => {
            // RENDER COMMENTS ON THE SCREEN
                const newArray = entries.map((entry) => {
                if (id === entry.id){ // UPDATES USESTATE BASED ON WHICH ACTIONS WERE TAKEN IN THE DATABASE
                    let newComments = entry.comments.filter(function(com) {return com.author !== user;}); // FILTERS OUT OLD COMMENT
                    newComments.push({author: user, comment: comment});  // ADDS NEW COMMENT
                    entry.comments = newComments; // 
                }
                return entry;
                });
                setEntries(newArray);
            })
        })
    }

    function handleCommentDelete(id) {

        axios.patch('http://localhost:5000/posts/remove-comment',{ id: id, username: user }) // CALL TO REMOVE EXISTING COMMENT FROM USER
        .catch(error => {
            console.log(error.message);
            return;
        }).then(response => {
            // RENDER COMMENTS ON THE SCREEN
            const newArray = entries.map((entry) => {
                if (id === entry.id){ // UPDATES USESTATE BASED ON WHICH ACTIONS WERE TAKEN IN THE DATABASE
                    let newComments = entry.comments.filter(function(com) {return com.author !== user;}); // FILTERS OUT OLD COMMENT
                    entry.comments = newComments; // 
                }
                return entry;
            });
            setEntries(newArray);
        })
    }

    return <>

    {entries.toReversed().map(entry => {

        return <div className="snoop" style={user ? {diplsay: "grid"} : {display: "block"}} key={entry.id}>
            <div className="entries" style={ user ? {width: "100%"} : {width: "100%"}}>
                <h2 className="current-entry-title">{entry.title}</h2>
                {/* including the date and time a creation is posted */}
                <h3 className="current-entry-title">Posted on {moment(entry.date).format('lll')}</h3>
                {
                    entry.imageURL ? <img className="entry-image" src={entry.imageURL} onError={(e) => {e.currentTarget.style.display="none";}} /> : "" // ONLY ADD AN IMAGE IF IT EXISTS.
                }
                { entry.entry.map((paragraph, index) => { return ( <p className="current-entry" key={index}>{paragraph}</p>);})}
                <p className="cc">Cool: <span className="cool">{entry.L}</span> Cringe: <span className="cringe">{entry.D}</span></p>
                <div className="comment-section">
                    { user ? <form onSubmit={(e)=>{handleAddComment(e, e.target.children[0].value, entry.id); e.target.children[0].value = "";}}>
                                <textarea placeholder="[ Comment on This Post ]" style={{ margin: "10px auto", padding: "5px", width: "80%"}} maxLength={200}></textarea>
                                <button className="btn">Post Comment</button>
                            </form> : ""
                    }
                    {/* commenting for user to be able to share their ideas */}
                    { 
                    entry.comments.length > 0 ? entry.comments.toReversed().map((comment, index) => { return (
                        <div className="comment-container" key={"c" + index}>
                            <p className="current-comment">{comment.comment}</p> 
                            {
                                comment.author === user ? <button className="delete" style={{justifySelf: "start"}} onClick={()=>{handleCommentDelete(entry.id)}}>X</button> : ""
                            }
                        </div>);}) 
                    : <p className="no-comment">There Are No Comments On This Post</p> 
                    }
                    {/* displaying message if there are no comments on a post */}
                </div>
            </div>
                <div className="rating" style={{justifySelf: "left"}}>
                    { 
                    user ? <p className="like" style={ entry.didL ? {color: "lightgreen"} : {color: "inherit"}} onClick={(e)=>{addLikeDislike(e, entry.id, true)}}><a href="#">cool</a></p> : ""
                    }
                    { 
                    user ? <p className="dislike" style={ entry.didD ? {color: "lightcoral"} : {color: "inherit"}} onClick={(e)=>{addLikeDislike(e, entry.id, false)}}><a href="#">cringe</a></p> : ""
                    }
                </div>
        </div>
    })}
    </>
   }