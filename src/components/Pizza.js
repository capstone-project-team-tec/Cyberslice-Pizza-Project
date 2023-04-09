import { useState } from "react";
import "./pizza.css";
import "./global.css";
import { useNavigate } from "react-router-dom";

const Pizza = (props) => {
    const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, drinks } = props;
    let layers = [
        { id: "pizzaLayer1", toppingId: 1, name: "Pepperoni", price: 3.99, filename: "1-Pepperoni" },
        { id: "pizzaLayer2", toppingId: 2, name: "Sausage", price: 3.99, filename: "2-Sausage" },
        { id: "pizzaLayer3", toppingId: 3, name: "GreenPepper", price: 2.99, filename: "3-GreenPepper" },
        { id: "pizzaLayer4", toppingId: 4, name: "Onion", price: 2.99, filename: "4-Onions" },
        { id: "pizzaLayer5", toppingId: 5, name: "Black Olives", price: 2.99, filename: "5-BlackOlive" },
        { id: "pizzaLayer6", toppingId: 6, name: "24-Carat Gold Flakes", price: 6.99, filename: "6-Gold" },
    ];
    const [currentPizza, setCurrentPizza] = useState({});

    const [layerVisibilityAndToppingCount, setLayerVisibilityAndToppingCount] = useState(
        layers.reduce((objectOfLayerVisibilityAndToppingCountForEachLayer, layer) => {
            objectOfLayerVisibilityAndToppingCountForEachLayer[layer.id] = { visible: false, count: 1 };
            return objectOfLayerVisibilityAndToppingCountForEachLayer;
        }, {})
    );

    const toggleLayerVisibilityAndToppingCount = (layerId) => {
        setLayerVisibilityAndToppingCount((previousVisibilityAndToppingCount) => ({
            ...previousVisibilityAndToppingCount,
            [layerId]: { ...previousVisibilityAndToppingCount[layerId], visible: !previousVisibilityAndToppingCount[layerId].visible },
        }));
    };
    
    async function createPizza() {
        try {
          const response = await fetch('http://localhost:1337/api/pizza', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
          });
      
          const result = await response.json();
          
          if (result.success) {
            console.log("created a new pizza:  ",result);
            setCurrentPizza(result)
            // const pizzaId = result.id
            return result 
          } else {
            console.log('Failed to create a new pizza:  ', result.error.message);
            return null;
          }
        } catch (error) {
          console.error('Error creating a new pizza:  ', error);
        }
    }

    const createPizzaWithToppingsTableRow = async (pizzaId, toppingsId, count) => {
        console.log("this is the pizza id:  ",pizzaId)
        console.log("this is the toppings id:  ",toppingsId)
        console.log("this is the count:  ",count)
        try {
          const response = await fetch(`http://localhost:1337/api/pizza/${pizzaId}/pizzawithtoppings`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                pizzaId, 
                toppingsId, 
                count
            }),
          });
          const result = await response.json();
          console.log(result);
          
        } catch (error) {
          console.log(error);
        }
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

    const handleOrderButtonClick = async () => {
        const createdPizza = await createPizza()
        if (createdPizza) {   
            console.log("this is the created pizza running through pizzawithtoppings:  ",createdPizza)
            layers.forEach((layer) => {
                if (layerVisibilityAndToppingCount[layer.id].visible) {
                    createPizzaWithToppingsTableRow(
                        createdPizza.pizza.id,
                        layer.toppingId,
                        layerVisibilityAndToppingCount[layer.id].count
                    );
                }
            });
            
        } else {console.log("A pizza was neither found nor created.")}
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
                            className={`pizzaLayer ${layerVisibilityAndToppingCount[layer.id].visible ? "" : "hidden"}`}
                            id={layer.id}
                            src={`/${layer.filename}.png`}
                            alt={layer.name}
                        />
                    ))}
                </div>
                <div id="buttonContainer">
                    {layers.map((layer) => (
                        <div key={layer.id}>
                            <button onClick={() => toggleLayerVisibilityAndToppingCount(layer.id)}>
                                Toggle {layer.name}
                            </button>
                            {layerVisibilityAndToppingCount[layer.id].visible && (
                                <select
                                    value={layerVisibilityAndToppingCount[layer.id].count}
                                    onChange={(event) => {
                                        const newCount = parseInt(event.target.value, 10);
                                        setLayerVisibilityAndToppingCount((prevState) => ({
                                          ...prevState,
                                          [layer.id]: { ...prevState[layer.id], count: newCount },
                                        }));
                                    }}
                                >
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                </select>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleOrderButtonClick}>Order Pizza</button>
        </div>
    );
};

export default Pizza;

