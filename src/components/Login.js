import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./login.css"
import "./global.css"

const Login = (props) => {
    //Register
    const [ username, setUsername ] = useState(" ");
    const [ password, setPassword ] = useState(" ");

    //Login
    const [ myUsername, setMyUsername ] = useState("");
    const [ myPassword, setMyPassword ] = useState("")

    const {setCurrentUser} = props;

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

    async function loginFunction(e) {
        e.preventDefault();
        try {
            const response = await fetch (`http://localhost:1337/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify ({
                    username: myUsername,
                    password: myPassword
                })
            })
            console.log("login is working")
            const result = await response.json();
            console.log(result)
            if (!result.token) {
                alert("Username or password is incorrect, please try again")
            } else {
                const myJWT = result.token;
                localStorage.setItem("token", myJWT)
                setCurrentUser({username: myUsername, password: myPassword})
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section> 

            {/* Login */}
            <h3> Login to your account</h3>
            <form onSubmit={loginFunction}>
                <input
                    type="text"
                    placeholder="Username"
                    value={myUsername}
                    onChange={(event) => setMyUsername(event.target.value)}
                />
                <input className="loginBox"
                    type="text"
                    placeholder="Password"
                    value={myPassword}
                    onChange={(event) => setMyPassword(event.target.value)}
                />
                <button className="loginButton" type="submit"> Login </button>
            </form>


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
export default Login;