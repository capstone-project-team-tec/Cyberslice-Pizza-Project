import { useEffect, useState } from "react";
import "./drinks.css";
import "./global.css";

const Drinks = (props) => {
  const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, drinks } = props;
  // const [currentCartId, setCurrentCartId] = useState(props.currentCart.id)
  const [addedDrinkId, setAddedDrinkId] = useState(null);
  // const [singleDrinkId, setSingleDrinkId] = useState('');
  // const [singleDrinkPrice, setSingleDrinkPrice] =useState('');
  // const [singleDrinkName, setSingleDrinkName] =useState('');

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
  
  // useEffect(() => {
  //   if (Object.keys(currentCart).length != 0) {
  //     createOrderItem(currentCartId, singleDrinkId, 1, singleDrinkPrice, singleDrinkName);
  //   }
  // }, [currentCart]);


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
      <h1>Cyberslice Drinks</h1>

      {drinks.length > 0 ? (
        drinks.map((singleDrink) => {
          return (
            <div key={singleDrink.id}>
              <h2>{singleDrink.name}</h2>
              <h2> Price: {singleDrink.price}</h2>
              <button
                onClick={() => {
                  // setSingleDrinkId(singleDrink.id);
                  // setSingleDrinkPrice(singleDrink.price);
                  // setSingleDrinkName(singleDrink.name);
                  createOrderItemsRow(
                    // currentCartId,
                    singleDrink.id,
                    1,
                    singleDrink.price,
                    singleDrink.name
                  );
                }}
              >
                Add to Order
              </button>
              {addedDrinkId === singleDrink.id && (
                <span className="added-to-cart-message">Added to cart!</span>
              )}
            </div>
          );
        })
      ) : (
        <div>No Drinks Yet</div>
      )}
    </div>
  );
};

export default Drinks;