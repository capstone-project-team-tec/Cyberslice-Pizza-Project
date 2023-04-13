import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pizza.css";
import "./global.css";

const Pizza = (props) => {
    const navigate = useNavigate();
    const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart } = props;
    let layers = [
        { id: "pizzaLayer1", toppingId: 1, name: "Pepperoni", price: 3.99, filename: "1-Pepperoni" },
        { id: "pizzaLayer2", toppingId: 2, name: "Sausage", price: 3.99, filename: "2-Sausage" },
        { id: "pizzaLayer3", toppingId: 3, name: "GreenPepper", price: 2.99, filename: "3-GreenPepper" },
        { id: "pizzaLayer4", toppingId: 4, name: "Onion", price: 2.99, filename: "4-Onions" },
        { id: "pizzaLayer5", toppingId: 5, name: "Black Olives", price: 2.99, filename: "5-BlackOlive" },
        { id: "pizzaLayer6", toppingId: 6, name: "24-Carat Gold Flakes", price: 6.99, filename: "6-Gold" },
    ];

    const [pizzaSize, setPizzaSize] = useState(10);
    const [basePizzaCost, setBasePizzaCost] = useState(9.99);
    const [displayCost, setDisplayCost] = useState(9.99);

    // this is setting the state for the visibility of topping images on the pizza as well as state for their count, like 2x pepperoni for example
    const [layerVisibilityAndToppingCount, setLayerVisibilityAndToppingCount] = useState(
        layers.reduce((objectOfLayerVisibilityAndToppingCountForEachLayer, layer) => {
            objectOfLayerVisibilityAndToppingCountForEachLayer[layer.id] = { visible: false, count: 1 };
            return objectOfLayerVisibilityAndToppingCountForEachLayer;
        }, {})
    );
    
    // this is the function to make topping images change to visible or invisible depending on the current visibility and updates the total cost displaying
    const toggleLayerVisibilityAndToppingCount = (layerId) => {
        setLayerVisibilityAndToppingCount((previousVisibilityAndToppingCount) => {
            const updatedState = {
                ...previousVisibilityAndToppingCount,
                [layerId]: { ...previousVisibilityAndToppingCount[layerId], visible: !previousVisibilityAndToppingCount[layerId].visible },
            };
            return updatedState;
        });
    };

    // this use effect updates the total cost displaying whenever layer visibility or a topping count changes or the pizza size selected changes
    useEffect(() => {
        if (layerVisibilityAndToppingCount != undefined && basePizzaCost) {
            setDisplayCost(sumPizzaCost(layerVisibilityAndToppingCount, basePizzaCost));
        }
    }, [layerVisibilityAndToppingCount, basePizzaCost]);

    // this function updates the pizzaSize state and the basePizzaCost state when a size button is clicked
    const handleSizeAndCostButtonClick = (size, cost) => {
        setPizzaSize(size);
        setBasePizzaCost(cost);
        setDisplayCost(sumPizzaCost(layerVisibilityAndToppingCount, cost));
    };

    // this function creates the full name of the pizza depending on the size and toppings selected
    const concatenatePizzaName = () => {
        const visibleLayers = layers.filter((layer) => layerVisibilityAndToppingCount[layer.id].visible)
            const chosenToppings = visibleLayers.map((layer) => {
                const count = layerVisibilityAndToppingCount[layer.id].count;
                return layer.name + (count > 1 ? ` (x${count})` : '');
            })
            const finalChosenToppings = chosenToppings.join(", ");
        return `${pizzaSize} Inch Cheese Pizza${finalChosenToppings ? ' With ' + finalChosenToppings : ''}`;
    };

    // this function calculates the total cost of the pizza based on what layers are visible on the picture and on what size pizza has been selected
    const sumPizzaCost = (layerVisibilityAndToppingCountState, baseCost) => {
        const toppingsCost = layers.reduce((totalCost, layer) => {
            if (layerVisibilityAndToppingCountState[layer.id].visible) {
                return totalCost + layer.price * layerVisibilityAndToppingCountState[layer.id].count;
            }
            return totalCost;
        }, 0);
        return parseFloat((baseCost + toppingsCost).toFixed(2));
    };
    
    // this function checks if a pizza name has already been made in the table before and if so returns it otherwise it returns a string checked for in the createPizza function
    async function checkPizzaName(pizzaName) {
        try {
            const response = await fetch(`http://localhost:1337/api/pizza/getpizzabyname/${pizzaName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            if (!result.success) {
                return("no pizza yet created matches the name")
            } else { 
                return result.pizza
            }
        } catch (error) {
            console.log(error)
        }
    }

    // this function runs checkPizzaName function's return and if it is the string it creates a new entry in the pizza table and returns that, otherwise it returns the pizza that was found which already had that name in the table
    async function createPizza(pizzaName) {
        const returnedPizza = await checkPizzaName(pizzaName)
        if (returnedPizza == "no pizza yet created matches the name"){
            try {
                const response = await fetch('http://localhost:1337/api/pizza', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: pizzaName,
                        basePizzaCost: basePizzaCost,
                        pizzaSize
                    }),
                });
        
                const result = await response.json();
            
                if (result.success) {
                    return result.pizza 
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error creating a new pizza:  ', error);
            }
        } else { 
            return returnedPizza
        }
    }

    // this function creates an entry in the pizzaWithToppings table which relates the pizza id of the pizza being purchased to the toppings being used on that pizza and stores the count of toppings
    const createPizzaWithToppingsTableRow = async (pizzaId, toppingsId, count) => {
        try {
            const response = await fetch(`http://localhost:1337/api/pizza/${pizzaId}/pizzawithtoppings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    toppingsId, 
                    count
                }),
            });
        } catch (error) {
            console.log(error);
        }
    };
    
    // this creates an entry in the orderItems table which tracks what products or pizzas are in each cart
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
        } catch (error) {
            console.log(error);
        }
    };

    // this function creates a cart for a guest user and sets the current cart state to the result of the post request. It also returns the result.
    async function createCartForGuest() {
        try {
            const response = await fetch('http://localhost:1337/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
      
            const result = await response.json();
            setCurrentCart({
                id: result.id,
                isCheckedOut: result.isCheckedOut,
                totalCost: result.totalCost,
                userId: result.userId
            })
            
            if (result.success) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error creating cart for guest:', error);
        }
    }

    // this checks for a current cart and if there is none then it creates one and then creates the orderItem table entry  
    const createOrderItemsRow = async (pizzaId, count, cost, pizzaName) => {
        let cartId;
        if (Object.keys(currentCart).length == 0) {
            if (currentUser) {
                await fetchUserCurrentCart();
                cartId = currentCart.id;
            } else {
                await createCartForGuest();
                cartId = currentCart.id;
            }
        } else {
            cartId = currentCart.id;
        }
        createOrderItem(cartId, pizzaId, count, cost, pizzaName);
    };

    // this function creates the pizza name, sets the pizza cost, gets/creates the pizza, then creates pizzaWithToppings table entries
    const handleOrderButtonClick = async () => {
        const pizzaName = concatenatePizzaName();
        const pizzaCost = displayCost;
        const createdPizza = await createPizza(pizzaName);
        if (createdPizza) {   
            layers.forEach((layer) => {
                if (layerVisibilityAndToppingCount[layer.id].visible) {
                    createPizzaWithToppingsTableRow(
                        createdPizza.id,
                        layer.toppingId,
                        layerVisibilityAndToppingCount[layer.id].count
                    );
                };
            });
            await createOrderItemsRow(createdPizza.id, 1, pizzaCost, pizzaName);
            navigate('/menu');
        } else {return}
    };

    // this use effect makes buttons stay highlighted when clicked, it includes a feature for initialization where if the data has not rendered in yet to retry the delayedEffect function after 500ms
    useEffect(() => {

        // this function clears any of the involved local storage items, sets the pizza size buttons, topping size buttons, and that 10 inch button so that they can have the highlight effects added to them, and adds them to localstorage
        function delayedEffect() {
            const pizzaSizeButtonsContainer = document.querySelector('#pizzaSizeButtons');
            const toppingButtons = document.querySelectorAll('.toppingButton');
            const pizzaSizeButtons = document.querySelectorAll('.pizzaSizeButton');
            const tenInchButton = document.querySelector("#firstPizzaSizeButton");
    
            if (pizzaSizeButtonsContainer && toppingButtons && tenInchButton) {
                
                toppingButtons.forEach((button) => {
                    localStorage.removeItem(button.id);
                });
        
                localStorage.removeItem('selectedPizzaSize');
                
                function activateButton(button) {
                    button.classList.remove('thisButtonIsInactive');
                    button.classList.add('thisButtonIsActive');
                }
        
                function deactivateButton(button) {
                    button.classList.remove('thisButtonIsActive');
                    button.classList.add('thisButtonIsInactive');
                }
        
                pizzaSizeButtonsContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.pizzaSizeButton');
                    if (!button) return;
                    pizzaSizeButtons.forEach(deactivateButton);
                    activateButton(button);
                    localStorage.setItem('selectedPizzaSize', button.id);
                });
        
                toppingButtons.forEach((button) => {
                    button.addEventListener('click', () => {
                        if (button.classList.contains('thisButtonIsActive')) {
                            deactivateButton(button);
                            localStorage.removeItem(button.id);
                        } else {
                            activateButton(button);
                            localStorage.setItem(button.id, 'thisButtonIsActive');
                        }
                    });
                });                

                activateButton(tenInchButton);
                localStorage.setItem('selectedPizzaSize', tenInchButton.id);
        
                toppingButtons.forEach((button) => {
                    if (localStorage.getItem(button.id) == 'thisButtonIsActive') {
                        activateButton(button);
                    } else {deactivateButton(button)}
                });
            } else {
                setTimeout(() => {
                    delayedEffect();
                }, 500); 
            }
        }
    
        delayedEffect();
    }, []);
      
    return (
        <div id="pizzaComponent">
            <div id="titleContainer">
                <div id="buildYourOwnPizzaTitle">Build Your Own Pizza</div>
            </div>
            <div id="middleContainer">
                <div id="leftSideOfMiddleContainer">
                    <div className="pizzaContainer">
                        <img
                            className="pizzaLayer"
                            id="pizzaLayerBase"
                            src="/CheesePizzaBase.jpg"
                            alt="cheese pizza base"
                        />
                        {layers.map((layer) => (
                            <div key={layer.id}>
                                <img
                                    key={layer.id}
                                    className={`pizzaLayer ${layerVisibilityAndToppingCount[layer.id].visible ? "" : "hidden"}`}
                                    id={layer.id}
                                    src={`/${layer.filename}.png`}
                                    alt={layer.name}
                                />
                                {layerVisibilityAndToppingCount[layer.id].count == 2 ? (
                                    <img
                                        key={`${layer.id}-second`}
                                        className={`pizzaLayer ${layerVisibilityAndToppingCount[layer.id].visible ? "rotated" : "hidden"}`}
                                        id={`${layer.id}-second`}
                                        src={`/${layer.filename}.png`}
                                        alt={layer.name}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
                <div id="rightSideOfMiddleContainer">
                    <div id="chooseSizeContainer">
                        <p id="chooseASizeText">Choose A Size</p>
                        <div id="pizzaSizeButtons">
                            <button id="firstPizzaSizeButton" className="button pizzaSizeButton" onClick={() => handleSizeAndCostButtonClick(10, 9.99)}>10'</button>
                            <button id="secondPizzaSizeButton" className="button pizzaSizeButton" onClick={() => handleSizeAndCostButtonClick(12, 11.99)}>12'</button>
                            <button id="thirdPizzaSizeButton" className="button pizzaSizeButton" onClick={() => handleSizeAndCostButtonClick(14, 13.99)}>14'</button>
                        </div>
                    </div>
                    <div id="toppingButtonContainer">
                        {layers.map((layer) => (
                            <div key={layer.id} className="toppingButtonContainerItem">
                                <button id={layer.id} className="toppingButton" onClick={() => toggleLayerVisibilityAndToppingCount(layer.id)}>
                                    {layer.name}
                                </button>
                                {layerVisibilityAndToppingCount[layer.id].visible ? (
                                    <select className="selectCountDropdown"
                                        value={layerVisibilityAndToppingCount[layer.id].count}
                                        onChange={(event) => {
                                            const newCount = parseInt(event.target.value, 10);
                                            setLayerVisibilityAndToppingCount((previousLayerVisibilityAndToppingCount) => ({
                                                ...previousLayerVisibilityAndToppingCount,
                                                [layer.id]: { ...previousLayerVisibilityAndToppingCount[layer.id], count: newCount }
                                            }));
                                        }}
                                    >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                    </select>
                                ): null}
                            </div>
                        ))}
                    </div>
                    <div className="totalCostContainer">
                        <span className="totalCostText">Total:</span>
                        <span className="totalCostPrice">${displayCost.toFixed(2)}</span>
                    </div>
                    <div id="orderButtonContainer">
                        <button className="button" id="orderButton" onClick={handleOrderButtonClick}>Add To Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pizza;

