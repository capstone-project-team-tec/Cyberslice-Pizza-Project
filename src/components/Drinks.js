import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./drinks.css"
import "./global.css"

const Drinks = (props) => {
    const [MyDrinks, setMyDrinks] = useState([])

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
    }
    useEffect(() => {
        fetchAllDrinks();
    }, [])

    console.log(MyDrinks)
    

    return (
        <div>
            <h1>Cyberslice Drinks</h1>
            
            {
                MyDrinks.length > 0 ? (MyDrinks.map((singleDrink) => {
                    return (
                        <div key={singleDrink.id}>
                            <h2>{singleDrink.name}</h2>
                            <h2> Price: {singleDrink.price}</h2>
                            </div>
                    )
                })
                ): <div> No drinks yet</div>
            }
        </div>
    )
}

export default Drinks;