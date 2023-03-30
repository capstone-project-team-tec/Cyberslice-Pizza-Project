//This is the Frontend index.js
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRoute, Route, Routes, Link } from "react-router-dom"

const App = () => {
    return (

        <BrowserRouter>
        
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/pizza" element={<Pizza />}/>
            <Route path="/drinks" element={<Drinks />}/>
            <Route path="/sides" element={<Sides />} />
            <Route path="/desserts" element={<Desserts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orderoptions" element={<OrderOptions />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/checkout" element={<Checkout />} />
        </Routes>
        </BrowserRouter>
    )
}

const appElt = document.getElementById("app");
const root = createRoot(appElt)
root.render(<App />)