import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./profile.css"
import "./global.css"



const Profile = (props) => {
    const [thisUser, setThisUser] = useState({})
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [editEntries, setEditEntries] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const [myId, setMyId] = useState(null);
    const [userCarts, setUserCarts] = useState([]);
    const [cartOrderItems, setCartOrderItems] = useState([])
    const { currentUser, currentCart } = props

    // const thisUser = props.currentUser

    const {id} = useParams()
    const navigate = useNavigate();


    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        
        navigate('/');
    }

    async function editEntriesForm() {
        setEditEntries(!editEntries)
    }

    async function editAddressForm() {
        setEditAddress(!editAddress)
    }

    async function fetchCartsByUser() {
        try {
            const response = await fetch(`http://localhost:1337/api/cart`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            const result = await response.json();
            console.log("this is the result of fetchCartsByUser", result)

            setUserCarts(result)


        } catch(error) {
            console.log(error)
        }
    }
let orderItemsArray = []
    async function fetchOrderItems() {
        userCarts.map(async (singleCart) => {
          try {
            console.log("this is the single cart id", singleCart.id)
            const response = await fetch(`http://localhost:1337/api/cart/${singleCart.id}`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            });
            
            const result = await response.json();
            console.log(result);
            orderItemsArray.push(result)
            console.log(orderItemsArray)

            setCartOrderItems(orderItemsArray)


            


          } catch (error) {
            console.log(error);
          }
        });
      }

      
    
        

        

    async function fetchUserById(event) {
        try {
        const response = await fetch(`http://localhost:1337/api/users/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            const result = await response.json()

            setThisUser(result.user)
            setMyId(result.id)
            setUsername(result.user.username)
            setName(result.user.name)
            setEmail(result.user.email)
            setAddress(result.user.address)
            setPhone(result.user.phone)
            
        } catch(error) {
            console.log(error)
        }
    }
    async function deleteAccount(event) {
        event.preventDefault()
        try {
            const response = await fetch(`http://localhost:1337/api/users/me`, {
            method : `DELETE`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({
                id: myId
              })
            });
            const result = await response.json()
            if(result.success) {
                alert("Account has been deleted")
            }

            setThisUser(result)
            localStorage.removeItem("token")

            navigate('/')
            
            console.log(result);
            return result
          } catch (error) {
            console.error(error);
          }
      }

    async function updateUserById(event) {
        event.preventDefault()
        console.log("This is the update user by id function")
        console.log(name, address, phone)
        try {
            const response = await fetch(`http://localhost:1337/api/users/me`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: myId,
                    username: username,
                    name: name,
                    email: email,
                    address: address,
                    phone: phone
                }),
            })
            console.log("This is the response", JSON.stringify(response))
            const result = await response.json();
            


            console.log("this is the result", result)

            setThisUser(result)
            localStorage.removeItem('token');
        
            navigate('/');

        } catch(error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        fetchUserById();
        fetchCartsByUser();
    }, [])

    useEffect(() => {
        fetchOrderItems()
    }, [userCarts])

    
    console.log("this is the props.currentCart", props.currentCart)
    console.log("This is the thisUser...",thisUser)


console.log(cartOrderItems)

    return (
        <div>
            <h2 id="profile">{thisUser.name}'s Profile</h2>
            {
                thisUser.username ? (
                    <div>
                        <div className="parent">
                            <div id="split">
                        <h4 id="personalInfo">Personal Information</h4>
                        <button id="button"onClick={editEntriesForm}>Edit</button>
                            </div>

                        <div className="fields">
                            <div className="userinfo">
                                <section className="infocolumn">
                        <h5 className="userplace">Username</h5>
                        <h5>{thisUser.username}</h5> 
                            </section>
                        
                            <section className="infocolumn">
                        <h5 className="userplace">Name</h5>
                        <h5>{thisUser.name}</h5> 
                            </section>
                        
                            <section className="infocolumn">
                        <h5 className="userplace">Email</h5>
                        <h5>{thisUser.email}</h5>
                            </section>
                        
                            <section className="infocolumn">
                        <h5 className="userplace">Phone</h5>
                        <h5>{thisUser.phone}</h5>
                        </section>
                        </div>
                        
                        </div>
                        </div>
                    
                    {
                        editEntries ? (
                            <div>
                        <form onSubmit={updateUserById}>
                            <div id="form1">
                            <section>
                        <h6>Enter New Username:</h6>
                        <input
                        type="text"
                        defaultValue={thisUser.username}
                        onChange={(event) => setUsername(event.target.value)}
                        />
                        </section>
                            <section>
                        <h6>Enter New Name:</h6>
                        <input 
                        type="text"
                        defaultValue={thisUser.name}
                        onChange={(event) => setName(event.target.value)}
                        />
                        </section>
                        <section>
                        <h6>Enter New Email:</h6>
                        <input
                        type="text"
                        defaultValue={thisUser.email}
                        onChange={(event) => setEmail(event.target.value)}
                        />
                        </section>
                        <section>
                        <h6>Enter New Phone:</h6>
                        <input 
                        type="text"
                        defaultValue={thisUser.phone}
                        onChange={(event) => setPhone(event.target.value)}
                        />
                        </section>
                        </div>
                        
                        <p> </p>
                        <div id="button1">
                        <button type="submit">Update</button>
                        </div>
                        </form>
                            </div>
                        ):""
                    }

                    <div id="address">
                        <div id="split">
                        <h4 id="personalInfo" className="headaddress">Address</h4>
                        <button id="button" onClick={editAddressForm}>Edit</button>
                        </div>
                        <section id="street">
                        <h5 id="streethead">Street</h5>
                    <h5>{thisUser.address}</h5>
                        </section>
                    
                    </div>
                    {
                        editAddress ? (
                            
                            <form onSubmit={updateUserById}>
                            <div id="form2">
                                <h5>Enter New Address:</h5>
                                <input 
                                type="text"
                                placeholder="address"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}/>
                                <p> </p>
                                <button id="button1"type="submit">Update</button>
                                
                                </div>
                            </form>
                            

                        ):""
                    }
                        
                    </div>
                ): "Profile not found"
            }
            {/* <h2>Order History for {props.currentUser.name}</h2> */}
            {/* {
        props.currentUser.id == userCarts.userId ? (
    <div>
      {userCarts.isCheckedOut ? (
            <div>
                <h1>{cartOrderItems.name}</h1>
                <h1>{cart</h1>
            </div>
            ) : (
                <div>No carts Checked Out</div>
            )}
        </div>
        ) : (
            ""
        )
    } */}


   
  <div className="profile-page">
    {/* ... */}
    <h2>Order History:</h2>
    <div className="orders">
      
    {
  Array.isArray(cartOrderItems) && cartOrderItems.length > 0 ? (
    cartOrderItems.map((cart, index) => {
      let subtotal = 0;
      return (
        <div key={index}>
          {console.log(cart)}
          <h3>{cart.cartId}</h3>
          <div>
            <ul id="orders">
              {cart.map((item, index) => {
                subtotal += item.cost * item.count;
                return (
                  <div key={index}>
                    <h2 id="head">Product:</h2> 
                    { item.productName && item.productName.length > 0 ? (
                      <h2> x{item.count} {item.productName}</h2>
                    ) : null }
                    { item.pizzaName && item.pizzaName.length > 0 ? (   
                      <h2>x{item.count} {item.pizzaName} Pizza</h2>
                    ) : null }
                    <h2 id="head">Cost:</h2>
                    <h4>${item.cost} x {item.count} = ${item.cost * item.count}</h4>
                  </div>
                );
              })}
              <h4 id="subtotal">Subtotal: ${subtotal.toFixed(2)}</h4>
            </ul>
            
          </div>
        </div>
      );
    })
  ) : (
    <p>No Orders Found</p>
  )
}

{/* {
  Array.isArray(cartOrderItems) && cartOrderItems.length > 0 ? (
    cartOrderItems.map((cart, index) => (
      <div key={index}>
        {console.log(cart)}
        <h3>{cart.cartId}</h3>
        <div>
        <ul id="orders">
          {cart.map((item, index) => (
            <div key={index}>
                
                <h2 id="head">Product:</h2> 
            { item.productName && item.productName.length > 0 ? (
            <h2> x{item.count} {item.productName}</h2>
            ):""
            }
            { item.pizzaName && item.pizzaName.length > 0 ? (   
            <h2>x{item.count} {item.pizzaName} Pizza</h2>
            ):""
            } 
            <h2 id="head">Cost:</h2>
              <h4>${item.cost} x {item.count} = ${item.cost * item.count}</h4>
              

              

              
              </div>
          ))}
        </ul>
        <h4 id="subtotal">Subtotal: ${subtotal.toFixed(2)}</h4>
        
        </div>
      </div>
      
      
    ))
  ) : (
    <p>No Orders Found</p>
  )
} */}

    </div>
  </div>
 

            
            

            <div id="buttoncontainer">
            <button id="buttondelete"onClick={handleLogout}>Log Out Of This Account</button>
            <button id="buttondelete"onClick={deleteAccount}>Delete This Account</button>
            </div>
            
        </div>
    )
}
export default Profile;

