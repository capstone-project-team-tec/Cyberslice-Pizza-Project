import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./admin.css"
import "./global.css"

const Admin = (props) => {
    const [toggleUsers, setToggleUsers] = useState("false")
    const [toggleProducts, setToggleProducts] = useState("false")
    const [allUsers, setAllUsers] = useState({})
    const [allProducts, setAllProducts] = useState({})
    const { products, users } = props

    function toggleUsersToDeleteandUpdate() {
        setToggleUsers(!toggleUsers)
    }

    function toggleDrinksToDeleteandUpdate() {
        setToggleProducts(!toggleProducts)
    }

    // async function fetchAllUsers() {
    //     try {
    //         const response = await fetch(`http://localhost:1337/api/admin/users`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${localStorage.getItem("token")}`
    //             },
    //         }) 
    //         const result = await response.json()
    //         setAllUsers(result)

    //     } catch(error) {
    //         console.log(error)
    //     }
    //  }

    //  async function fetchAllProducts() {
    //     try {
    //         const response = await fetch(`http://localhost:1337/api/admin/products`, {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": `Bearer ${localStorage.getItem("token")}`
    //             },
    //         }) 
    //         const result = await response.json()
    //         setAllProducts(result)

    //     } catch(error) {
    //         console.log(error)
    //     }
    //  }

    //  useEffect(()=> {
    //     fetchAllUsers();
    //     fetchAllProducts();
        
    // }, [])
    return (
        <div>
            <button onClick={toggleUsersToDeleteandUpdate}>Users</button>
            <button onClick={toggleDrinksToDeleteandUpdate}>Drinks</button>

            {
        toggleUsers && products.length > 0 ? (
            products.map((singleProduct) => {
                return (
                    <div key={singleProduct.id}>
                        <img src = {singleDrink.image} id = "itemPic"> 
                      </img>
                        <h2>Name: {singleProduct.name}</h2>
                        <h2>Catergory: {singleProduct.catergory}</h2>
                        <h2>Price: {singleProduct.price}</h2>
                    </div>
                        );
                   })
                ) : ""
            }
            
        </div>
    )
}

export default Admin;