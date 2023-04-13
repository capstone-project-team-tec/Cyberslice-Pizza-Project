import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./checkout.css"
import "./global.css"

const Checkout = (props) => {
    const { currentCart, subTotalDisplay, setSubTotalDisplay, totalCost, setTotalCost, currentOrderItems, setCurrentOrderItems} = props
    const [updatedOrderItem, setUpdatedOrderItem] = useState({})

    useEffect(() => {
        getOrderItemsByCartId();
    }, [currentCart]);

    // this function fetches the entries from the order items table whose cartId value matches the current cart id then sets the currentOrderItems state.
    async function getOrderItemsByCartId() {
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart/${currentCart.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });      
            const result = await response.json();
            setCurrentOrderItems(result);
        } catch (error) {
          console.log(error);
        }
    }

    // this function removes an entry from the order items table.
    async function removeOrderItem(orderItemId) {
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart/orderitems/${orderItemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "cartId" : currentCart.id
                })
          });
        } catch (error) {
            console.log(error);
        }
    }

    // this function updates the count of an order item in the order items table.
    async function updateOrderItem( orderItemId, count) {
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart/orderitems/${orderItemId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    count
                }),
            })
            const result = await response.json();
            setUpdatedOrderItem(result)
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOrderItemsByCartId();
    }, [updatedOrderItem]);

    // this function runs when the remove button is clicked. It updates the state and runs the removeOrderItem function.
    async function handleRemove (productId, orderItemId) {
        const updatedOrderItems = currentOrderItems.filter(
            (orderItem) => orderItem.id !== orderItemId
        );
        setCurrentOrderItems(updatedOrderItems);
        await removeOrderItem(productId);
    }

    // this function calculates the values that display for subtotal cost and total cost.
    const subTotalCostCalculator = (currentOrderItems) => {
        let subTotal = 0
        let finalSubTotal = 0
        if (currentOrderItems.length > 0){
            for (let i=0; i<currentOrderItems.length; i++){
                subTotal += (currentOrderItems[i].count*currentOrderItems[i].cost)
                finalSubTotal = subTotal.toFixed(2);
            }
        } else {finalSubTotal = 0.00}
        setSubTotalDisplay(finalSubTotal);
        let totalCostCalculated = 0
        let deliveryFee = 10
        totalCostCalculated = (parseFloat(finalSubTotal)+deliveryFee).toFixed(2);
        setTotalCost(totalCostCalculated)
    };      

    useEffect(() => {
        subTotalCostCalculator(currentOrderItems);
    }, [currentOrderItems]);

    return (
        <section id = "checkoutContainer">
            <section id = "checkoutPageTitle">My Cart</section>
            
            {currentOrderItems.length > 0 ? (currentOrderItems.map((orderItem) => {
                return (
                    <section key={orderItem.id} className = "item"> 
                        <div>
                            <section className = "itemTitle">{orderItem.productName}</section>
                            <section className = "itemTitle">{orderItem.pizzaName}</section>

                            <section className = "itemDetailsContainer">
                                <section className = "detailColumn">
                                    <section className = "detailCategory">
                                        Quantity
                                    </section>

                                    <section className = "detailValue">
                                        <select className="selectCountDropdown"
                                            value={orderItem.count}
                                            onChange={(event) => {
                                                event.preventDefault();
                                                const updatedCost = event.target.value * orderItem.cost;
                                                updateOrderItem(orderItem.id, event.target.value, updatedCost)    
                                            }}
                                        >
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                            <option value={6}>6</option>
                                            <option value={7}>7</option>
                                            <option value={8}>8</option>
                                            <option value={9}>9</option>
                                        </select>
                                    </section>
                                </section>

                                <section className = "detailColumn">
                                    <section className = "detailCategory">
                                        Total
                                    </section>

                                    <section className = "detailValue">
                                        {(orderItem.cost*orderItem.count).toFixed(2)}
                                    </section>
                                </section>

                                <section className = "removeButtonContainer">
                                    <button id = "removeButton" onClick={() => handleRemove(orderItem.productId, orderItem.id)}>
                                        Remove
                                    </button>
                                </section>
                            </section>
                        </div>
                    </section>
                );
            })) : (
                <div>Nothing in the cart yet!</div>
            )}

            <section id = "totalContainer">
                <section className = "chargeContainer">
                    <section id = "subtotal">
                        <div id="subtotal">
                            <p id="subtotalText" className="textNoMarginOrPad deliveryFeeCheckout">Subtotal:</p>
                            <p className="price  textNoMarginOrPad"> $ {subTotalDisplay ? subTotalDisplay: 0}</p>
                        </div>
                    </section>
                            
                    <section id = "fee">
                        <div id="deliveryFee">
                            <p id="deliveryFeeText" className="textNoMarginOrPad deliveryFeeCheckout">Delivery Fee:</p>
                            <p className="price  textNoMarginOrPad">$10.00</p>
                        </div>
                    </section>

                    <section id = "total">
                        <section id = "totalTitle" className="totalCheckout">
                            Total: 
                        </section>

                        <section className = "price">
                           $ {totalCost}
                        </section>
                    </section>
                </section>
            </section>

            <section id = "buttonContainer"> 
                <Link to={'/payment'} id = "continueToPaymentButton">Continue To Payment</Link>
            </section>
        </section>
    )
}
export default Checkout