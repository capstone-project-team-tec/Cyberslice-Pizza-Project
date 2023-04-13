//This is the CarryOut or Delivery page
import { useState } from "react"
import { Link} from "react-router-dom"
import "./orderOptions.css"
import "./global.css"

const OrderOptions = (props) => {
    const [carryOut, setCarryOut] = useState(false)
    const [delivery, setDelivery] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [hasCarryOutButtonBeenClicked, setHasCarryOutButtonBeenClicked] = useState(false)
    const [hasDeliveryButtonBeenClicked, setHasDeliveryButtonBeenClicked] = useState(false)
    const [selectedStoreLocation, setSelectedStoreLocation] = useState("")
    const { currentCart, setCurrentCart } = props

    function CarryoutTrue() {
        setHasCarryOutButtonBeenClicked(!hasCarryOutButtonBeenClicked)
        setCarryOut(!carryOut)
        if (delivery) {
            setHasDeliveryButtonBeenClicked(!hasDeliveryButtonBeenClicked)
            setDelivery(!delivery)
        }
    }

    function DeliveryTrue() {
        setHasDeliveryButtonBeenClicked(!hasDeliveryButtonBeenClicked)
        setDelivery(!delivery)
        if (carryOut) {
            setHasCarryOutButtonBeenClicked(!hasCarryOutButtonBeenClicked)
            setCarryOut(!carryOut)
        }
    }

    async function updateOrderLocationAndDeliveryAddress (event, currentCart) {
        event.preventDefault()
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart/${currentCart.id}/orderoptions`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    deliveryAddress: deliveryAddress,
                    orderLocation: selectedStoreLocation
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
                    <button id="deliveryChoice"onClick={DeliveryTrue} className={hasDeliveryButtonBeenClicked ? "orderOptionsButtonHighlight": null}>Delivery</button>
                    <button id="carryoutChoice"onClick={CarryoutTrue} className={hasCarryOutButtonBeenClicked ? "orderOptionsButtonHighlight": null}>Carry Out</button>
                </section>
            </section>

            

            {carryOut || delivery ? (
                <div id="locationsContainerContainer">
                    <div id="locationsContainer">
                    {delivery ? (
                        <div>
                            <form onSubmit={(event) => updateOrderLocationAndDeliveryAddress(event, currentCart)}>
                                <div id="alldeliveryform">
                                    <h3>Enter Delivery Address:</h3>
                                    <input
                                        id="deliveryform" 
                                        type="text"
                                        placeholder="Delivery Address"
                                        onChange = {(event) => setDeliveryAddress(event.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                    ): ""}

                        <h3 id="selectlocation">Select A Location:</h3>
                        <form id="formLocationContainer">
                            
                            <section className="location">
                                <section className="locationInfoContainer">
                                    <div className="locationTitleAndRadioButton">
                                        <input className="orderOptionsRadio" type="radio" name="location" onClick={() => setSelectedStoreLocation("4342 N Liberty Road, New York City, New York, 10001")} />
                                        <section className="locationTitle">
                                            Cyber Net
                                        </section>
                                    </div>

                                    <section className="addressContainer">
                                        
                                        <section className="locationStreetContainer">
                                            <section className="locationStreetTitle">
                                                Street
                                            </section>

                                            <section className="locationStreet">
                                                4342 N Liberty Road
                                            </section>
                                        </section>

                                        <section className="locationCityContainer">
                                            <section className="locationCityTitle">
                                                City
                                            </section>

                                            <section className="locationCity">
                                                New York City
                                            </section>
                                        </section>

                                        <section className="locationStateContainer">
                                            <section className="locationStateTitle">
                                                State
                                            </section>

                                            <section className="locationState">
                                                New York
                                            </section>
                                        </section>

                                        <section className="locationZipContainer">
                                            <section className="locationZipTitle">
                                                Zip
                                            </section>

                                            <section className="locationZip">
                                                10001
                                            </section>
                                        </section>

                                    </section>
                                </section>
                            </section>

                            <section className="location">
                                <section className="locationInfoContainer">
                                    <div className="locationTitleAndRadioButton">
                                        <input className="orderOptionsRadio" type="radio" name="location" onClick={() => setSelectedStoreLocation("3697 S Red Planet Road," + " New York City," + " New York," + " 70810")}/>
                                        <section className="locationTitle">
                                            Techno Corp
                                        </section>
                                    </div>

                                    <section className="addressContainer">

                                        <section className="locationStreetContainer">
                                            <section className="locationStreetTitle">
                                                Street
                                            </section>

                                            <section className="locationStreet">
                                                3697 S Red Planet Road
                                            </section>
                                        </section>

                                        <section className="locationCityContainer">
                                            <section className="locationCityTitle">
                                                City
                                            </section>

                                            <section className="locationCity">
                                                New York City
                                            </section>
                                        </section>

                                        <section className="locationStateContainer">
                                            <section className="locationStateTitle">
                                                State
                                            </section>

                                            <section className="locationState">
                                                New York
                                            </section>
                                        </section>

                                        <section className="locationZipContainer">
                                            <section className="locationZipTitle">
                                                Zip
                                            </section>

                                            <section className="locationZip">
                                                70810
                                            </section>
                                        </section>

                                    </section>
                                </section>
                            </section>

                            <section className="location" >
                                <section className="locationInfoContainer">
                                    <div className="locationTitleAndRadioButton">
                                        <input className="orderOptionsRadio" type="radio" name="location" onClick={() => setSelectedStoreLocation("6201 Whispering Pines Lane, New York City, New York, 03429")}/>
                                        <section className="locationTitle">
                                            Synth Runner
                                        </section>
                                    </div>
                                    
                                    <section className="addressContainer">

                                        <section className="locationStreetContainer">
                                            <section className="locationStreetTitle">
                                                Street
                                            </section>

                                            <section className="locationStreet">
                                                6201 Whispering Pines Lane
                                            </section>
                                        </section>

                                        <section className="locationCityContainer">
                                            <section className="locationCityTitle">
                                                City
                                            </section>

                                            <section className="locationCity">
                                                New York City
                                            </section>
                                        </section>

                                        <section className="locationStateContainer">
                                            <section className="locationStateTitle">
                                                State
                                            </section>

                                            <section className="locationState">
                                                New York
                                            </section>
                                        </section>

                                        <section className="locationZipContainer">
                                            <section className="locationZipTitle">
                                                Zip
                                            </section>

                                            <section className="locationZip">
                                                03429
                                            </section>
                                        </section>

                                    </section>
                                </section>
                            </section>

                        </form>   
                    </div>
                    <form id="continueToCartButtonForm" onSubmit={(event) => updateOrderLocationAndDeliveryAddress(event, currentCart)}>
                        <div id="buttoncartcontainer">
                            <Link to="/checkout"><button type="submit" id="submitbuttontocart">Continue To Cart</button></Link>
                        </div>
                    </form>
                </div>
            ): ""}   
        </div>
    )
}
export default OrderOptions;