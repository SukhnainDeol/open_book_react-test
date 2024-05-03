import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import moment from "moment"
import { useAuth } from '../contexts/auth-context'
import { ToggleTheme } from "./ToggleTheme"


export function Snoop() {

    // AUTH FUNCTIONS ----------------------------------------------------------------------------------------------------------------------

    const navigate = useNavigate();

    const {
        user, 
        setUser,
        loggedIn,
        setLoggedIn
    } = useAuth()

    console.log("LOGGED IN STATUS: " + loggedIn);
    console.log("USER: " + user.Username);

    function HandleLogOut(e) {
        e.preventDefault()

        // RESETS CONTEXT
        setLoggedIn(false)
        setUser({Username: ""})


        navigate('/') // NAVIGATES TO LOGIN PAGE WHEN USER LOGS OUT

    }

    const currentDate = moment().format('l'); // CURRENT DATE FORMAT WITH MOMENT.JS

    const [entries, setEntries] = useState([{id: Math.random(), title: "First Post", entry: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae arcu et metus iaculis finibus eget a neque. Mauris in tempor justo. Vestibulum lobortis justo a cursus vestibulum. Sed quis nulla maximus, facilisis ipsum ac, porttitor nulla. Cras et euismod est. Sed suscipit nunc id pretium mollis. In luctus eros vitae hendrerit imperdiet. Proin fringilla felis vitae neque efficitur, nec mattis ante varius. Aenean mollis sit amet ante nec imperdiet. Phasellus a mauris pretium felis aliquet blandit. Vestibulum lacinia, ante at pharetra dignissim, eros massa dictum massa, pretium tincidunt ex mi nec erat. Sed eu blandit lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", date: currentDate},{id: Math.random(), title: "Second Post", entry: "Sed fringilla turpis eu risus vestibulum faucibus. Ut lectus diam, ultricies eget turpis eget, condimentum vulputate nisl. Nulla facilisi. Mauris nec sem at nibh sodales posuere vitae vitae est. Curabitur semper felis sit amet metus maximus, nec interdum lacus bibendum. Nunc fermentum, felis sit amet tristique feugiat, diam lorem scelerisque ex, sed pulvinar diam lacus non risus. Proin mauris enim, fermentum quis condimentum id, consectetur porta libero. Phasellus urna urna, pellentesque a elementum eget, ullamcorper vel nulla.", date: currentDate}])

    return <>
        <nav>
            <ul className="nav-list">
                <li><Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}>Home</Link></li>
                <li><Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>Snoop</Link></li>
                <li><ToggleTheme /></li>
                <li><Link to="#" style={{ textDecoration: 'none', color: 'black' }} onClick={(e) => {HandleLogOut(e)}}>Log Out</Link></li>
            </ul>  
        </nav>
        <div className = "homepage-container">
        <aside className="left-aside">Left Aside Content</aside>
        <div>

    {entries.reverse().map(entry => {

        return <div className="entry-container" key={entry.id}>
            <p className="entries">
                <span className="current-entry-title">{entry.title} ({entry.date}):</span>
                <span className="current-entry">{entry.entry}</span></p>
                <div className="rating">
                    <p className="like"><a href="#">cool</a></p> 
                    <p className="dislike"><a href="#">cringe</a></p>
                </div>
        </div>
    })}
    <br></br>
    </div>
    <aside className="right-aside">Right Aside Content</aside>
    </div>
    </>
   }
