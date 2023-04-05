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
    const [myId, setMyId] = useState(null)

    // const thisUser = props.currentUser

    // const {id} = useParams()
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
        fetchUserById()
    }, [])

    

    console.log("This is the thisUser...",thisUser)
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
            <button onClick={handleLogout}>Log Out Of This Account</button>
            <button onClick={deleteAccount}>Delete This Account</button>
            
        </div>
    )
}
export default Profile;

