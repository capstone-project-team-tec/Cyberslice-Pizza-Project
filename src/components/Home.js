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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris varius
            quis elit non egestas. Maecenas vitae gravida ante, at congue massa.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris varius quis elit non egestas. 
            Maecenas vitae gravida ante, at congue massa. Vestibulum eu libero aliquet, rhoncus leo at, efficitur diam. 
            Aliquam elementum nibh odio, nec efficitur neque scelerisque sodales. Morbi enim lectus, vehicula 
            vulputate enim feugiat, bibendum ultrices nunc. Pellentesque sed scelerisque orci. Etiam at nulla nunc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
