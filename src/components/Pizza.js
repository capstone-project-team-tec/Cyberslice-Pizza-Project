import { useState } from "react";
import "./pizza.css";
import "./global.css";

const Pizza = () => {
    const layers = [
        { id: "pizzaLayer1", toppingId: 1, name: "Pepperoni", price: 3.99, filename: "1-Pepperoni" },
        { id: "pizzaLayer2", toppingId: 2, name: "Sausage", price: 3.99, filename: "2-Sausage" },
        { id: "pizzaLayer3", toppingId: 3, name: "GreenPepper", price: 2.99, filename: "3-GreenPepper" },
        { id: "pizzaLayer4", toppingId: 4, name: "Onion", price: 2.99, filename: "4-Onions" },
        { id: "pizzaLayer5", toppingId: 5, name: "Black Olives", price: 2.99, filename: "5-BlackOlive" },
        { id: "pizzaLayer6", toppingId: 6, name: "24-Carat Gold Flakes", price: 6.99, filename: "6-Gold" },
    ];

    const [layerVisibility, setLayerVisibility] = useState(
        layers.reduce((objectOfLayerVisibilityForEachLayer, layer) => {
            objectOfLayerVisibilityForEachLayer[layer.id] = false;
            return objectOfLayerVisibilityForEachLayer;
        }, {})
    );

    const toggleLayerVisibility = (layerId) => {
        setLayerVisibility((previousVisibility) => ({
            ...previousVisibility,
            [layerId]: !previousVisibility[layerId],
        }));
    };

    const handleOrderButtonClick = () => {
        layers.forEach((layer) => {
            if (layerVisibility[layer.id]) {
                // Call createOrderItemsRow for each visible topping
                createOrderItemsRow(layer.toppingId, 1, layer.price, layer.name);
            }
        });
    };

    const createOrderItem = async (cartId, pizzaId, count, cost, pizzaName) => {
        try {
          const response = await fetch(`http://localhost:1337/api/cart/orderitems`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cartId,
              pizzaId,
              count,
              cost,
              pizzaName
            }),
          });
          const result = await response.json();
          console.log(result);
          showAddedToCartNotification(pizzaId);
        } catch (error) {
          console.log(error);
        }
    };

    const createOrderItemsRow = async (pizzaId, count, cost, pizzaName) => {
        let cartId;
        if (Object.keys(currentCart).length == 0) {
          console.log("this is createOrderItemsRow firing on the if currentCart length equals zero");
          if (currentUser) {
            console.log("this is the current user:   ", currentUser);
            await fetchUserCurrentCart();
            cartId = currentCart.id;
          } else {
            await createCartForGuest();
            cartId = guestCartId;
          }
        } else {
          console.log("a current cart was found in sides.  ", currentCart);
          cartId = currentCart.id;
        }
        createOrderItem(cartId, pizzaId, count, cost, pizzaName);
    };

    return (
        <div id="pizzaComponent">
            <div id="buildYourOwnPizzaTitle">Build Your Own Pizza</div>
            <div id="middleContainer">
                <div className="pizzaContainer">
                    <img
                        className="pizzaLayer"
                        id="pizzaLayerBase"
                        src="/CheesePizzaBase.jpg"
                        alt="cheese pizza base"
                    />
                    {layers.map((layer) => (
                        <img
                            key={layer.id}
                            className={`pizzaLayer ${layerVisibility[layer.id] ? "" : "hidden"}`}
                            id={layer.id}
                            src={`/${layer.filename}.png`}
                            alt={layer.name}
                        />
                    ))}
                </div>
                <div id="buttonContainer">
                    {layers.map((layer) => (
                        <button key={layer.id} onClick={() => toggleLayerVisibility(layer.id)}>
                            Toggle {layer.name}
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={handleOrderButtonClick}>Order Selected Toppings</button>
        </div>
    );
};

export default Pizza;








// import { useState } from "react"
// import { useParams, useNavigate, Link } from "react-router-dom"
// import "./pizza.css"
// import "./global.css"

// const Pizza = () => {
//     return(
//         <div id="pizzaComponent">
//             <div id="buildYourOwnPizzaTitle">
//                 Build Your Own Pizza
//             </div>
//             <div id="middleContainer">
//                 <div className="pizzaContainer">
//                     <img className="pizzaLayer" id="pizzaLayerBase" src="/CheesePizzaBase.jpg" alt="cheese pizza base"/>
//                     <img className="pizzaLayer" id="pizzaLayer1" src="/1-Pepperoni.png" alt="pepperoni"/>
//                     <img className="pizzaLayer" id="pizzaLayer2" src="/2-Sausage.png" alt="sausage"/>
//                     <img className="pizzaLayer" id="pizzaLayer3" src="/3-GreenPepper.png" alt="green pepper"/>
//                     <img className="pizzaLayer" id="pizzaLayer4" src="/4-Onions.png" alt="onions"/>
//                     <img className="pizzaLayer" id="pizzaLayer5" src="/5-BlackOlive.png" alt="black olives"/>
//                     <img className="pizzaLayer" id="pizzaLayer6" src="/6-Gold.png" alt="gold flakes"/>
//                 </div>
//                 <div id="buttonContainer">

//                 </div>
//             </div> 
//         </div>
//     )
// }
// export default Pizza;