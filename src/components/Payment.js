import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./payment.css";
import "./global.css";

const Payment = (props) => {
    const navigate = useNavigate();
    const { fetchUserCurrentCart,currentUser, currentCart, setCurrentCart, setCurrentUser } = props;
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [MMYY, setMMYY] = useState('');
    const [CVV, setCVV] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    
    // const handleInputChange = (event) => {
    //     const inputElement = event.target;
    //     if (inputElement.value) {
    //         inputElement.classList.add('has-value');
    //     } else {
    //         inputElement.classList.remove('has-value');
    //     }
    // };

    // function setPaymentInfo() {
    //     set
    // }

    const handleInputChange = (event) => {
        const inputElement = event.target;
        setPaymentInfo(inputElement.id, inputElement.value);

        if (inputElement.value) {
            inputElement.classList.add('has-value');
        } else {
            inputElement.classList.remove('has-value');
        }
    };

    function setPaymentInfo(id, value) {
        switch (id) {
            case 'cardHolder':
                setCardHolder(value);
                break;
            case 'cardNumber':
                setCardNumber(value);
                break;
            case 'mm_yy':
                setMMYY(value);
                break;
            case 'cvv':
                setCVV(value);
                break;
            case 'billingAddress':
                setBillingAddress(value);
                break;
            case 'city':
                setCity(value);
                break;
            case 'state':
                setState(value);
                break;
            case 'zip':
                setZip(value);
                break;
            default:
                break;
        }
    }

    async function submitPaymentInfo() {
        console.log("Submitting payment info...");
        const concatenatedBillingAddress = (billingAddress + ', ' + city + ', ' + state + ', ' + zip)
        try { 
            const response = await fetch(`http://localhost:1337/api/cart/${currentCart.id}/payment`, {
                method: "POST", 
                headers: {
                    'Content-Type': "application/json",
                },

                body: JSON.stringify ({
                    cardholderName:cardHolder,
                    cardNumber:cardNumber,
                    expirationDate:MMYY,
                    cvv:CVV,
                    billingAddress:concatenatedBillingAddress
                })
            })

            const resultData = await response.json();

            console.log(resultData)

        } catch (error) {
            console.log(error)
        }
    };
    
    async function finalizeCheckOut() {
        
        try { 
            const response = await fetch(`http://localhost:1337/api/cart/${currentCart.id}`, {
                method: "PATCH", 
                headers: {
                    'Content-Type': "application/json",
                },

                body: JSON.stringify ({
                    totalCost: '799.12'
                })
            })

            const resultData = await response.json();

            console.log(resultData)

        } catch (error) {
            console.log(error)
        }
        console.log("Finished checkout");
    };

    const handleCheckoutClick = () => {
        setPaymentInfo();
        if (cardHolder != '' && cardNumber != '' && MMYY != '' && CVV != '' && billingAddress != '' && city != '' && state != '' && zip != '') {
            submitPaymentInfo();
            finalizeCheckOut();
            navigate("/");
        } else {alert("Please fill out all payment information fields.")}
    };
  
    return (
        <div id="paymentComponent">
            <div id="paymentTitleContainer">
                <h1>Payment Info</h1>
            </div>
            <div id="paymentInfoContainer">
                <div id="paymentMethodContainer">
                    <p id="paymentMethod">Payment Method</p>
                </div>
                <div id="paymentInfoFieldsContainerContainer">
                    <div id="paymentInfoFieldsContainer">
                        <div className="input-row">
                            <div className="input-field">
                                <label htmlFor="cardHolder">Card Holder</label>
                                <input type="text" id="cardHolder" onChange={handleInputChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" onChange={handleInputChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="mm_yy">MM/YY</label>
                                <input type="text" id="mm_yy" onChange={handleInputChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="cvv">CVV</label>
                                <input type="text" id="cvv" onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="input-row">
                            <div className="input-field">
                                <label htmlFor="billingAddress">Billing Address</label>
                                <input type="text" id="billingAddress" onChange={handleInputChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" onChange={handleInputChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="state">State</label>
                                <input type="text" id="state" onChange={handleInputChange}/>
                            </div>
                            <div className="input-field">
                                <label htmlFor="zip">Zip</label>
                                <input type="text" id="zip" onChange={handleInputChange}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="lowerContainer">
                <div id="subtotalAndDeliveryFee">
                    <div id="subtotal">
                        <p id="subtotalText" className="textNoMarginOrPad">Subtotal:</p>
                        <p className="price  textNoMarginOrPad">$23.12</p>
                    </div>
                    <div id="deliveryFee">
                        <p id="deliveryFeeText" className="textNoMarginOrPad">Delivery Fee:</p>
                        <p className="price  textNoMarginOrPad">$10.00</p>
                    </div>
                </div>
                <div id="total">
                    <p  className="textNoMarginOrPad">Total:</p>
                    <p className="price textNoMarginOrPad">$33.12</p>
                </div>
                <div id="checkoutButtonContainer">
                    <button id="checkoutButton" type="submit" onClick={handleCheckoutClick}>
                        CHECK OUT
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Payment;
