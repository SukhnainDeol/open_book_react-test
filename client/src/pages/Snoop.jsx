import { Link } from "react-router-dom"
import { useState } from "react"
import moment from "moment"
import { ToggleTheme } from "./ToggleTheme" // toggle theme


export function Snoop() {

    const currentDate = moment().format('l'); // CURRENT DATE FORMAT WITH MOMENT.JS

    const [entries, setEntries] = useState([{id: Math.random(), title: "First Post", entry: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae arcu et metus iaculis finibus eget a neque. Mauris in tempor justo. Vestibulum lobortis justo a cursus vestibulum. Sed quis nulla maximus, facilisis ipsum ac, porttitor nulla. Cras et euismod est. Sed suscipit nunc id pretium mollis. In luctus eros vitae hendrerit imperdiet. Proin fringilla felis vitae neque efficitur, nec mattis ante varius. Aenean mollis sit amet ante nec imperdiet. Phasellus a mauris pretium felis aliquet blandit. Vestibulum lacinia, ante at pharetra dignissim, eros massa dictum massa, pretium tincidunt ex mi nec erat. Sed eu blandit lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.", date: currentDate},{id: Math.random(), title: "Second Post", entry: "Sed fringilla turpis eu risus vestibulum faucibus. Ut lectus diam, ultricies eget turpis eget, condimentum vulputate nisl. Nulla facilisi. Mauris nec sem at nibh sodales posuere vitae vitae est. Curabitur semper felis sit amet metus maximus, nec interdum lacus bibendum. Nunc fermentum, felis sit amet tristique feugiat, diam lorem scelerisque ex, sed pulvinar diam lacus non risus. Proin mauris enim, fermentum quis condimentum id, consectetur porta libero. Phasellus urna urna, pellentesque a elementum eget, ullamcorper vel nulla.", date: currentDate}])

    return <>
        <nav>
            <Link to="/homepage" style={{ textDecoration: 'none', color: 'black' }}>Home</Link>
            <Link to="/snoop" style={{ textDecoration: 'none', color: 'black' }}>"Snoop"</Link>
            <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>Log Out</Link>
        </nav>

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
    <ToggleTheme />
    </>
   }
