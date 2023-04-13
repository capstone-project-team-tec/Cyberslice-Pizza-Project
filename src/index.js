//This is the Frontend index.js
import {useEffect, useState, useRef} from "react"
import {createRoot} from "react-dom/client"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import {Checkout, Desserts, Drinks, Home, Locations, Login, OrderOptions, Pizza, Sides, Header, Footer, Register, Menu, Profile, Admin, Adminlogin, Payment} from "./components"

const App = () => {

    // State variables to manage data of the user's options.
    const [drinks, setDrinks] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [sides, setSides] = useState([]);
    const [products, setProducts] = useState([])
    const [users, setUsers] = useState([])
    const [currentUser, setCurrentUser] = useState({});
    const [currentCart, setCurrentCart] = useState({});
    const [currentAdminUser, setCurrentAdminUser] = useState({});
    const [currentUserTrue, setCurrentUserTrue ] = useState(false);
    const [currentAdminUserTrue, setCurrentAdminUserTrue ] = useState(false);
    const [subTotalDisplay,setSubTotalDisplay] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [currentOrderItems, setCurrentOrderItems] = useState([])

    // useRef hook reference object used across components, determines if component is being rendered.
    const isFirstRender = useRef(true);

    // useEffect hooks that fetches data from the server.
    useEffect(()=> {
        fetchDesserts();
        fetchDrinks();
        fetchSides();
        fetchUsers();
        fetchCurrentUser();
        fetchCurrentAdminUser();
    }, [])
    
    // hook executed after every update of currentUser. Gets shopping cart data.
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        fetchUserCurrentCart();
    }, [currentUser]);

    // log current cart
    useEffect(() => {
        console.log("true current cart: ", currentCart);
    }, [currentCart]);
    
    // Creates the cart for an authorized user.
    async function createCartForUser() {
        console.log("create cart for user function has started running...")
        try {
            const token = localStorage.getItem("token")
            const response = await fetch('http://localhost:1337/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId: currentUser.id
                }),
            });
      
            const result = await response.json();
            
            setCurrentCart({
                id: result.id,
                userId: result.userId,
                isCheckedOut: result.isCheckedOut,
                totalCost: result.totalCost,
                deliveryAddress: result.deliveryAddress,
                orderLocation: result.orderLocation
            })
            if (result.success) {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error creating cart for user:', error);
        }
    }

    // Fetches and sets the current authorized user's cart via JWT.
    async function fetchUserCurrentCart() {
        try {
            const token = localStorage.getItem("token");
        
            if (!token) {
                return;
            }
            const response = await fetch(`http://localhost:1337/api/cart`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (!result.failure){
                let filteredResult = result.filter(cart => cart.isCheckedOut == false && cart.userId == currentUser.id);
                if (filteredResult.length > 0){
                    const cartForState = filteredResult[0];
                    setCurrentCart(cartForState);
                } else {
                    createCartForUser();
                }
            } else {
                createCartForUser();
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    // Sets data for the user from the admin.
    async function fetchUsers() {
        try {
            const response = await fetch(`http://localhost:1337/api/admin/users`);
            const data = await response.json();
            setUsers(data)
        } catch(error) {
            console.log(error)
        }
    }

    // Sets drinks.
    async function fetchDrinks() {
        try {
            const response = await fetch(`http://localhost:1337/api/drinks`);
            const data = await response.json();
            setDrinks(data)
        } catch(error) {
            console.log(error)
        }
    }
    
    // Sets desserts.
    async function fetchDesserts() {
        try {
            const response = await fetch(`http://localhost:1337/api/desserts`);
            const data = await response.json()
            setDesserts(data)
        } catch(error) {
            console.log(error)
        }
    }

    // Sets sides.
    async function fetchSides() {
        try {
            const response = await fetch(`http://localhost:1337/api/sides`);
            const data = await response.json();
            setSides(data)
        } catch(error) {
            console.log(error)
        }
    }

    // Sets the current authorized user.
    async function fetchCurrentUser() {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const response = await fetch(`http://localhost:1337/api/users/me`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                const result = await response.json()
                setCurrentUser(result.user)
            } catch(error) {
                console.log(error)
            }
        }
        else {
            setCurrentUser("")
        }
    }

    // Sets the current authorized admin user.
    async function fetchCurrentAdminUser() {
        const token = localStorage.getItem("token");

        if(token) {
            try {
                const response = await fetch(`http://localhost:1337/api/users/admin`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                })
                const result = await response.json()
                setCurrentAdminUser(result.user)
                setCurrentAdminUserTrue(true)
            } catch (error) {
                console.log(error)
            }
        }
        else {
            setCurrentAdminUser("")
        }
    }

    return (
        <BrowserRouter>
            <div>
                <Header currentUser={currentUser} setCurrentUser={setCurrentUser} currentAdminUser={currentAdminUser} setCurrentAdminUser={setCurrentAdminUser} setCurrentAdminUserTrue={setCurrentAdminUserTrue} setCurrentUserTrue={setCurrentUserTrue} setCurrentCart={setCurrentCart}/>
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/pizza" element={<Pizza drinks={drinks} fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart}/>}/>
                        <Route path="/drinks" element={<Drinks drinks={drinks} fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart} />}/>
                        <Route path="/sides" element={<Sides currentUser={currentUser} fetchUserCurrentCart={fetchUserCurrentCart} currentCart={currentCart} setCurrentCart={setCurrentCart} sides={sides}/>} />
                        <Route path="/desserts" element={<Desserts currentUser={currentUser} fetchUserCurrentCart={fetchUserCurrentCart} currentCart={currentCart} setCurrentCart={setCurrentCart} desserts={desserts}/>} />
                        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} setCurrentUserTrue={setCurrentUserTrue}/>} />
                        <Route path="/orderoptions" element={<OrderOptions currentUser={currentUser} setCurrentUser={setCurrentUser} currentCart={currentCart} setCurrentCart={setCurrentCart}/>} />
                        <Route path="/locations" element={<Locations />} />
                        <Route path="/checkout" element={<Checkout currentOrderItems={currentOrderItems} setCurrentOrderItems={setCurrentOrderItems} totalCost={totalCost} setTotalCost={setTotalCost} subTotalDisplay={subTotalDisplay} setSubTotalDisplay={setSubTotalDisplay} currentCart={currentCart} />} />
                        <Route path="/register" element={<Register setCurrentUser={setCurrentUser} setCurrentUserTrue={setCurrentUserTrue}/>} />
                        <Route path="/profile" element={<Profile currentCart={currentCart} currentUser={currentUser} setCurrentUser={setCurrentUser} setCurrentUserTrue={setCurrentUserTrue}/>}/>
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/admin" element={<Admin fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart} setCurrentUser={setCurrentUser} products={products} users={users} currentAdminUser={currentAdminUser} sides={sides} drinks={drinks} desserts={desserts} setDrinks={setDrinks} setSides={setSides} setDesserts={setDesserts}/>} />
                        <Route path="/adminlogin" element={<Adminlogin setCurrentAdminUser={setCurrentAdminUser} setCurrentAdminUserTrue={setCurrentAdminUserTrue}/>} />
                        <Route path="/payment" element={<Payment setCurrentOrderItems={setCurrentOrderItems} totalCost={totalCost} subTotalDisplay={subTotalDisplay} fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart}/>} />
                    </Routes>
                <Footer currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            </div>
        </BrowserRouter>
    )
}

const appElt = document.getElementById("app");
const root = createRoot(appElt)
root.render(<App />)