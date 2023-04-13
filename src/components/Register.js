import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./register.css"
import "./global.css"

const Register = (props) => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ address, setAddress ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ name, setName ] = useState("");
    const { setCurrentUserTrue, setCurrentUser, createCartForUser } = props

    const navigate = useNavigate();

    // Check if the username is long enough. Otherwise, make the border RED.
    function verifyStringLength(username) {
        if (username.target.value.length < 9) {
            return false;
        } else {
            return true;
        }
    }
    
    const emailTitle = document.querySelector('#emailTitle');
    
    //Verifying that the username has the correct requirements
    function verifyUsername(event) {
        const input = event.target;
        const usernameTitle = document.querySelector('#usernameTitle');
        
        if (!verifyStringLength(event)) {
            input.classList.add('invalid');
            usernameTitle.classList.add('invalid');
            usernameTitle.textContent = "Username - Username is too short."

            if (input.classList.contains('valid')) {
                input.classList.remove('valid');
            }

            if (usernameTitle.classList.contains('valid')) {
                usernameTitle.classList.remove('valid');
            }
        } else {
            input.classList.add('valid');
            usernameTitle.classList.add('valid');
            usernameTitle.textContent = "Username ✔"

            if (input.classList.contains('invalid')) {
                input.classList.remove('invalid');
            }
            if (passwordTitle.classList.contains('invalid')) {
                passwordTitle.classList.remove('invalid');
            }
        }
    }
    //Verifying that the password the password has the correct requirements
    function verifyPassword(event) {
        const input = event.target;
        const passwordTitle = document.querySelector('#passwordTitle');

        if (!verifyStringLength(event)) {
            input.classList.add('invalid');
            passwordTitle.classList.add('invalid');
            passwordTitle.textContent = "Password - Password is too short."
            
            if (input.classList.contains('valid')) {
                input.classList.remove('valid');
            }

            if (passwordTitle.classList.contains('valid')) {
                passwordTitle.classList.remove('valid');
            }
        } else {
            input.classList.add('valid');

            passwordTitle.classList.add('valid');
            passwordTitle.textContent = "Password ✔";

            if (input.classList.contains('invalid')) {
                input.classList.remove('invalid');
            }
            if (passwordTitle.classList.contains('invalid')) {
                passwordTitle.classList.remove('invalid');
            }
        }
    }
    //Verifying the email contains the correct requirements
    function verifyEmail(event) {
        const input = event.target;
        if (!email.includes("@") || !email.includes("."))  {
            input.classList.add('invalid');
            emailTitle.classList.add('invalid');
            emailTitle.textContent = "Email - Email is not valid."
            
            if (input.classList.contains('valid')) {
                input.classList.remove('valid');
            }

            if (emailTitle.classList.contains('valid')) {
                emailTitle.classList.remove('valid');
            }
        } else {
            input.classList.add('valid');
            emailTitle.classList.add('valid');
            emailTitle.textContent = "Email ✔";

            if (input.classList.contains('invalid')) {
                input.classList.remove('invalid');
            }
            if (emailTitle.classList.contains('invalid')) {
                emailTitle.classList.remove('invalid');
            }
        }
    }
    //Account registration function
    async function accountRegistration() {
        try { 
            if ( username.length < 9 ) {
                alert("Username does not meet requirement, please try again");
                return;
            } else if ( password.length < 9 ) {
                alert("Password does not meet requirements, please try again")
                return;
            }

            const response = await fetch(`https://cyberslice-backend.onrender.com/api/users/register`, {
                method: "POST", 
                headers: {
                    'Content-Type': "application/json",
                },

                body: JSON.stringify ({
                    username: username,
                    password: password,
                    name: name,
                    email: email,
                    address: address,
                    phone: phone
                })
            })

            const resultData = await response.json();
            if (!resultData.token) {
                alert("Unable to create account, please try again")
            } else {
                const myJWT = resultData.token;
                localStorage.setItem("token", myJWT) 
                await setCurrentUser(resultData.user)
                await setCurrentUserTrue(true)
                await createCartForUser()
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            alert("Username or Email Address entered may already have been taken. Please try to change these then re-submit.")
        }
    }

    return (
        <section id = "registerContainer">
            <section className = "registerPageTitle"> 
                Sign Up
                <br></br>
            </section>
            
            <section className = "formAndPicture">
                <form onSubmit={(event) => {
                    event.preventDefault()
                    accountRegistration()
                }}> 
                    <h2 id = "usernameTitle"
                        className = "registerBoxTitle"
                        onChange={(event) => {
                            verifyUsername(event);
                            setUsername(event.target.value);
                        }}
                    >
                        Username
                    </h2>
                    <input
                        className = "registerBox"
                        type="text"
                        placeholder=""
                        value={username}
                        onChange={(event) => {verifyUsername(event);
                            setUsername(event.target.value);
                        }}
                    />
                    <h2 id = "passwordTitle"
                        className = "registerBoxTitle"
                        onChange={(event) => {
                            verifyPassword(event);
                            setUsername(event.target.value);
                        }}
                    >
                        Password
                    </h2>
                    <input
                        className = "registerBox"
                        type="password"
                        placeholder=""
                        value={password}
                        onChange={(event) => { verifyPassword(event);
                            setPassword(event.target.value)
                        }}
                    />
                    <h2 id = "emailTitle"
                        className = "registerBoxTitle"
                        onChange={(event) => {
                            verifyEmail(event);
                            setUsername(event.target.value);
                        }}
                    >
                        Email
                    </h2>
                    <input
                        className = "registerBox"    
                        type="text"
                        placeholder=""
                        value={email}
                        onChange={(event) =>  { verifyEmail(event);
                            setEmail(event.target.value);
                        }}
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
                    <h2>Name</h2>
                    <input 
                        className = "registerBox"
                        type="text"
                        placeholder=""
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <button className="registerButton" type="submit"> Create Account </button>
                </form>
                <section className = "picture">
                    <img id="slicesInRows" src="/slicesInRows.jpg" alt="Image of pizza slices in rows"/>
                </section>
            </section>
        </section>
    )
}

export default Register