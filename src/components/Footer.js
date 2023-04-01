import "./footer.css"
import "./global.css"

import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Footer = (props) => {
    const { isLoggedIn } = props;
    const navigate = useNavigate();


    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        props.setIsLoggedIn(false);
        navigate('/');
    }

    return(
        <footer>
            <div id="containerNeededToCenterFooterBackgroundContainer">
                <div id="footerBackgroundContainer">
                    <div id="footerContents">
                        <div id="blueSquare"></div>
                        <div id="footerButtonGroup">
                            <Link to='/' className="footerButton"> MENU </Link>
                            <Link to='/locations' className="footerButton"> LOCATIONS </Link> 
                            {isLoggedIn ?<Link onClick={handleLogout} className="footerButton"> LOGOUT </Link>: <Link to='/login' className="footerButton"> LOGIN </Link> }
                            <div id="whiteSquare1" className="footerButton"></div>
                            <div id="whiteSquare2" className="footerButton"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer