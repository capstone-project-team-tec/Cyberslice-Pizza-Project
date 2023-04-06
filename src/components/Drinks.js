import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./drinks.css";
import "./global.css";

const Drinks = (props) => {
  const [MyDrinks, setMyDrinks] = useState([]);
  const [currentCartId, setCurrentCartId] = useState(props.currentCart.id)

  const fetchAllDrinks = async (event) => {
    try {
            const response = await fetch(`http://localhost:1337/api/drinks`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const result = await response.json();

            setMyDrinks(result)

        } catch(error) {
            console.log(error)
        }
  };

  useEffect(() => {
    fetchAllDrinks();
  }, []); 
  
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
      props.setCurrentCart({
        id: result.id,
        isCheckedOut: result.isCheckedOut,
        totalCost: result.totalCost,
        userId: result.userId
    })
      setCurrentCartId(result.id)
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

  const createOrderItemsRow = async (cartId, productId, count, cost, productName) => {
    if (props.currentCart == {}){
        await createCartForGuest();
        cartId = guestCartId
        console.log("no current user was found in drinks")
    } else {
        console.log("a current user was found in drinks.  ",props.currentCart)
    }
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
    } catch (error) {
      console.log(error);
    }
  };

  console.log(MyDrinks);

  return (
    <div>
      <h1>Cyberslice Drinks</h1>

      {MyDrinks.length > 0 ? (
        MyDrinks.map((singleDrink) => {
          return (
            <div key={singleDrink.id}>
              <h2>{singleDrink.name}</h2>
              <h2> Price: {singleDrink.price}</h2>
              <button
                onClick={() =>
                  createOrderItemsRow(
                    currentCartId,
                    singleDrink.id,
                    1,
                    singleDrink.price,
                    singleDrink.name
                  )
                }
              >
                Add to Order
              </button>
            </div>
          );
        })
      ) : (
        <div>No drinks yet</div>
      )}
    </div>
  );
};

export default Drinks;











// import { useEffect, useState } from "react"
// import { Link } from "react-router-dom"
// import "./drinks.css"
// import "./global.css"

// const Drinks = (props) => {
//     const [MyDrinks, setMyDrinks] = useState([])

//     const fetchAllDrinks = async (event) => {
//         try {
//             const response = await fetch(`http://localhost:1337/api/drinks`, {
//                 headers: {
//                     "Content-Type": "application/json"
//                 }
//             })
//             const result = await response.json();

//             setMyDrinks(result)

//         } catch(error) {
//             console.log(error)
//         }
//     }
//     useEffect(() => {
//         fetchAllDrinks();
//     }, [])

//     console.log(MyDrinks)
    
//     return (
//         <div>
//             <h1>Cyberslice Drinks</h1>
            
//             {
//                 MyDrinks.length > 0 ? (MyDrinks.map((singleDrink) => {
//                     return (
//                         <div key={singleDrink.id}>
//                             <h2>{singleDrink.name}</h2>
//                             <h2> Price: {singleDrink.price}</h2>
//                         </div>
//                     )
//                 })
//                 ): <div> No drinks yet</div>
//             }
//         </div>
//     )
// }

// export default Drinks;