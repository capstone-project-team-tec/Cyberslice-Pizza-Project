import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./register.css"
import "./global.css"

const Register = () => {
    //Register
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ address, setAddress ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ phone, setPhone ] = useState("");


    const navigate = useNavigate();

    async function accountRegistration() {
        try { 

            if ( username.length < 9 ) {
                alert("Username does not meet requirement, please try again");
                return;
            } else if ( password.length < 9 ) {
                alert("Password does not meet requirements, please try again")
              return;
            }

            const response = await fetch(`https://localhost:1337/users/register`, {
                method: "POST", 
                headers: {
                    'Content-Type': "application/json",
                },

                body: JSON.stringify ({
                        username: username,
                        password: password,
                })
            })

            const resultData = await response.json();

            console.log(resultData)

            if (!resultData.token) {
                alert("Unable to create account, please try again")
            } else {
                const myJWT = resultData.token;
                localStorage.setItem("token", myJWT) 
                setCurrentUser({username, password})
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <section>
            {/* Register */}
            <h3> Create New Account </h3>
            
            <form onSubmit={(event) => {
                    event.preventDefault()
                    accountRegistration()}}> 
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <input
                    type="text"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit"> Create Account </button>
            </form>
            
        </section>
    )
}

export default Register