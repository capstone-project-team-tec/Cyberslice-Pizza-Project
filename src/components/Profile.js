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
            {
                thisUser.username ? (
                    <div>
                        <h1>Username: {thisUser.username}</h1>
                        
                        <h1>Name: {thisUser.name}</h1>
                        
                        <h1>Email: {thisUser.email}</h1>
                        
                        <h1>Phone: {thisUser.phone}</h1>
                        
                        <h1>Address: {thisUser.address}</h1>
                    
                    <button onClick={editEntriesForm}>Edit</button>

                    {
                        editEntries ? (
                            <div>
                        <form onSubmit={updateUserById}>
                        <input 
                        type="text"
                        defaultValue={thisUser.username}
                        onChange={(event) => setUsername(event.target.value)}
                        />
                        <input
                        type="text"
                        defaultValue={thisUser.name}
                        onChange={(event) => setName(event.target.value)}
                        />
                        <input
                        type="text"
                        defaultValue={thisUser.email}
                        onChange={(event) => setEmail(event.target.value)}
                        />
                        <input
                        type="text"
                        defaultValue={thisUser.phone}
                        onChange={(event) => setPhone(event.target.value)}
                        />
                        <button type="submit">Update</button>
                        </form>
                            </div>
                        ):""
                    }
                    <button onClick={editAddressForm}>Edit</button>
                    {
                        editAddress ? (
                            <form onSubmit={updateUserById}>
                                <input 
                                type="text"
                                placeholder="address"
                                value={address}
                                onChange={(event) => setAddress(event.target.value)}/>
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
    <div className="orders">
      <h2>Order History:</h2>


{
  Array.isArray(cartOrderItems) && cartOrderItems.length > 0 ? (
    cartOrderItems.map((cart, index) => (
      <div key={index}>
        <h3>Cart ID: {cart.id}</h3>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
                {item.productName}
              ${item.cost} x {item.count} 
            </li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <p>No items in cart</p>
  )
}
    </div>
  </div>
 

            
            

            
            <button onClick={handleLogout}>Log Out Of This Account</button>
            <button onClick={deleteAccount}>Delete This Account</button>
            
        </div>
    )
}
export default Profile;

