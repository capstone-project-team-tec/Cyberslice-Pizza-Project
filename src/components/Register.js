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
    const [ CurrentUser, setCurrentUser ] = useState({})


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

            const response = await fetch(`http://localhost:1337/api/users/register`, {
                method: "POST", 
                headers: {
                    'Content-Type': "application/json",
                },

                body: JSON.stringify ({
                        username: username,
                        password: password,
                        email: email,
                        address: address,
                        phone: phone
                })
            })

            const resultData = await response.json();

            console.log(resultData)


            if (!resultData.token) {
                alert("Unable to create account, please try again")
            } else {
                const myJWT = resultData.token;
                localStorage.setItem("token", myJWT) 
                setCurrentUser({username, password, email, address, phone})
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <section id = "registerContainer">
            {/* Register */}
            <section className = "registerTitle"> 
                Sign Up
                <br></br>
            </section>
            
            <section className = "formAndPicture">
                <form onSubmit={(event) => {
                        event.preventDefault()
                        accountRegistration()}}> 
                    <h2>Username</h2>
                    <input
                        className = "registerBox"
                        type="text"
                        placeholder=""
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <h2>Password</h2>
                    <input
                        className = "registerBox"
                        type="text"
                        placeholder=""
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <h2>Email</h2>
                    <input
                        className = "registerBox"    
                        type="text"
                        placeholder=""
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <h2>Address</h2>
                    <input 
                        className = "registerBox"
                        type="text"
                        placeholder=""
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                    />
                    <h2>Phone</h2>
                    <input 
                        className = "registerBox"
                        type="text"
                        placeholder=""
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                    <button className="registerButton" type="submit"> Create Account </button>
                    
                </form>
                <section className = "picture">
                    This is where a picture of pizza would go. Yeah.
                </section>
            </section>
        </section>
    )
}

export default Register