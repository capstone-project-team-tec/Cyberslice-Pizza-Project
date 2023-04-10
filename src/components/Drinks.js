import React, { useEffect, useState } from "react";
import "./drinks.css";
import "./global.css";

const Drinks = (props) => {
  const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, drinks } = props;
  const [addedDrinkId, setAddedDrinkId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const showAddedToCartNotification = (id) => {
    setAddedDrinkId(id);
    setTimeout(() => {
      setAddedDrinkId(null);
    }, 2000);
  };
  
  let guestCartId
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
      setCurrentCart({
        id: result.id,
        isCheckedOut: result.isCheckedOut,
        totalCost: result.totalCost,
        userId: result.userId
    })
      // setCurrentCartId(result.id)
      guestCartId = result.id
      if (result.success) {
        console.log('A new cart has been created for the guest. here is the result:  ',result );
        return result;
      } else {
        console.log('Failed to create a new cart for the guest:', result.error.message);
        return null;
      }
    } catch (error) {
      console.error('Error creating cart for guest:', error);
    }
  }

  const AddToCart = ({ drink }) => {
    const [quantity, setQuantity] = useState(1);
    return (
      <div id="addToCartContainer">
        <button id="addToCartButton" onClick={() => {
          createOrderItemsRow(
            // currentCartId,
            drink.id,
            quantity,
            drink.price,
            drink.name
          ) ; }}
        > Add to cart</button>

        <section id="addToCartQuantityContainer">
          <button className="quantityChangeButton" onClick={() => setQuantity((prevQuantity) => prevQuantity - 1)}>
            -
          </button>
          <span id = "quantityContainer">{quantity}</span>
          <button className="quantityChangeButton" onClick={() => setQuantity((prevQuantity) => prevQuantity + 1)}>
            +
          </button>
        </section>
      </div>
    );
  };
  const Drinks = ({ drinks }) => {
    return (
      <div>
        <h1>Drinks</h1>
        {drinks.map((drink) => (
          <AddToCart key={drink.id} drink={drink} />
        ))}
      </div>
    );
  };

  const createOrderItem = async (cartId, productId, count, cost, productName) => {
    try {
      const response = await fetch(`http://localhost:1337/api/cart/orderitems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          productId,
          count,
          cost,
          productName
        }),
      });
      const result = await response.json();
      console.log(result);
      showAddedToCartNotification(productId);
    } catch (error) {
      console.log(error);
    }
  };


  const createOrderItemsRow = async (productId, count, cost, productName) => {
    let cartId;
    if (Object.keys(currentCart).length == 0) {
      console.log("this is createOrderItemsRow firing on the if currentCart length equals zero");
      if (currentUser) {
        console.log("this is the current user:   ", currentUser);
        await fetchUserCurrentCart();
        cartId = currentCart.id;
      } else {
        await createCartForGuest();
        cartId = guestCartId;
      }
    } else {
      console.log("a current cart was found in drinks.  ", currentCart);
      cartId = currentCart.id;
    }
    createOrderItem(cartId, productId, count, cost, productName);
  };

  return (
    <div>
      <section id= "drinksContainer">
        <section id = "drinksPageTitle">Drinks</section>

        <section id = "itemsList"> 
          {drinks.length > 0 ? (
            drinks.filter(product => product.isActive === true).map((singleDrink) => {
                return (
                  <section id = "itemContainer">
                      <div key={singleDrink.id}>
                        <section id = "imageContainer"> 
                          <img src = {singleDrink.image} id = "itemPic">
                          </img>
                        </section>

                        <section id = "itemDetails">

                          <section id = "itemTitle">{singleDrink.name}</section>
                          <section id = "itemCost"> ${singleDrink.price}</section>

                          <AddToCart key={singleDrink.id} drink = {singleDrink} />
                          
                        </section>
                        {addedDrinkId === singleDrink.id && (
                          <span className="added-to-cart-message">Added to cart!</span>
                        )}
                      </div>
                    </section>
                );
              })
          ) : (
            <div>No Drinks Yet</div>
          )}
        </section>
      </section>
    </div>
  );
};

export default Drinks;