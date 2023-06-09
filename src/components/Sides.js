import { useEffect, useState } from "react"
import "./sides.css"
import "./global.css"

const Sides = (props) => {

  // Setting states
  const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, sides } = props;
  const [currentCartId, setCurrentCartId] = useState(props.currentCart.id);
  const [addedSideId, setAddedSideId] = useState(null);

  // AddToCart notification.
  const showAddedToCartNotification = (id) => {
      setAddedSideId(id);
      setTimeout(() => {
          setAddedSideId(null);
      }, 2000);
  };

  // Creating a guest cart. 
  let guestCartId
  async function createCartForGuest() {
    try {
      const response = await fetch('https://cyberslice-backend.onrender.com/api/cart', {
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

  // Add a side to a cart.
  const AddToCart = ({ side }) => {
    const [quantity, setQuantity] = useState(1);
    return (
      <div id="addToCartContainer">
        <button id="addToCartButton" onClick={() => {
          createOrderItemsRow(
            // currentCartId,
            side.id,
            quantity,
            side.price,
            side.name
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
  
  // Display a list of side items and let users add them to a cart.
  const Sides = ({ sides }) => {
    return (
      <div>
        <h1>Sides</h1>
        {sides.map((side) => (
          <AddToCart key={side.id} drink={side} />
        ))}
      </div>
    );
  };

  // Create a new order item using a POST request.
  const createOrderItem = async (cartId, productId, count, cost, productName) => {
    try {
      const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart/orderitems`, {
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

  // Create a new order items row in the database.
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
      console.log("a current cart was found in sides.  ", currentCart);
      cartId = currentCart.id;
    }
    createOrderItem(cartId, productId, count, cost, productName);
  };

return (
  <div>
    <section id= "sidesContainer">
      <section id = "sidesPageTitle">Sides</section>

      <section id = "itemsList"> 
        {sides.length > 0 ? (
          sides.filter(product => product.isActive === true).map((singleSide) => {
            return (
              <section key={singleSide.id} id = "itemContainer">
                  <div>
                    <section id = "imageContainer"> 
                      <img src = {singleSide.image} id = "itemPic">
                      </img>
                    </section>

                    <section id = "itemDetails">

                      <section id = "itemTitle">{singleSide.name}</section>
                      <section id = "itemCost"> ${singleSide.price}</section>

                      <AddToCart key={singleSide.id} side = {singleSide} />
                      
                    </section>
                    {addedSideId === singleSide.id && (
                      <span className="added-to-cart-message">Added to cart!</span>
                    )}
                  </div>
                </section>
            );
          })
        ) : (
          <div>No Sides Yet</div>
        )}
      </section>
    </section>
  </div>
);
}
export default Sides;