//This is the CarryOut or Delivery page
import { useState } from "react"
import { useParams, useNavigate, Link, json } from "react-router-dom"
import "./orderOptions.css"
import "./global.css"

// const CarryoutLocation = ({ title, street, city, state, zip}) => {
//     return (
//         <section className="location">
//             <section className="locationInfoContainer">
//                 <section className="locationTitle">
//                 {title}
//                 </section>

//                 <section className="addressContainer">
//                 <section className="locationStreetContainer">
//                     <section className="locationStreetTitle">
//                     Street
//                     </section>

//                     <section className="locationStreet">
//                     {street}
//                     </section>
//                 </section>

//                 <section className="locationCityContainer">
//                     <section className="locationCityTitle">
//                     City
//                     </section>

//                     <section className="locationCity">
//                     {city}
//                     </section>
//                 </section>

//                 <section className="locationStateContainer">
//                     <section className="locationStateTitle">
//                     State
//                     </section>

//                     <section className="locationState">
//                     {state}
//                     </section>
//                 </section>

//                 <section className="locationZipContainer">
//                     <section className="locationZipTitle">
//                     Zip
//                     </section>

//                     <section className="locationZip">
//                     {zip}
//                     </section>
//                 </section>
//                 </section>
//             </section>
//     </section>
//     )
// }
const OrderOptions = (props) => {
    const [carryOut, setCarryOut] = useState(false)
    const [delivery, setDelivery] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [orderLocation, setOrderLocation] = useState("")

    

    const [deliveryStreet, setDeliveryStreet] = useState("")
    const [deliveryApt, setDeliveryApt] = useState("")
    const [deliveryState, setDeliveryState] = useState("")
    const [deliveryZip, setDeliveryZip] = useState("")

    const { currentCart, currentUser, setCurrentCart } = props

    const navigate = useNavigate()

    function CarryoutTrue() {
        setCarryOut(!carryOut)
        if (delivery) {
            setDelivery(!delivery)
        }
    }

    function DeliveryTrue() {
        setDelivery(!delivery)
        if (carryOut) {
            setCarryOut(!carryOut)
        }
    }

    async function updateDeliveryAddress () {
        try {
            const response = await fetch(`http://localhost:1337/api/cart/${currentCart.id}/updatedelivery`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: currentCart.id,
                    deliveryAddress: deliveryAddress
                })
            })
            const result = await response.json()
            setCurrentCart(result)

        } catch(error) {
            console.log(error)
        }
    }

    async function updateLocationRequest () {
        try {
            const response = await fetch(`http://localhost:1337/api/cart/${currentCart.id}/updatelocation`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: currentCart.id,
                    orderLocation: orderLocation
                })
            })
            const result = await response.json()
            setCurrentCart(result)
        } catch(error) {
            console.log(error)
        }
    }
    return(
        <div>
            <section id = "orderContainer">
                <section id= "orderPageTitle">
                    Order Options
                </section>
                
                <section id="choiceContainer">
                    <button id="deliveryChoice"onClick={DeliveryTrue}>Delivery</button>
                    <button id="carryoutChoice"onClick={CarryoutTrue}>Carry Out</button>
                </section>
            </section>

            {carryOut ? (
                <div id="locationsContainer">
                    <h3>Please Select Location:</h3>
                    <form onSubmit={updateLocationRequest}>
                        {/* <CarryoutLocation 
                            title="Red Row Alley"
                            street="3697 S Red Planet Rd"
                            city="Colony 15"
                            state="Mars"
                            zip="70810"
                        />

                        <CarryoutLocation 
                            title="Neon Lane Location"
                            street="6201 Whispering Pines Lane"
                            city="Ulaanbaatar"
                            state="Mongolia"
                            zip="03429"
                        /> */}
                        <label className="checkbox" htmlFor="checkbox1">
                            <input type="radio" className = "location"/> 3697 S Red Planet Rd, Mars
                        </label>
                        
                        <label className="checkbox" htmlFor="checkbox2">
                            <input type="radio" className = "location"/> 6201 Whispering Pines Lane, Mongolia  
                        </label>

                        <label className="checkbox" htmlFor="checkbox3">
                            <input type="radio" className = "location" /> 1969 Lunah Heights Blvd, Moon
                        </label>

                        <button id="submit"type="submit"><Link to="/checkout">Next</Link></button>

                    </form>
                    </div>
                ): ""}
            {delivery ? (
                <div>
                {currentUser.address.length == 0 ? (

                
                    
                    <form id="form" className="deliveryContainer" onSubmit={updateDeliveryAddress}>
                        <section id="deliveryFormTitle">
                            Delivery address
                        </section>
                        
                        <section id="deliveryFormContainer">
                            <section id="streetFormContainer">
                                <section id="streetTitle">
                                    Street
                                </section>
                                <section>
                                    <input
                                        id="streetField" 
                                        type="text"
                                        placeholder=""
                                        value={deliveryStreet}
                                        onChange={(event) => setDeliveryStreet(event.target.value)}
                                    />
                                </section>
                            </section>

                            <section id="aptFormContainer">
                                <section id="aptTitle">
                                    Apt/Ste/Floor
                                </section>
                                <section>
                                    <input
                                        id="aptField" 
                                        type="text"
                                        placeholder=""
                                        value={deliveryApt}
                                        onChange={(event) => setDeliveryApt(event.target.value)}
                                    />
                                </section>
                            </section>

                            <section id="stateFormContainer">
                                <section id="stateTitle">
                                    State
                                </section>
                                <section>
                                    <input
                                        id="stateField" 
                                        type="text"
                                        placeholder=""
                                        value={deliveryState}
                                        onChange={(event) => setDeliveryState(event.target.value)}
                                    />
                                </section>
                            </section>

                            <section id="zipFormContainer">
                                <section id="zipTitle">
                                    Zip
                                </section>
                                <section>
                                    <input
                                        id="zipField" 
                                        type="text"
                                        placeholder=""
                                        value={deliveryZip}
                                        onChange={(event) => setDeliveryZip(event.target.value)}
                                    />
                                </section>
                            </section>
                        </section>
                        <button id="submit" type="submit"><Link to="/checkout">Continue to Checkout</Link></button>
                    </form>
                    ): navigate('/checkout')
                }
                    </div>
        
                ): ""}
        </div>
    )
}
export default OrderOptions;