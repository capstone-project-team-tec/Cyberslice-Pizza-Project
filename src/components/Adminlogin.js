import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./adminlogin.css"
import "./global.css"

const Adminlogin = (props) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { setCurrentAdminUser } = props
    const { setCurrentAdminUserTrue } = props

    const navigate = useNavigate()

    //This is the login function for admin
    async function loginFunction(e) {
        e.preventDefault();
        try {
            const response = await fetch (`https://cyberslice-backend.onrender.com/api/users/adminlogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify ({
                    username: username,
                    password: password
                })
            })
            const result = await response.json();
            if (!result.token) {
                alert("Username or password is incorrect, please try again")
            } else {
                const myJWT = result.token;
                localStorage.setItem("token", myJWT)
                setCurrentAdminUser({
                    username: result.user.username,
                    isAdmin: result.user.isAdmin,
                })
                setCurrentAdminUserTrue(true)
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <section id="loginContainer">
            <section className="loginTitle">
                Admin Login
                <br />
            </section>
    
            <section className="formAndPicture">
                <form onSubmit={loginFunction}>
                    <div className="input-wrapper">
                        <h2>Username</h2>
                        <input
                            className="loginBox"
                            id="username"
                            type="text"
                            placeholder=""
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            aria-label="Username"
                        />
                    </div>
                    <div className="input-wrapper">
                        <h2>Password</h2>
                        <input
                            className="loginBox"
                            id="password"
                            type="password"
                            placeholder=""
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            aria-label="Password"
                        />
                    </div>
                    <button className="loginButton" type="submit">
                        Login
                    </button>
                </form>
                <section className="picture">
                    <img id="slicesInRows" src="/slicesInRows.jpg" alt="Image of pizza slices in rows"/>
                </section>
            </section>
        </section>
    );
}

export default Adminlogin;