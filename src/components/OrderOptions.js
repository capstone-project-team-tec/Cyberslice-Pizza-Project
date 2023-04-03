//This is the CarryOut or Delivery page
import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./orderOptions.css"
import "./global.css"

const OrderOptions = (props) => {
    const [carryOut, setCarryOut] = useState(false)
    const [delivery, setDelivery] = useState(false)
    const [deliveryAddress, setDeliveryAddress] = useState("")

    function CarryoutTrue() {
        setCarryOut(!carryOut)
    }

    function DeliveryTrue() {
        setDelivery(!delivery)
    }
    return(
        <div>
            <h2>Please Choose a method:</h2>
            <div id="button">
            <button id="c"onClick={CarryoutTrue}>Carry Out</button>
            <button id="d"onClick={DeliveryTrue}>Delivery</button>
            </div>

            {
                carryOut ? (
            <div id="form">
                        <h3>Please Select Location:</h3>
                <form>
                   <label className="checkbox" htmlFor="checkbox1">
                    <input type="radio" id="checkbox1" name="location" /> 3697 S Red Planet Rd, Mars
                </label>
                    <label className="checkbox" htmlFor="checkbox2">
                    <input type="radio" id="checkbox2" name="location"/> 6201 Whispering Pines Lane, Mongolia  
                </label>
                <label className="checkbox" htmlFor="checkbox3">
                <input type="radio" id="checkbox3" name="location" /> 1969 Lunah Heights Blvd, Moon
                </label>


                <button id="submit"type="submit"><Link to="/checkout">Next</Link></button>

                    </form>
                    </div>

                ): ""
            }
            {
                delivery ? (
                    <form id="form" className="delivery">
                        <input
                        id="deliveryaddress" 
                        type="text"
                        placeholder="Please Enter Address"
                        value={deliveryAddress}
                        onChange={(event) => setDeliveryAddress(event.target.value)}/>
                        <button id="submit" type="submit"><Link to="/checkout">Next</Link></button>
                    </form>
                ): ""
            }
            
        </div>
    )
}
export default OrderOptions;