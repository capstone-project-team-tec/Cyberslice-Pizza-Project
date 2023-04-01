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
      <img id="gridPic" src="/grid.png" alt="Image of Grid"></img>
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
          <svg id="pizzaIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152.12 187.13"><defs><style>.b</style></defs><path class="b" d="M2.26,185.54L150.43,73.28c.26-.2,.24-.6-.04-.78L33.84,1.57c-.28-.17-.65,0-.71,.32L1.51,185.08c-.07,.42,.41,.71,.75,.46Z"/><line class="b" x1="29.62" y1="22.18" x2="134.02" y2="85.71"/><rect class="b" x="41.43" y="49.4" width="18.7" height="18.7" rx=".47" ry=".47" transform="translate(37.94 -17.84) rotate(31.32)"/><rect class="b" x="54.97" y="97.67" width="18.7" height="18.7" rx=".47" ry=".47" transform="translate(65.01 -17.84) rotate(31.32)"/><path class="b" d="M29.67,164.77l-7.08-4.31c-.22-.14-.29-.42-.16-.65l9.23-15.17c.14-.22,.42-.29,.65-.16l13.39,8.15"/><rect class="b" x="88.62" y="65.47" width="18.7" height="18.7" rx=".47" ry=".47" transform="translate(53.17 -40.02) rotate(31.32)"/><path class="b" d="M16.15,100.24l13.8,8.4c.22,.14,.29,.42,.16,.65l-9.23,15.17c-.14,.22-.42,.29-.65,.16l-7.58-4.61"/></svg>
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
