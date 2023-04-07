import { useEffect, useState } from "react"
import "./sides.css"
import "./global.css"

const Sides = (props) => {
    const { currentCart, currentUser, setCurrentCart, fetchUserCurrentCart, sides } = props;
    // const [allSides, setAllSides] = useState([]);
    const [currentCartId, setCurrentCartId] = useState(props.currentCart.id);
    const [addedSideId, setAddedSideId] = useState(null);

    const showAddedToCartNotification = (id) => {
        setAddedSideId(id);
        setTimeout(() => {
            setAddedSideId(null);
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
    //   setCurrentCartId(result.id)
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
      console.log("a current cart was found in sides.  ", currentCart);
      cartId = currentCart.id;
    }
    createOrderItem(cartId, productId, count, cost, productName);
  };

//   const createOrderItemsRow = async (cartId, productId, count, cost, productName) => {
//     if (props.currentCart == {}){
//         await createCartForGuest();
//         cartId = guestCartId
//         console.log("no current user was found in sides")
//     } else {
//         console.log("a current user was found in sides.  ",props.currentCart)
//     }
//     try {
//       const response = await fetch(`http://localhost:1337/api/cart/orderitems`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           cartId,
//           productId,
//           count,
//           cost,
//           productName
//         }),
//       });

//       const result = await response.json();
//       console.log(result);
//       showAddedToCartNotification(productId);
//     } catch (error) {
//       console.log(error);
//     }
//   };

    return(
        <div>
            <h1>Cyberslice Sides</h1>

        {
            sides.length > 0 ? (sides.map((singleSide) => {
                return (
                    <div key={singleSide.id}>
                        <h2>{singleSide.name}</h2>
                        <h2>Price: {singleSide.price}</h2>
                        <button
                            onClick={() => {
                                createOrderItemsRow(
                                    // currentCartId,
                                    singleSide.id,
                                    1,
                                    singleSide.price,
                                    singleSide.name
                                );
                            }}
                        >
                            Add to Order
                        </button>
                        {addedSideId === singleSide.id && (
                            <span className="added-to-cart-message">Added to cart!</span>
                        )} 
                    </div>
                )
            })
            ) : <div>No Sides Yet </div>
        }
        </div>
    )
}
export default Sides;