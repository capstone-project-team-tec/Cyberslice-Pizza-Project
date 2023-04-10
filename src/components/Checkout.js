import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./checkout.css"
import "./global.css"

const Checkout = (props) => {
    const { currentCart, currentUser } = props
    const [currentOrderItems, setCurrentOrderItems] = useState([])
    const [anything, setAnything] = useState([])
    const [updatedOrderItem, setUpdatedOrderItem] = useState({})
    const [subTotalDisplay,setSubTotalDisplay] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
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
            
        } catch (error) {
          console.log(error);
        }
    }

    async function removeOrderItem(orderItemId) {
        try {
            console.log(orderItemId);
            console.log(currentCart.id)
            const response = await fetch(`http://localhost:1337/api/cart/orderitems/${orderItemId}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify( {
                    "cartId" : currentCart.id
            } )
          });
          const result = await response.json();

          setAnything(result);
          
          console.log(result);
        } catch (error) {
          console.log(error);
        }
    }

    async function updateOrderItem( orderItemId, count) {
        console.log("update order item is firing")
        console.log("orderitemId: ",orderItemId)
        console.log("orderitemCount: ",count)
        try {
            const response = await fetch(`http://localhost:1337/api/cart/orderitems/${orderItemId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    count
                }),
            })
            
            const result = await response.json();
            
            console.log("this is the result for update order item", result)
            setUpdatedOrderItem(result)
        
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOrderItemsByCartId();
    }, [updatedOrderItem]);

    async function handleRemove (productId, orderItemId) {
        const updatedOrderItems = currentOrderItems.filter(
            (orderItem) => orderItem.id !== orderItemId
        );

        // Update the items list again.
        setCurrentOrderItems(updatedOrderItems);
        await removeOrderItem(productId);
    }

    const subTotalCostCalculator = (currentOrderItems) => {
        let subTotal = 0
        let finalSubTotal = 0
        if (currentOrderItems != {}){
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
            
            {currentOrderItems.length > 0 ? (
                currentOrderItems.map((orderItem) => {
                return (
                    <section key={orderItem.id} className = "item"> 
                        <div>
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
                                
                            </section>
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
                           $ {subTotalDisplay ? subTotalDisplay: 0}
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
                           $ {totalCost}
                        </section>
                    </section>
                </section>
            </section>

            <section id = "buttonContainer"> 
                <Link to={'/payment'} id = "checkoutButtonForCheckoutComponent">Continue To Payment</Link>
            </section>
        </section>
    )
}
export default Checkout