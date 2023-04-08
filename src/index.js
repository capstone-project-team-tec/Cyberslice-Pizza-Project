//This is the Frontend index.js
import { useEffect, useState, useRef } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Checkout, Desserts, Drinks, Home, Locations, Login, OrderOptions, Pizza, Sides, Header, Footer, Register, Menu, Profile, Admin, Adminlogin, Payment } from "./components"

const App = () => {
    const [drinks, setDrinks] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [sides, setSides] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [currentCart, setCurrentCart] = useState({});
    
    const isFirstRender = useRef(true);

    useEffect(()=> {
        fetchDesserts();
        fetchDrinks();
        fetchSides();
        fetchCurrentUser();
    }, [])
    
    useEffect(() => {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          return;
        }
        fetchUserCurrentCart();
    }, [currentUser]);

    useEffect(() => {
        console.log("true current cart: ", currentCart);
    }, [currentCart]);
      
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
          console.log("this is the create cart for user result:   ",result)
          setCurrentCart({
            id: result.id,
            userId: result.userId,
            isCheckedOut: result.isCheckedOut,
            totalCost: result.totalCost})
          if (result.success) {
            console.log('A new cart has been created for the user. here is the result:  ',result );
            return result;
          } else {
            console.log('Failed to create a new cart for the user:', result.error.message);
            return null;
          }
        } catch (error) {
          console.error('Error creating cart for user:', error);
        }
      }

    async function fetchUserCurrentCart() {
        try {
            const token = localStorage.getItem("token");
        
            if (!token) {
            console.log("No token found, skipping request");
            return;
            }
        console.log("this is line 77 right before the response triggers")
            const response = await fetch(`http://localhost:1337/api/cart`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            });

            const result = await response.json();
            if (!result.failure){
                console.log("this is the result of fetch user current cart, it has not yet been filtered, this is line 91 of src index file:   ",result);
                let filteredResult = result.filter(cart => cart.isCheckedOut == false);
                if (filteredResult.length > 0){
                    const cartForState = filteredResult[0];
                    setCurrentCart(cartForState);
                    console.log("filtered result was not empty")
                } else {
                    console.log("this is the current user id:   ",currentUser.id)
                    createCartForUser(currentUser.id)
                    console.log("filtered result was in fact empty")
                }
            } else {
                console.log("the result failure had a truthy value for fetchUserCurrentCart request, creating an initial cart for the user now.");
                createCartForUser(currentUser.id);
            }
        } catch (error) {
            console.log(error);
        }
    }      

    async function fetchDrinks() {
        try {
            const response = await fetch(`http://localhost:1337/api/drinks`);

            const data = await response.json();

            setDrinks(data)
        } catch(error) {
            console.log(error)
        }
    }
    
    async function fetchDesserts() {
        try {
            const response = await fetch(`http://localhost:1337/api/desserts`);

            const data = await response.json()

            setDesserts(data)

        } catch(error) {
            console.log(error)
        }
    }

    async function fetchSides() {
        try {
            const response = await fetch(`http://localhost:1337/api/sides`);

            const data = await response.json();

            setSides(data)
        } catch(error) {
            console.log(error)
        }
    }

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

console.log("This is the current user on line 166 of src index file:   ",currentUser)
// desserts, drinks, sides,



    return (

        <BrowserRouter>
            <div>
                <Header currentUser={currentUser} setCurrentUser={setCurrentUser}/>
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/pizza" element={<Pizza />}/>
                        <Route path="/drinks" element={<Drinks drinks={drinks} fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart} />}/>
                        <Route path="/sides" element={<Sides currentUser={currentUser} fetchUserCurrentCart={fetchUserCurrentCart} currentCart={currentCart} setCurrentCart={setCurrentCart} sides={sides}/>} />
                        <Route path="/desserts" element={<Desserts currentUser={currentUser} fetchUserCurrentCart={fetchUserCurrentCart} currentCart={currentCart} setCurrentCart={setCurrentCart} desserts={desserts}/>} />
                        <Route path="/login" element={<Login setCurrentUser={setCurrentUser}/>} />
                        <Route path="/orderoptions" element={<OrderOptions currentUser={currentUser}/>} />
                        <Route path="/locations" element={<Locations />} />
                        <Route path="/checkout" element={<Checkout currentUser={currentUser} currentCart={currentCart} />} />
                        <Route path="/register" element={<Register setCurrentUser={setCurrentUser}/>} />
                        <Route path="/profile" element={<Profile currentCart={currentCart} currentUser={currentUser} setCurrentUser={setCurrentUser}/>}/>
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/admin" element={<Admin fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart} setCurrentUser={setCurrentUser}/>} />
                        <Route path="/adminlogin" element={<Adminlogin setCurrentUser={setCurrentUser}/>} />
                        <Route path="/payment" element={<Payment fetchUserCurrentCart={fetchUserCurrentCart} currentUser={currentUser} currentCart={currentCart} setCurrentCart={setCurrentCart} setCurrentUser={setCurrentUser}/>} />
                    </Routes>
                <Footer currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            </div>
        </BrowserRouter>
    )
}

const appElt = document.getElementById("app");
const root = createRoot(appElt)
root.render(<App />)