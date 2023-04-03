import "./menu.css"
import "./global.css"

import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Menu = (props) => {
    const { isLoggedIn } = props;
    const navigate = useNavigate();


    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        props.setIsLoggedIn(false);
        navigate('/');
    }

    return(
        <div id="menuComponent">
            <div id="menuTitleContainer">
                <h1 id="menuTitle"> Menu </h1>
            </div>
            <div id="buildYourOwnPizzaButton">
                <Link to='/pizza'> 
                    <img id="buildYourOwnPizzaPic" src="/buildYourOwnPizza.jpg" alt="Build Your Own Pizza Image"></img> 
                    <div className="buttonTextPizza">BUILD YOUR OWN PIZZA</div>
                </Link>
            </div>
            <div id="sidesDessertsDrinksButtonGroup">
                <Link to='/sides'>
                    <div className="sidesDessertsDrinksButton">
                        <img className="sidesDessertsDrinksButtonPic" src="/sides.jpg" alt="Sides Image"></img>
                        <div className="buttonText">SIDES</div>
                    </div>
                </Link>
                <Link to='/drinks'>
                    <div className="sidesDessertsDrinksButton">
                        <img className="sidesDessertsDrinksButtonPic" src="/drink.jpg" alt="Drinks Image"></img>
                        <div className="buttonText">DRINKS</div>
                    </div>
                </Link>
                <Link to='/desserts'>
                    <div className="sidesDessertsDrinksButton">
                        <img className="sidesDessertsDrinksButtonPic" src="/icecream-large.jpg" alt="Desserts Image"></img>
                        <div className="buttonText">DESSERTS</div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Menu