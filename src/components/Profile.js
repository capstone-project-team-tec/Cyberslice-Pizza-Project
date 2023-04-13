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

   

    const navigate = useNavigate();

  //This is toggling logout
    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        
        navigate('/');
    }
    //Toggling Edit User Form
    async function editEntriesForm() {
        setEditEntries(!editEntries)
    }
    //Toggling Edit Address Form
    async function editAddressForm() {
        setEditAddress(!editAddress)
    }

    //Function to fetch carts by user so we can render in order history
    async function fetchCartsByUser() {
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
            const result = await response.json();

            setUserCarts(result)


        } catch(error) {
            console.log(error)
        }
    }

    //Fetching order items from the single cart
    let orderItemsArray = []
    async function fetchOrderItems() {
        userCarts.map(async (singleCart) => {
          try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/cart/${singleCart.id}`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
              },
            });
            
            const result = await response.json();
            orderItemsArray.push(result)

            setCartOrderItems(orderItemsArray)

          } catch (error) {
            console.log(error);
          }
        });
      }   

    //This function is fetching the user by id so the user has option to update or delete info
    async function fetchUserById(event) {
        try {
        const response = await fetch(`https://cyberslice-backend.onrender.com/api/users/me`, {
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
    //Function for user to delete account
    async function deleteAccount(event) {
        event.preventDefault()
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/users/me`, {
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
            
            return result
          } catch (error) {
            console.error(error);
          }
      }
      //Function that allows the user to update their info
    async function updateUserById(event) {
        event.preventDefault()
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/users/me`, {
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
            const result = await response.json();

            setThisUser(result)
            localStorage.removeItem('token');
        
            navigate('/');

        } catch(error) {
            console.log(error)
        }
    }

    //Upon loading web page we want these functions to run
    useEffect(()=> {
        fetchUserById();
        fetchCartsByUser();
    }, [])

    //Fetch order items function runs after userCarts is set
    useEffect(() => {
        fetchOrderItems()
    }, [userCarts])


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
                                defaultValue={thisUser.address}
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


   
  <div className="profile-page">
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

