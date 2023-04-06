import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./checkout.css"
import "./global.css"

// function getItems(these are the items from the database) {
//     // 
// }
const Checkout = (props) => {
    const { currentCart, currentUser } = props
    const [currentOrderItems, setCurrentOrderItems] = useState([])
    const {id} = useParams()

    useEffect(() => {
        getOrderItemsByCartId();
    }, [currentCart]);

    
    console.log("this is line 16 of checkout current cart id:   ",currentCart.id)

    async function getOrderItemsByCartId() {
        try {
            const response = await fetch(`http://localhost:1337/api/cart/${currentCart.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });      
            const result = await response.json();
            setCurrentOrderItems(result);
            return result;
        } catch (error) {
          console.log(error);
        }
    }

    async function removeOrderItem(orderItemId) {
        try {
          const response = await fetch(`http://localhost:1337/api/cart/orderitems/${orderItemId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },

            body: {
                cartId: currentCart.id
            }
          });
          const result = await response.json();
          console.log(result);
        } catch (error) {
          console.log(error);
        }
      }

    async function handleRemove (id) {
        const updatedOrderItems = currentOrderItems.filter(
            (orderItem) => orderItem.id !== id
        );

        // Update the items list again.
        setCurrentOrderItems(updatedOrderItems);
        await removeOrderItem(id);
    }

    const subTotalCost = currentOrderItems.reduce((accumulator, orderItem) => {
        return accumulator + orderItem.cost * orderItem.count;
      }, 0);      

    return (
        <section id = "checkoutContainer">
            <section id = "checkoutPageTitle">My Cart</section>
            
            {currentOrderItems.length > 0 ? (
                currentOrderItems.map((orderItem) => {
                return (
                    <section className = "item"> 
                        <div key={orderItem.id}>
                            {/* only one of these should print */}
                            <section className = "itemTitle">{orderItem.productName}</section>
                            <section className = "itemTitle">{orderItem.pizzaName}</section>

                            <section className = "itemDetailsContainer">

                                {/* Space these better, away from the remove. */}
                                <section className = "detailColumn">
                                    <section className = "detailCategory">
                                        Quantity
                                    </section>

                                    <section className = "detailValue">
                                        {orderItem.count}
                                    </section>
                                </section>

                                <section className = "detailColumn">
                                    <section className = "detailCategory">
                                        Total
                                    </section>

                                    <section className = "detailValue">
                                        {orderItem.cost}
                                    </section>
                                </section>

                                {/* This needs to go to the far right */}
                                <section className = "removeButtonContainer">
                                    <button id = "removeButton" onClick={() => handleRemove(orderItem.id)}>
                                        Remove
                                    </button>
                                </section>
                                
                            </section>
                            
                            {/* <h2> Price: {orderItem.cost}</h2>
                            <h2> ProductId: {orderItem.productId}</h2>
                            <h2> PizzaId: {orderItem.pizzaId}</h2>
                            <h2> Count: {orderItem.count}</h2> */}
                        </div>
                    </section>
                );
                })
            ) : (
                <div>Nothing in the cart yet!</div>
            )}

            <section id = "totalContainer">
                <section className = "chargeContainer">
                    <section id = "subtotal">
                        <section id = "subtotalTitle">
                            Subtotal
                        </section>

                        <section className = "price">
                            $ {subTotalCost.toFixed(2)}
                        </section>
                    </section>

                    <section id = "fee">
                        <section id = "feeTitle">
                            Delivery Fee
                        </section>
                        <section className = "price">
                            $ 10.00
                        </section>
                    </section>

                    <section id = "total">
                        <section id = "totalTitle">
                            Total: 
                        </section>

                        <section className = "price">
                            
                        </section>
                    </section>
                </section>
            </section>

            <section id = "buttonContainer"> 
                <section id = "checkoutButton">Check out</section>
            </section>
        </section>
    )
}
export default Checkout