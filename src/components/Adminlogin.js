import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import "./adminlogin.css"
import "./global.css"

const Adminlogin = () => {
    const { setCurrentUser } = props

    async function loginFunction(e) {
        e.preventDefault();
        try {
            const response = await fetch (`http://localhost:1337/api/users/adminlogin`, {
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
                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div>
            Placeholder
        </div>
    )
}

export default Adminlogin;