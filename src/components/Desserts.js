import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./desserts.css"
import "./global.css"

const Desserts = (props) => {
    const [MyDesserts, setMyDesserts] = useState([])

    const fetchAllDesserts = async (event) => {
        try {
            const response = await fetch(`http://localhost:1337/api/desserts`, {
                headers: {
                    "Content-Type": "application/json",   
                }
            })
            const result = await response.json()
            console.log(result)

            setMyDesserts(result)
        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllDesserts();
    }, [])

    return(
        <div>
            <h1>Cyberslice Desserts</h1>

            {
            MyDesserts.length > 0 ? (MyDesserts.map((singleDessert) => {
                return (
                    <div key={singleDessert.id}>

                        <h2>{singleDessert.name}</h2>
                        <h4>Price: {singleDessert.price}</h4> 
                        </div>
                )
            })
            ) : <div>No Desserts Yet </div>
        }
        </div>
    )
}
export default Desserts;