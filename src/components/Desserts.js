import { useEffect, useState } from "react"
import "./desserts.css"
import "./global.css"

const Desserts = (props) => {
  const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, desserts } = props;
  const [addedDessertId, setAddedDessertId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const showAddedToCartNotification = (id) => {
      setAddedDessertId(id);
      setTimeout(() => {
        setAddedDessertId(null);
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

  const AddToCart = ({ dessert }) => {
    const [quantity, setQuantity] = useState(1);
    return (
      <div id="addToCartContainer">
        <button id="addToCartButton" onClick={() => {
          createOrderItemsRow(
            // currentCartId,
            dessert.id,
            quantity,
            dessert.price,
            dessert.name
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

  const Desserts = ({ desserts }) => {
    return (
      <div>
        <h1>Desserts</h1>
        {desserts.map((dessert) => (
          <AddToCart key={dessert.id} dessert={dessert} />
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
      console.log("a current cart was found in desserts.  ", currentCart);
      cartId = currentCart.id;
    }
    createOrderItem(cartId, productId, count, cost, productName);
  };

    return(
      <div>
      <section id= "dessertsContainer">
        <section id = "dessertsPageTitle">Desserts</section>

        <section id = "itemsList"> 
          {desserts.length > 0 ? (
            desserts.map((singleDessert) => {
              return (
                <section id = "itemContainer">
                    <div key={singleDessert.id}>
                      <section id = "imageContainer"> 
                        <img src = {singleDessert.image} id = "itemPic">
                        </img>
                      </section>

                      <section id = "itemDetails">

                        <section id = "itemTitle">{singleDessert.name}</section>
                        <section id = "itemCost"> ${singleDessert.price}</section>

                        <AddToCart key={singleDessert.id} dessert = {singleDessert} />
                        
                      </section>
                      {addedDessertId === singleDessert.id && (
                        <span className="added-to-cart-message">Added to cart!</span>
                      )}
                    </div>
                  </section>
              );
            })
          ) : (
            <div>No Desserts Yet</div>
          )}
        </section>
      </section>
    </div>

























        // <div>
        //     <h1>Cyberslice Desserts</h1>

        //     {
        //     desserts.length > 0 ? (desserts.map((singleDessert) => {
        //         return (
        //             <div key={singleDessert.id}>
        //                 <h2>{singleDessert.name}</h2>
        //                 <h2>Price: {singleDessert.price}</h2> 
        //                 <button
        //                     onClick={() => {
        //                         createOrderItemsRow(
        //                             // currentCartId,
        //                             singleDessert.id,
        //                             1,
        //                             singleDessert.price,
        //                             singleDessert.name
        //                         );
        //                     }}
        //                 >
        //                     Add to Order
        //                 </button>
        //                 {addedDessertId === singleDessert.id && (
        //                     <span className="added-to-cart-message">Added to cart!</span>
        //                 )}
        //             </div>
        //         )
        //     })
        //     ) : <div>No Desserts Yet </div>
        // }
        // </div>
    )
}
export default Desserts;