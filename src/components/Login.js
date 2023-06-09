import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./login.css"
import "./global.css"

const Login = (props) => {
    const [ myUsername, setMyUsername ] = useState("");
    const [ myPassword, setMyPassword ] = useState("");
    const { setCurrentUserTrue } = props
    
    const {setCurrentUser} = props;

    const navigate = useNavigate();

    //This is the login function
    async function loginFunction(e) {
        e.preventDefault();
        try {
            const response = await fetch (`https://cyberslice-backend.onrender.com/api/users/login`, {
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
            if (!result.token) {
                alert("Username or password is incorrect, please try again")
            } else {
                const myJWT = result.token;
                localStorage.setItem("token", myJWT)
                setCurrentUser({
                    username: result.user.username,
                    id: result.user.userId,
                    name: result.user.userRealName,
                    email: result.user.userEmail,
                    address: result.user.userAddress,
                    phone: result.user.userPhone
                })
                setCurrentUserTrue(true)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section id="loginContainer"> 

            <section className = "loginTitle"> 
                Welcome Back
                <br></br>
            </section>
            
            <section className = "formAndPicture">
                <form onSubmit={loginFunction}>
                    <div className="input-wrapper">
                        <h2> Username </h2>
                        <input className="loginBox"
                            id="username"
                            type="text"
                            placeholder=""
                            value={myUsername}
                            onChange={(event) => setMyUsername(event.target.value)}
                        />
                    </div>
                    <div className="input-wrapper">
                        <h2> Password</h2>
                        <input className="loginBox"
                            id="password"
                            type="text"
                            placeholder=""
                            value={myPassword}
                            onChange={(event) => setMyPassword(event.target.value)}
                        />
                    </div>
                    <button className="loginButton" type="submit"> Login </button>
                </form>
                <section className = "picture">
                    <img id="slicesInRows" src="/slicesInRows.jpg" alt="Image of pizza slices in rows"/>
                </section>
            </section>
            <h5 className="noAccountMessage">Don't Have An Account? <Link id="signUp" to="/register">Sign Up</Link></h5>
            <h5 className="noAccountMessage" id="logInAsAdmin" ><Link id="signUp" to="/adminlogin">Log In As Admin Here</Link></h5>
        </section>
    ) 
}
export default Login;