import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./checkout.css"
import "./global.css"

// function getItems(these are the items from the database) {
//     // 
// }
const Checkout = (props) => {
    return (
        <section id = "checkoutContainer">
            <section id = "checkoutPageTitle">My Cart</section>

            <section id = "itemsList">
                itemsList
                <section className = "item">
                    <section className = "itemTitle">
                        itemTitle
                    </section>

                    <section className = "itemDetailsContainer">

                        <section className = "detailColumn">
                            <section className = "detailCategory"> 
                                Category
                            </section>

                            <section className = "detailValue"> 
                                Value
                            </section>
                        </section>

                        <section className = "removeButton">
                            Remove
                        </section>
                    </section>
                </section>
            </section>

            <section id = "totalContainer">
                <section className = "chargeContainer">
                    <section id = "subtotal">
                        <section id = "subtotalTitle">
                            Subtotal
                        </section>
                        <section className = "price">
                            10.55
                        </section>
                    </section>
                    
                    <section id = "fee">
                        <section id = "feeTitle">
                            {/* Depends on what the carryout/delivery choice was */}
                            Delivery Fee
                        </section>
                        <section className = "price">
                            2.99
                        </section>
                    </section>

                    <section id = "total">
                        <section id = "totalTitle">
                            Total:
                        </section>

                        <section className = "price">
                            2.99
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