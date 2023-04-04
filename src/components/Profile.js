import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./profile.css"
import "./global.css"

const Profile = (props) => {
    const [thisUser, setThisUser] = useState({})

    // const thisUser = props.currentUser

    const {id} = useParams()
    const navigate = useNavigate();


    const handleLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        
        navigate('/');
    }

    async function fetchUserById() {
        try {
        const response = await fetch(`http://localhost:1337/api/users/me`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            const result = await response.json()

            setThisUser(result)
        } catch(error) {
            console.log(error)
        }
    }

    async function updateUserById() {
        try {
            // const response = await fetch(`http://`)

        } catch(error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        fetchUserById()
    }, [])

    


    return (
        <div>
            {
                thisUser.username ? (
                    <h1>{thisUser.username}</h1>
                    
                ): ""
            }
             {/* {
                thisUser.length > 0 ? (thisUser.map((singleUser) => {
                    return (
                        <div key={singleUser.id}>
                            <h2>Username: {singleUser.username}</h2>
                            <h2> Address {singleUser.address}</h2>
                            <h2>Phone: {singleUser.phone}</h2>
                            </div>
                    )
                })
                ): <div> Please login to view profile</div>
            } */}
            <button onClick={handleLogout}>Log Out Of This Account</button>
            
        </div>
    )
}
export default Profile;