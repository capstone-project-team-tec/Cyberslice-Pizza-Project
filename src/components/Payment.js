import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./payment.css";
import "./global.css";

const Payment = (props) => {
  

  
    return (
        <div id="paymentComponent">
            <div id="paymentTitleContainer">
                <h3>Payment Info</h3>
            </div>
            <div id="paymentInfoContainer">
                <div className="input-row">
                    <div className="input-field">
                        <label htmlFor="cardHolder">Card Holder</label>
                        <input type="text" id="cardHolder" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="mm_yy">MM/YY</label>
                        <input type="text" id="mm_yy" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="cvc">CVC</label>
                        <input type="text" id="cvc" />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-field">
                        <label htmlFor="billingAddress">Billing Address</label>
                        <input type="text" id="billingAddress" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="state">State</label>
                        <input type="text" id="state" />
                    </div>
                    <div className="input-field">
                        <label htmlFor="zip">Zip</label>
                        <input type="text" id="zip" />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Payment;
