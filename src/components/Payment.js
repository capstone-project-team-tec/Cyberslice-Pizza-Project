import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./payment.css";
import "./global.css";

const Payment = (props) => {
    const navigate = useNavigate();
    const { fetchUserCurrentCart,currentUser, currentCart, setCurrentCart, subTotalDisplay, totalCost, setCurrentOrderItems } = props;
    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [MMYY, setMMYY] = useState('');
    const [CVV, setCVV] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');    

    // this function runs the switch statement to set the payment info for the target input field's state and adds/removes the hasValue class for styling
    const handleInputChange = (event) => {
        const targetInput = event.target;
        setPaymentInfo(targetInput.id, targetInput.value);

        if (targetInput.value) {
            targetInput.classList.add('hasValue');
        } else {
            targetInput.classList.remove('hasValue');
        }
    };

    // this function sets the payment info for whichever field had a value entered into it
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

    // this function submits payment information by concatenating the billing address together, and submitting it along with the relevant states
    async function submitPaymentInfo() {
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
        } catch (error) {
            console.log(error)
        }
    };
    
    // this function finalizes checkout by changing the current cart isCheckedOut to a value of true and submitting the total cost of the order
    async function finalizeCheckOut() {
        
        try { 
            const response = await fetch(`http://localhost:1337/api/cart/${currentCart.id}`, {
                method: "PATCH", 
                headers: {
                    'Content-Type': "application/json",
                },

                body: JSON.stringify ({
                    totalCost: totalCost
                })
            })
        } catch (error) {
            console.log(error)
        }
    };

    // this function checks to make sure the input does not include numbers
    function validateCardHolder(cardHolder) {
        const numbers = "1234567890";

        for (let i = 0; i < numbers.length; i++) {
            if (cardHolder.includes(numbers[i])) {
                return false;
            }
        }
        return true;
    }

    // this function checks to make sure the input does not include letters
    function validateCardNumber(cardNumber) {
        const lowerCardNumber = cardNumber.toLowerCase();
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
        for (let i = 0; i < alphabet.length; i++) {
            if (lowerCardNumber.includes(alphabet[i])) {
                return false;
            }
        }
        return true;
    }

    // this function checks to make sure the input does not include letters
    function validateMMYY(MMYY) {
        const lowerMMYY = MMYY.toLowerCase();
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
        for (let i = 0; i < alphabet.length; i++) {
            if (lowerMMYY.includes(alphabet[i])) {
                return false;
            }
        }
        return true;
    }

    // this function checks to make sure the input does not include letters
    function validateCVV(CVV) {
        const lowerCVV = CVV.toLowerCase();
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
        for (let i = 0; i < alphabet.length; i++) {
            if (lowerCVV.includes(alphabet[i])) {
                return false;
            }
        }
        return true;
    }

    // this function checks to make sure the input does not include numbers
    function validateCity(city) {
        const numbers = "1234567890";

        for (let i = 0; i < numbers.length; i++) {
            if (city.includes(numbers[i])) {
                return false;
            }
        }
        return true;
    }

    // this function checks to make sure the input does not include numbers
    function validateState(state) {
        const numbers = "1234567890";

        for (let i = 0; i < numbers.length; i++) {
            if (state.includes(numbers[i])) {
                return false;
            }
        }
        return true;
    }

    // this function checks to make sure the input does not include letters
    function validateZip(zip) {
        const lowerZip = zip.toLowerCase();
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
        for (let i = 0; i < alphabet.length; i++) {
            if (lowerZip.includes(alphabet[i])) {
                return false;
            }
        }
        return true;
    }

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
        
        
            if (result.success) {
                setCurrentCart({
                    id: result.id,
                    isCheckedOut: result.isCheckedOut,
                    totalCost: result.totalCost,
                    userId: result.userId
                })
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error creating cart for guest:', error);
        }
    }

    // this function checks to make input fields have all been typed into and that they have the correct type of characters, otherwise it will throw an alert, then it submits the payment information to db, then finalizes checkout, then creates a new cart, sets that cart as currentCart, and sets currentOrderItems to empty array
    const handleCheckoutClick = async () => {
        if (cardHolder == '' || cardNumber == '' || MMYY == '' || CVV == '' || billingAddress == '' || city == '' || state == '' || zip == '') {
            alert("Please fill out all payment information fields.")    
        } else if (validateCardHolder(cardHolder) == false) {
            alert("Please provide a valid card holder name.");
        } else if (validateCardNumber(cardNumber) == false) {
            alert("Please provide a valid card number.");
        } else if (validateMMYY(MMYY) == false) {
            alert("Please provide a valid expiration date (MM/YY).");
        } else if (validateCVV(CVV) == false) {
            alert("Please provide a valid security code.");
        } else if (validateCity(city) == false) {
            alert("Please provide a valid city.");
        } else if (validateState(state) == false) {
            alert("Please provide a valid state.");
        } else if (validateZip(zip) == false) {
            alert("Please provide a valid zip.");
        } else {
            await submitPaymentInfo();
            await finalizeCheckOut();

            if (currentUser) {
                const newUserCartForAfterCheckout = await  fetchUserCurrentCart();
                await setCurrentCart(newUserCartForAfterCheckout);
            } else {
                await createCartForGuest();
            }
            await setCurrentOrderItems([]);
            alert("Your order has been successfully completed!")
            navigate("/");
        } 
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
                        <div className="inputRow">
                            <div className="inputField">
                                <label htmlFor="cardHolder">Card Holder</label>
                                <input type="text" id="cardHolder" onChange={handleInputChange}/>
                            </div>
                            <div className="inputField">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" onChange={handleInputChange}/>
                            </div>
                            <div className="inputField">
                                <label htmlFor="mm_yy">MM/YY</label>
                                <input type="text" id="mm_yy" onChange={handleInputChange}/>
                            </div>
                            <div className="inputField">
                                <label htmlFor="cvv">CVV</label>
                                <input type="text" id="cvv" onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className="inputRow">
                            <div className="inputField">
                                <label htmlFor="billingAddress">Billing Address</label>
                                <input type="text" id="billingAddress" onChange={handleInputChange}/>
                            </div>
                            <div className="inputField">
                                <label htmlFor="city">City</label>
                                <input type="text" id="city" onChange={handleInputChange}/>
                            </div>
                            <div className="inputField">
                                <label htmlFor="state">State</label>
                                <input type="text" id="state" onChange={handleInputChange}/>
                            </div>
                            <div className="inputField">
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
                        <p className="price  textNoMarginOrPad">${subTotalDisplay}</p>
                    </div>
                    <div id="deliveryFee">
                        <p id="deliveryFeeText" className="textNoMarginOrPad">Delivery Fee:</p>
                        <p className="price  textNoMarginOrPad">$10.00</p>
                    </div>
                </div>
                <div id="total">
                    <p  className="textNoMarginOrPad">Total:</p>
                    <p className="price textNoMarginOrPad">${totalCost}</p>
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
