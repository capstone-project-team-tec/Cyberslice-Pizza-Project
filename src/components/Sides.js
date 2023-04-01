import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "./sides.css"
import "./global.css"

const Sides = (props) => {
    const [allSides, setAllSides] = useState([]);

    const fetchAllSides = async (event) => {
        try {
            const response = await fetch(`https://localhost:1337/api/sides`, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const result = await response.json();

            setAllSides(result)

        } catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllSides();
    }, [])

    return(
        <div>
            <h1>Cyberslice Sides</h1>

        {
            allSides.length > 0 ? (allSides.map((singleSide) => {
                return (
                    <div key={singleSide.id}>

                        <h2>Placeholder for Link {singleSide.name}</h2>
                        <h4>Price: {singleSide.price}</h4> 
                        </div>
                )
            })
            ) : <div>No Sides Yet </div>
        }
        </div>
    )
}
export default Sides;