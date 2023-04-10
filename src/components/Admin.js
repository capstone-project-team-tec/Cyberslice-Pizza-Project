import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"


import "./admin.css"
import "./global.css"

const Admin = (props) => {
    const [toggleUsers, setToggleUsers] = useState(false)
    const [toggleProducts, setToggleProducts] = useState(false)
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [myId, setMyId] = useState(null);
    const [productCategory, setProductCategory] = useState("")
    const [productName, setProductName] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [isActive, setisActive] = useState(true)
    const [producImg, setProductImg] = useState("");
    const [productId, setProductId] = useState("")
    const [editUser, setEditUser] = useState(false)
    const [editSides, setEditSides] = useState(false)
    const [editDesserts, setEditDesserts] = useState(false)
    const [editDrinks, setEditDrinks] = useState(false)
    const { products, users, currentUser, drinks, sides, desserts, setDrinks, setSides, setDesserts } = props
    const [allUsers, setAllUsers] = useState({})
    const [allProducts, setAllProducts] = useState({})
    const [userToEdit, setUserToEdit] = useState({})
    const [newProductName, setNewProductName] = useState("")
    const [newProductCategory, setNewProductCategory] = useState("")
    const [newProductPrice, setNewProductPrice] = useState("")
    

    function toggleUsersToDeleteandUpdate() {
        setToggleUsers(!toggleUsers)
    }

    function toggleDrinksToDeleteandUpdate() {
        setToggleProducts(!toggleProducts)
    }
    function editUserForm() {
        setEditUser(!editUser)
    }
    function editSidesForm() {
        setEditSides(!editSides)
    }
    function editDessertsForm() {
        setEditDesserts(!editDesserts)
    }
    function editDrinksForm() {
        setEditDrinks(!editDrinks)
    }

    async function fetchUserById(userId) {
        try {
        const response = await fetch(`http://localhost:1337/api/admin/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            const result = await response.json()
            console.log("This is the result for fetchUserById", result)

            setUserToEdit(result)
            setMyId(result.id)
            setUsername(result.username)
            setName(result.name)
            setEmail(result.email)
            setAddress(result.address)
            setPhone(result.phone)

            return result;
        } catch(error) {
            console.log(error)
        }
    }

    async function updateUserById(userId, user) {
        console.log("This is the update user by id function")
        console.log("This is line 78", user.name, user.address, user.phone)
        console.log("this is the currentUser.id", currentUser.id)
        let updatedUsername
        let updatedName
        let updatedPhone
        let updatedAddress
        let updatedEmail
        if (username != '') {updatedUsername = username}
        else {updatedUsername = user.username}

        if (name != '') {updatedName = name}
        else {updatedName = user.name}

        if (email != ''){updatedEmail = email}
        else {updatedEmail = user.email}

        if (address != '') {updatedAddress = name}
        else {updatedAddress = user.address}

        if (phone != '') {updatedPhone = phone}
        else {updatedPhone = user.phone}
        try {
            const response = await fetch(`http://localhost:1337/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: userId,
                    username: updatedUsername,
                    name: updatedName,
                    email: updatedEmail,
                    address: updatedAddress,
                    phone: updatedPhone
                }),
            })
            console.log("This is the response", JSON.stringify(response))
            const result = await response.json();
            


            console.log("this is the result", result)

            setUserToEdit(result)
        

        } catch(error) {
            console.log(error)
        }
    }



    async function deleteAccount(event) {
        event.preventDefault()
        try {
            const response = await fetch(`http://localhost:1337/api/users/${userToEdit.id}`, {
            method : `DELETE`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({
                id: userId
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

      async function fetchProductById(productId) {
        try {
            console.log("Starting to run fetchProductById")
        const response = await fetch(`http://localhost:1337/api/admin/product/${productId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            const result = await response.json()

            setAllProducts(result.product)
            setProductId(result.id)
            setProductName(result.name)
            setProductPrice(result.price)
            console.log("This is the line 174 result", result)

            return result;

        } catch(error) {
            console.log(error)
        }
    }

    async function createNewProduct (event) {
        event.preventDefault()
        console.log("Create new product function is running")
        try {
            const response = await fetch(`http://localhost:1337/api/admin/createproduct`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    name: newProductName,
                    category: newProductCategory,
                    price: newProductPrice
                })
            })
            const result = await response.json()

            console.log("The create product function finished, this is the result", result)

            setDrinks(result)
            setDesserts(result)
            setSides(result)


        } catch(error) {
            console.log(error)
        }
    }

      async function updateProductById(product) {
        console.log("This is the update product by id function")
        console.log("this is the product.id", product.id)
        let updatedCategory
        let updatedPrice
        let updatedisActive
        if (productCategory != '') {updatedCategory = productCategory}
        else {updatedCategory = product.category}

        if (productPrice != '') {updatedPrice = productPrice}
        else {updatedPrice = product.price}
        console.log("this is the isactive", isActive)
        if (isActive == true ) {updatedisActive = isActive}
        else {updatedisActive = false}
        try {
            const response = await fetch(`http://localhost:1337/api/admin/products/${product.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: product.id,
                    category: updatedCategory,
                    price: updatedPrice,
                    isActive: updatedisActive
                }),
            })
            console.log("This is the response", JSON.stringify(response))
            const result = await response.json();
            


            console.log("this is the result", result)

            setDrinks(result)
            setSides(result)
            setDesserts(result)
        

        } catch(error) {
            console.log(error)
        }
    }

    async function deleteProductById(product) {
        console.log("This is the update product by id function")
        console.log("this is the product.id", product.id)
        try {
            const response = await fetch(`http://localhost:1337/api/admin/products/${product.id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    id: product.id,
                    category: product.category,
                    price: product.price,
                    isActive: false
                }),
            })
            console.log("This is the response", JSON.stringify(response))
            const result = await response.json();
            


            console.log("this is the result", result)

            setAllProducts(result)
            setDrinks(result)
            setSides(result)
            setDesserts(result)
            
        

        } catch(error) {
            console.log(error)
        }
    }

    async function deleteProduct(event) {
        event.preventDefault()
        try {
            const response = await fetch(`http://localhost:1337/api/users/${product.id}`, {
            method : `DELETE`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("token")}`
              },
              body: JSON.stringify({
                id: productId
              })
            });
            const result = await response.json()
            if(result.success) {
                alert("Product has been deleted")
            }

            setAllProducts(result)

            
            console.log(result);
            return result
          } catch (error) {
            console.error(error);
          }
      }


    async function setUserDefaultState (user) {
        console.log("This is the user",  user)
        setUsername(user.username)
        setName(user.name)
        setEmail(user.email)
        setPhone(user.phone)
        setAddress(user.address)

    }

    async function onSubmitEventHandlerUpdateUser(event, userId) {
        try {
          event.preventDefault();
          console.log("This is the user ID:", userId);
      
          console.log("Starting to run fetch user by ID");
          const user = await fetchUserById(userId);
          console.log("Finished running fetch user by ID");
        //   await setUserDefaultState(user)
        console.log(name, email, phone, address)
          console.log("Starting to run update user by ID");
          await updateUserById(userId, user);
          console.log("Finished running update user by ID");
          alert("User has been updated")
        } catch (error) {
          console.error(error);
        }
      }
    async function onSubmitEventHandlerDeleteUser(event, userId) {
        try {
            event.preventDefault()
        await fetchUserById(userId);
        await deleteAccount();
        alert("User has been deleted")
        } catch(error) {
            console.log(error)
        }  
    }

    async function onSubmitEventHandlerUpdateProduct(event, productId) {
        try {
        event.preventDefault()
        console.log("This is the product ID:", productId);
        console.log("Starting to run fetch product by ID");
        const product = await fetchProductById(productId)
        console.log("Finished running fetch product by ID");
        console.log("Starting to run update product by ID");
        await updateProductById(product)
        console.log("Finished running update product by ID")
        console.log("Product has been updated")
        alert();
        } catch (error) {
            console.log(error)
        }
    }
    async function onSubmitEventHandlerDeleteProduct(productId) {
        console.log("this is the onsubmiteventhandlerdeleteproduct")
        try {
        console.log("This is the product ID:", productId);
        console.log("Starting to run fetch product by ID");
        const product = await fetchProductById(productId)
        console.log("Finished running fetch product by ID");
        console.log("Starting to run delete product by ID");
        await deleteProductById(product)
        console.log("Finished running delete product by ID");
        alert("Product has been deleted")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <h2>Welcome to the Admin Page</h2>
            <button onClick={toggleUsersToDeleteandUpdate}>Users</button>
            <button onClick={toggleDrinksToDeleteandUpdate}>Prdoucts</button>

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
                        <button onSubmit={(event) => onSubmitEventHandlerDeleteUser(event, singleUser.id)}>Delete This Account</button>
                        {
                            editUser ? (
                                <div>
                                    <form onSubmit={(event) => onSubmitEventHandlerUpdateUser(event, singleUser.id)}>
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
                                    <h6>Enter New Address:</h6>
                                    <input 
                                    type="text"
                                    defaultValue={allUsers.address}
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
            {
  toggleProducts && drinks.length > 0 && sides.length > 0 && desserts.length > 0 ? (
    <div>
        <form onSubmit={(event) => createNewProduct(event)}>
            <h3>Create Product</h3>
            <p>To Update Product Name, Please Create A New Product and Delete This Product</p>
            <input 
            type="text"
            placeholder="New Product Name"
            value={newProductName}
            onChange={(event) => setNewProductName(event.target.value)}
            />
            <input 
            type="text"
            placeholder="Category"
            value={newProductCategory}
            onChange={(event) => setNewProductCategory(event.target.value)}
            />
            <input 
            type="text"
            placeholder="Price"
            value={newProductPrice}
            onChange={(event) => setNewProductPrice(event.target.value)}
            />
            <button type="submit">Create</button>
        </form>
      <h1>Drinks</h1>
      {drinks.filter(product => product.isActive === true).map((singleDrink) => (
        <section id="itemContainer" key={singleDrink.id}>
          <img src={singleDrink.image} id="itemPic" />
          <section id="itemTitle">{singleDrink.name}</section>
          <section id="itemCost">${singleDrink.price}</section>
          <button onClick={editDrinksForm}>Update Drink</button>
          {
            editDrinks ? (
                <form onSubmit={(event) => onSubmitEventHandlerUpdateProduct(event, singleDrink.id)}>
                    <h5>Edit Price</h5>
                    <input 
                    type="text"
                    defaultValue={productPrice}
                    onChange={(event) => setProductPrice(event.target.value)}
                    />
                    <h5>Edit Category</h5>
                    <input 
                    type="text"
                    defaultValue={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                    />
                    <p> </p>
                    <button type="submit">Update</button>
                </form>
            ): ""
          }
          <button onClick={() => onSubmitEventHandlerDeleteProduct(singleDrink.id)}>Delete Drink</button>
        </section>
      ))}
      <h1>Desserts</h1>
      {desserts.filter(product => product.isActive === true).map((singleDessert) => (
        <div key={singleDessert.id}>
          <h2>{singleDessert.name}</h2>
          <h2>Price: {singleDessert.price}</h2>
          <button onClick={editDessertsForm}>Update Dessert</button>
          {
            editDesserts ? (
                <form onSubmit={(event) => onSubmitEventHandlerUpdateProduct(event, singleDessert.id)}>
                    <h5>Edit Price</h5>
                    <input 
                    type="text"
                    defaultValue={productPrice}
                    onChange={(event) => setProductPrice(event.target.value)}
                    />
                    <h5>Edit Category</h5>
                    <input 
                    type="text"
                    defaultValue={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                    />
                    <p> </p>
                    <button type="submit">Update</button>
                </form>
            ): ""
          }
          <button onClick={() => onSubmitEventHandlerDeleteProduct(singleDessert.id)}>Delete Dessert</button>
        </div>
      ))}
      <h1>Sides</h1>
      {sides.filter(product => product.isActive === true).map((singleSide) => (
        <div key={singleSide.id}>
          <h2>{singleSide.name}</h2>
          <h2>Price: {singleSide.price}</h2>
          <button onClick={editSidesForm}>Update Side</button>
          {
            editSides ? (
                <form onSubmit={(event) => onSubmitEventHandlerUpdateProduct(event, singleSide.id)}>
                    <h5>Edit Price</h5>
                    <input 
                    type="text"
                    defaultValue={productPrice}
                    onChange={(event) => setProductPrice(event.target.value)}
                    />
                    <h5>Edit Category</h5>
                    <input 
                    type="text"
                    defaultValue={productCategory}
                    onChange={(event) => setProductCategory(event.target.value)}
                    />
                    <p> </p>
                    <button type="submit">Update</button>
                </form>
            ): ""
          }
          <button onClick={() => onSubmitEventHandlerDeleteProduct(singleSide.id)}>Delete Side</button>
        </div>
      ))}
    </div>
  ) : null
}

            
        </div>
    )
}

export default Admin;