import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./home.css"
import "./global.css"

const Home = () => {
    
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        props.setIsLoggedIn(false);
        navigate('./');
    }
    
  return (
    <div id="home">
      <img id="gridPic" src="grid.png" alt="Image of Grid"></img>
      <div id="upperHomeContainer">
        <div id="futureOfPizzaTextAndButton">
          <h1 id="theFutureOfPizza">The Future of Pizza</h1>
          <p id="theFutureOfPizzaSubtext">
            Welcome to a new reality. 
            Our state-of-the-art facility fuses cutting-edge technology with artisanal pizza-making. 
            Immerse yourself in a high-tech dystopian wonderland while enjoying our artisanal pizzas crafted with the highest-quality ingredients.
          </p>
          <Link id="orderNowLink" to="/checkout">ORDER NOW</Link>
        </div>
        <div id="pizzaWrapper"> 
          <img id="pizzaOnWindowSillPic" src="/pizzaOnWindowSill.jpg" alt="Image of Pizza on Window Sill"></img>
          <div id="whiteCircle"></div>
        </div>
      </div>
      <div id="middleHomeContainer">
        <div id="engineeredToPerfectionTextAndSubtext">
          <h1 id="engineeredToPerfection">Engineered to Perfection</h1>
          <p id="engineeredToPerfectionSubtext">
            At Cyber Slice Pizza, we elevate the art of pizza-making to new heights. 
            Our master chefs meticulously engineer each pizza, blending innovative culinary techniques with traditional methods. 
            Using the freshest toppings and dough made in-house, we ensure every bite bursts with an unforgettable fusion of flavors. 
            Come and experience the future of pizza today!
          </p>
        </div>
      </div>
      <div id="lowerHomeContainer">
        <div id="lowerHomeContainerPicAndButtons">
          <img id="pizzaOverheadShot" src="/pizzaOverheadShot.jpg" alt="Image of Pizza from Overhead"></img>
          <div id="lowerHomeContainerButtonGroup">
            <Link className="lowerHomeContainerButton" id="viewOurFullMenuButton">View Our Full Menu</Link>
            <Link className="lowerHomeContainerButton" id="viewOurLocationsButton">View Our Locations</Link>
            <Link className="lowerHomeContainerButton" id="createAnAccountButton">
              New Here? <br /> 
              Create An Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
