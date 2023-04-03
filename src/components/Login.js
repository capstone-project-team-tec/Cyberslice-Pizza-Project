import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./login.css"
import "./global.css"

const Login = (props) => {

    //Login
    const [ myUsername, setMyUsername ] = useState("");
    const [ myPassword, setMyPassword ] = useState("");
    

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

            <h5 id="signup">Don't Have An Account? <Link to="/register">Sign Up Here</Link></h5>
        </section>
    ) 
}
export default Login;