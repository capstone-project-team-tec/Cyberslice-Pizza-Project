import { useEffect, useState } from "react"
import "./desserts.css"
import "./global.css"

const Desserts = (props) => {
  const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, desserts } = props;
  const [addedDessertId, setAddedDessertId] = useState(null);
  // const [quantity, setQuantity] = useState(1);

    //Added to cart notification
  const showAddedToCartNotification = (id) => {
      setAddedDessertId(id);
      setTimeout(() => {
      setAddedDessertId(null);
      }, 2000);
  };

  //Creating a cart for a guest upon clicking on add to cart
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
      guestCartId = result.id
      if (result.success) {
        return result;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  //Add to cart button and option to increase quantity
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

  //Creating an order item
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

  //Creating an order item row in table
  const createOrderItemsRow = async (productId, count, cost, productName) => {
    let cartId;
      if (Object.keys(currentCart).length == 0) {
        if (currentUser) {
          await fetchUserCurrentCart();
          cartId = currentCart.id;
      } else {
          await createCartForGuest();
          cartId = guestCartId;
      }
    } else {
      cartId = currentCart.id;
    }
    createOrderItem(cartId, productId, count, cost, productName);
  };

    return(
      <div>
      <section id= "dessertsContainer">
        <section id = "dessertsPageTitle">Desserts</section>

        <section className = "itemsList"> 
          {desserts.length > 0 ? (
            desserts.filter(product => product.isActive === true).map((singleDessert) => {
              return (
                <section key={singleDessert.id} id = "itemContainer">
                    <div>
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