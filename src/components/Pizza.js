import { useState, useEffect } from "react";
import "./pizza.css";
import "./global.css";
import { useNavigate } from "react-router-dom";

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
            setDisplayCost(sumPizzaCost(updatedState));
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
        const selectedToppings = layers
            .filter((layer) => layerVisibilityAndToppingCount[layer.id].visible)
            .map((layer) => {
                const count = layerVisibilityAndToppingCount[layer.id].count;
                return layer.name + (count > 1 ? ` (x${count})` : '');
            })
            .join(", ");
        return `${pizzaSize} Inch Cheese Pizza${selectedToppings ? ' With ' + selectedToppings : ''}`;
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
        console.log("this is the pizza name in check pizza name:  ",pizzaName)
        try {
            const response = await fetch(`http://localhost:1337/api/pizza/getpizzabyname/${pizzaName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            const result = await response.json();
            console.log("this is check pizza name result:  ",result)
            if (!result.success) {
                console.log("no pizza yet created matches the name")
                return("no pizza yet created matches the name")
            } else { 
                console.log("a pizza already created with a name that matches was found")
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
                console.log("this is firing in create pizza because the returned pizza equaled the string")
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
                    console.log("created a new pizza:  ",result);
                    return result.pizza 
                } else {
                    console.log('Failed to create a new pizza:  ', result.error.message);
                    return null;
                }
            } catch (error) {
                console.error('Error creating a new pizza:  ', error);
            }
        } else {
            console.log("Need to check this returned pizza:  ",returnedPizza) 
            return returnedPizza
        }
    }

    // this function creates an entry in the pizzaWithToppings table which relates the pizza id of the pizza being purchased to the toppings being used on that pizza and stores the count of toppings
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
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };
    let guestCartId
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
            
            guestCartId = result.id
            if (result.success) {
                console.log('A new cart has been created for the guest. here is the result:  ',result );
                return result;
            } else {
                console.log('Failed to create a new cart for the guest:', result.error.message);
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

    // this function creates the pizza name, sets the pizza cost, gets/creates the pizza, then creates pizzaWithToppings table entries
    const handleOrderButtonClick = async () => {
        const pizzaName = concatenatePizzaName();
        const pizzaCost = displayCost;
        const createdPizza = await createPizza(pizzaName);
        if (createdPizza) {   
            console.log("this is the created pizza running through pizzawithtoppings:  ",createdPizza)
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
        } else {console.log("A pizza was neither found nor created.")}
    };

    // this use effect makes buttons stay highlighted when clicked, it includes a feature for initialization where if the data has not rendered in yet to retry the delayedEffect function after 500ms
    useEffect(() => {

        // this function sets the pizza size buttons, topping size buttons, and that 10 inch button so that they can have the highlight effects added to them
        function delayedEffect() {
            const pizzaSizeButtonsContainer = document.querySelector('#pizzaSizeButtons');
            const toppingButtonsContainer = document.querySelector('#toppingButtonContainer');
            const tenInchButton = document.querySelector("#firstPizzaSizeButton");
    
            if (pizzaSizeButtonsContainer && toppingButtonsContainer && tenInchButton) {
                function activateButton(button) {
                    button.classList.add('active');
                    button.style.backgroundColor = '#cbff5e';
                    button.style.borderColor = '#cbff5e';
                    button.style.color = 'black';
                }
        
                function deactivateButton(button) {
                    button.classList.remove('active');
                    button.style.backgroundColor = 'black';
                    button.style.borderColor = 'white';
                    button.style.color = 'white';
                }
        
                pizzaSizeButtonsContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.pizzaSizeButton');
                    if (!button) return;
                    const pizzaSizeButtons = document.querySelectorAll('.pizzaSizeButton');
                    pizzaSizeButtons.forEach(deactivateButton);
                    activateButton(button);
                    localStorage.setItem('selectedPizzaSize', button.id);
                });
        
                toppingButtonsContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.toppingButton');
                    if (!button) return;
                    if (button.classList.contains('active')) {
                        deactivateButton(button);
                        localStorage.removeItem(button.id);
                    } else {
                        activateButton(button);
                        localStorage.setItem(button.id, 'active');
                    }
                });
        
                const selectedPizzaSize = localStorage.getItem('selectedPizzaSize');
                if (selectedPizzaSize) {
                    const selectedButton = document.querySelector(`#${selectedPizzaSize}`);
                    activateButton(selectedButton);
                } else {
                    activateButton(tenInchButton);
                    localStorage.setItem('selectedPizzaSize', tenInchButton.id);
                }
        
                const toppingButtons = document.querySelectorAll('.toppingButton');
                toppingButtons.forEach((button) => {
                    if (localStorage.getItem(button.id) === 'active') {
                        activateButton(button);
                    }
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
                                    {layerVisibilityAndToppingCount[layer.id].count == 2 && (
                                <img
                                    key={`${layer.id}-second`}
                                    className={`pizzaLayer ${layerVisibilityAndToppingCount[layer.id].visible ? "rotated" : "hidden"}`}
                                    id={`${layer.id}-second`}
                                    src={`/${layer.filename}.png`}
                                    alt={layer.name}
                                />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div id="rightSideOfMiddleContainer">
                    <div id="chooseSizeContainer">
                        <p id="chooseASizeText">Choose A Size</p>
                        <div id="pizzaSizeButtons">
                            <button id="firstPizzaSizeButton" className="button pizzaSizeButton" onClick={() => handleSizeAndCostButtonClick(10, 9.99)}>10'</button>
                            <button className="button pizzaSizeButton" onClick={() => handleSizeAndCostButtonClick(12, 11.99)}>12'</button>
                            <button className="button pizzaSizeButton" onClick={() => handleSizeAndCostButtonClick(14, 13.99)}>14'</button>
                        </div>
                    </div>
                    <div id="toppingButtonContainer">
                        {layers.map((layer) => (
                            <div key={layer.id} className="toppingButtonContainerItem">
                                <button className="toppingButton" onClick={() => toggleLayerVisibilityAndToppingCount(layer.id)}>
                                    {layer.name}
                                </button>
                                {layerVisibilityAndToppingCount[layer.id].visible && (
                                    <select className="selectCountDropdown"
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

