//This is the Frontend index.js
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes, Link, } from "react-router-dom"
import { Checkout, Desserts, Drinks, Home, Locations, Login, OrderOptions, Pizza, Sides, Header, Footer, Register, Menu } from "./components"

const App = () => {
    const [drinks, setDrinks] = useState([])
    const [desserts, setDesserts] = useState([])
    const [sides, setSides] = useState([])
    const [currentUser, setCurrentUser] = useState({})

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
        if (localStorage.token) {

        try {
            const response = await fetch(`http://localhost:1337/api/users` , {
            headers: {
                'Content-Type': 'appplication/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
        });
            
           const data = await response.json();
           
           setCurrentUser(data)
           console.log(data)

        } catch(error) {
            console.log(error)
        }
    }
    else {
        setCurrentUser("")
    }
}

useEffect(()=> {
    fetchDesserts();
    fetchDrinks();
    fetchSides();
    fetchCurrentUser();
}, [])

console.log(desserts, drinks, sides, currentUser)




    return (

        <BrowserRouter>
            <div>
                <Header />
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/pizza" element={<Pizza />}/>
                        <Route path="/drinks" element={<Drinks drinks={drinks}/>}/>
                        <Route path="/sides" element={<Sides sides={sides}/>} />
                        <Route path="/desserts" element={<Desserts desserts={desserts}/>} />
                        <Route path="/login" element={<Login setCurrentUser={setCurrentUser}/>} />
                        <Route path="/orderoptions" element={<OrderOptions />} />
                        <Route path="/locations" element={<Locations />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/register" element={<Register setCurrentUser={setCurrentUser}/>} />
                        <Route path="/menu" element={<Menu />} />
                    </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    )
}

const appElt = document.getElementById("app");
const root = createRoot(appElt)
root.render(<App />)