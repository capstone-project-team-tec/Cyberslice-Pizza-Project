import "./header.css"
import "./global.css"

import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Header = (props) => {
    const { isLoggedIn } = props;
    const navigate = useNavigate();


    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        props.setIsLoggedIn(false);
        navigate('/');
    }

    return(
        <header>
            <img id="headerLogo" src="/logo.png" alt="Fitness Tracker logos"/>
            <div id="headerButtonGroup">   
                <Link to='/' className="headerButton"> MENU </Link>
                <Link to='/locations' className="headerButton"> LOCATIONS </Link> 
                {isLoggedIn ?<Link onClick={handleLogout} className="headerButton"> LOGOUT </Link>: <Link to='/login' className="headerButton"> LOGIN </Link> }
                <Link to='/checkout' className="headerButton"> <svg id="cartIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 144"><defs><style>.c</style></defs><g id="b"><path className="c" d="M81.59,96.25c-12.83,0-25.66,0-38.49,0-5.9,0-8.56,1.55-8.44,4.82,.11,3.09,2.72,4.53,8.26,4.53,25.66,0,51.32,0,76.98,0,1.34,0,2.69,0,4.03,.04,1.79,.06,3.4,.66,3.4,3,0,2.39-1.76,2.81-3.45,3.02-.89,.11-1.79,.09-2.68,.09-25.96,0-51.92,.02-77.88-.02-1.93,0-3.86-.32-5.79-.53-4.23-.46-6.75-3.24-7.96-7.57-1.2-4.29-.06-8.28,3.1-10.61,3.3-2.44,3.39-4.99,2.64-8.8-4.64-23.63-9.06-47.31-13.57-70.97-.85-4.46-.88-4.5-4.91-4.54-3.43-.04-6.86,.07-10.28,.03-1.7-.02-3.57-.29-3.56-2.74,0-2.62,1.86-3.07,3.81-3.06,4.92,.03,9.85,.17,14.77,.06,2.98-.07,4.36,1.51,4.81,4.58,.26,1.8,.64,3.57,.97,5.36,.94,5.15,.94,5.19,5.86,5.19,33.57,0,67.13,0,100.7-.01,7.58,0,7.92,.37,6.42,8.39-3.95,21.25-7.95,42.49-11.96,63.72-1.06,5.63-1.48,5.98-6.94,5.98-13.28,.02-26.56,0-39.83,0ZM135,24.73H30.09c.15,1.86,.14,3.31,.4,4.7,3.46,18.47,6.95,36.94,10.46,55.4,.98,5.18,1.01,5.21,5.88,5.22,23.7,.02,47.41,.03,71.12,.01,4.72,0,4.81-.14,5.81-5.36,2.59-13.6,5.2-27.2,7.77-40.81,1.18-6.27,2.29-12.55,3.49-19.17Z"/></g><path className="c" d="M54.02,141.02c-6.69,0-12.13-6.05-12.13-13.48s5.44-13.47,12.13-13.47,12.13,6.04,12.13,13.47-5.44,13.48-12.13,13.48Zm0-20.98c-3.72,0-6.75,3.37-6.75,7.5s3.03,7.5,6.75,7.5,6.75-3.37,6.75-7.5-3.03-7.5-6.75-7.5Z"/><path className="c" d="M106.56,141.02c-6.69,0-12.13-6.05-12.13-13.48s5.44-13.47,12.13-13.47,12.13,6.04,12.13,13.47-5.44,13.48-12.13,13.48Zm0-20.98c-3.72,0-6.75,3.37-6.75,7.5s3.03,7.5,6.75,7.5,6.75-3.37,6.75-7.5-3.03-7.5-6.75-7.5Z"/>
                </svg> </Link>
            </div>  
        </header>
    )
}

export default Header