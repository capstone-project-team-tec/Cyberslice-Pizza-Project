import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./login.css"
import "./global.css"

const Login = (props) => {

    //Login
    const [ myUsername, setMyUsername ] = useState("");
    const [ myPassword, setMyPassword ] = useState("");
    const { setCurrentUserTrue } = props
    
    const {setCurrentUser} = props;

    const navigate = useNavigate();

    async function loginFunction(e) {
        e.preventDefault();
        try {
            const response = await fetch (`http://localhost:1337/api/users/login`, {
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
            console.log("This is theresult of logging in line 31 of login component:   ",result)
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

            {/* Login */}
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
                    This is where a picture of pizza would go. Yeah.
                </section>
            </section>

            <h5 id="noAccountMessage">Don't Have An Account? <Link id="signUp" to="/register">Sign Up</Link></h5>
            <h5 id="noAccountMessage"><Link id="signUp" to="/adminlogin">Log In As Admin Here</Link></h5>
        </section>
    ) 
}
export default Login;