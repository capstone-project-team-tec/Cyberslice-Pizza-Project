import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./admin.css"
import "./global.css"

const Admin = (props) => {
    const [toggleUsers, setToggleUsers] = useState("false")
    const [toggleProducts, setToggleProducts] = useState("false")
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [myId, setMyId] = useState(null);
    const [editUser, setEditUser] = useState(false)
    const { products, users, currentUser } = props
    const [allUsers, setAllUsers] = useState({})
    

    function toggleUsersToDeleteandUpdate() {
        setToggleUsers(!toggleUsers)
    }

    function toggleDrinksToDeleteandUpdate() {
        setToggleProducts(!toggleProducts)
    }
    function editUserForm() {
        setEditUser(!editUser)
    }

    async function fetchUserById(event) {
        try {
        const response = await fetch(`http://localhost:1337/api/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            const result = await response.json()

            setAllUsers(result.user)
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

    async function updateUserById(event) {
        event.preventDefault()
        console.log("This is the update user by id function")
        console.log(name, address, phone)
        console.log("this is the currentUser.id", currentUser.id)
        try {
            const response = await fetch(`http://localhost:1337/api/admin/users/${currentUser.id}`, {
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
        

        } catch(error) {
            console.log(error)
        }
    }

    async function deleteAccount(event) {
        event.preventDefault()
        try {
            const response = await fetch(`http://localhost:1337/api/users/${id}`, {
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

            setAllUsers(result)

            
            console.log(result);
            return result
          } catch (error) {
            console.error(error);
          }
      }

    useEffect(()=> {
        fetchUserById();
    }, [])
    return (
        <div>
            <button onClick={toggleUsersToDeleteandUpdate}>Users</button>
            <button onClick={toggleDrinksToDeleteandUpdate}>Drinks</button>

            {
        toggleUsers && users.length > 0 ? (
            users.map((singleUser) => {
                return (
                    <div key={singleUser.id}>
                        <h2>Id: {singleUser.id}</h2>
                        <h2>Username: {singleUser.username}</h2>
                        <h2>Name: {singleUser.name}</h2>
                        <h2>Email: {singleUser.email}</h2>
                        <h2>Phone: {singleUser.phone}</h2>
                        <h2>Address: {singleUser.address}</h2>
                        <button onClick={editUserForm}>Edit User</button>
                        <button onClick={deleteAccount}>Delete This Account</button>
                        {
                            editUser ? (
                                <div>
                                    <form onSubmit={updateUserById}>
                                    <section>
                                    <h6>Enter New Username:</h6>
                                    <input
                                    type="text"
                                    defaultValue={allUsers.username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    />
                                    </section>
                                    <section>
                                    <h6>Enter New Name:</h6>
                                    <input 
                                    type="text"
                                    defaultValue={allUsers.name}
                                    onChange={(event) => setName(event.target.value)}
                                    />
                                    </section>
                                    <section>
                                    <h6>Enter New Email:</h6>
                                    <input
                                    type="text"
                                    defaultValue={allUsers.email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    />
                                    </section>
                                    <section>
                                    <h6>Enter New Phone:</h6>
                                    <input 
                                    type="text"
                                    defaultValue={allUsers.phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                    />
                                    </section>
                                    <section>
                                    <h5>Enter New Address:</h5>
                                    <input 
                                    type="text"
                                    placeholder="address"
                                    value={allUsers.address}
                                    onChange={(event) => setAddress(event.target.value)}/>
                                </section>
                                <p> </p>
                                <button id="button1"type="submit">Update</button>
                                    

                                    </form>
                                    </div>
                            ):""
                        }
                    </div>
                        );
                   })
                
                ) : ""
            }
            
        </div>
    )
}

export default Admin;