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
    const [editSides, setEditSides] = useState(null)
    const [editDesserts, setEditDesserts] = useState(null)
    const [editDrinks, setEditDrinks] = useState(null)
    const { users, currentUser, drinks, sides, desserts, setDrinks, setSides, setDesserts } = props
    const [allUsers, setAllUsers] = useState({})
    const [allProducts, setAllProducts] = useState({})
    const [userToEdit, setUserToEdit] = useState({})
    const [newProductName, setNewProductName] = useState("")
    const [newProductCategory, setNewProductCategory] = useState("")
    const [newProductPrice, setNewProductPrice] = useState("")

    const navigate = useNavigate()
    
    //Toggles function to see all users
    function toggleUsersToDeleteandUpdate() {
        setToggleUsers(!toggleUsers)
    }
    //Toggles function to see all profucts
    function toggleDrinksToDeleteandUpdate() {
        setToggleProducts(!toggleProducts)
    }
    //Toggles function to edit a user
    function editUserForm() {
        setEditUser(!editUser)
    }
    //Toggles function to edit sides
    function editSidesForm(productId) {
        setEditSides(productId === editSides ? null : productId)
    }
    //Toggles function to edit desserts
    function editDessertsForm(productId) {
        setEditDesserts(productId === editDesserts ? null : productId)
    }
    //Toggles function to edit Drinks
    function editDrinksForm(productId) {
        setEditDrinks(productId === editDrinks ? null : productId)
    }

    //Fetching the user by id
    async function fetchUserById(userId) {
        try {
        const response = await fetch(`https://cyberslice-backend.onrender.com/api/admin/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            })
            const result = await response.json()

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
    //Updating the user by id. If there is no input for a particular field it defaults to what it was
    async function updateUserById(userId, user) {
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

        if (address != '') {updatedAddress = address}
        else {updatedAddress = user.address}

        if (phone != '') {updatedPhone = phone}
        else {updatedPhone = user.phone}
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/admin/users/${userId}`, {
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

            const result = await response.json();
            

            setUserToEdit(result)
        

        } catch(error) {
            console.log(error)
        }
    }


    //Function to delete an account
    async function deleteAccount(event) {
        event.preventDefault()
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/users/${userToEdit.id}`, {
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

      //This function is fetching the product id so we can update or delete it
      async function fetchProductById(productId) {
        try {
        const response = await fetch(`https://cyberslice-backend.onrender.com/api/admin/product/${productId}`, {
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
            

            return result;

        } catch(error) {
            console.log(error)
        }
    }
    //Create New Product Function
    async function createNewProduct () {
        
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/admin/createproduct`, {
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

            if (newProductCategory == "drinks") {
                setDrinks(result)
            } else if (newProductCategory == "sides") {
                setSides(result)
            } else if (newProductCategory == "desserts") {
                setDesserts(result)
            }

            navigate('/admin')


        } catch(error) {
            console.log(error)
        }
    }

    //This function is updating the product and if a field has not been updated it will defualt to its original value
      async function updateProductById(product) {
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
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/admin/products/${product.id}`, {
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
            const result = await response.json();
            

            setDrinks(result)
            setSides(result)
            setDesserts(result)

            location.reload()
        

        } catch(error) {
            console.log(error)
        }
    }
    //This function is deleting a product by setting the isActive to false. We are only rendering in products that have isActive = true
    async function deleteProductById(product) {
        try {
            const response = await fetch(`https://cyberslice-backend.onrender.com/api/admin/products/${product.id}`, {
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
            
            const result = await response.json();

            setAllProducts(result)
            if (product.category == "drinks") {
                setDrinks(result)
            } else if (product.category == "sides") {
                setSides(result)
            } else if (product.category == "desserts") {
                setDesserts(result)
            } 
            
            
            
            location.reload()
        

        } catch(error) {
            console.log(error)
        }
    }
        
    //This is the event handler that orders the functions to update a user
    async function onSubmitEventHandlerUpdateUser(event, userId) {
        try {
          event.preventDefault();
          const user = await fetchUserById(userId);
          await updateUserById(userId, user);
          navigate('/admin')
        } catch (error) {
          console.error(error);
        }
      }
       //This is the event handler that orders the functions to delete a user
    async function onSubmitEventHandlerDeleteUser(event, userId) {
        try {
            event.preventDefault()
            await fetchUserById(userId);
            await deleteAccount();
            alert("User has been deleted")
            navigate('/admin')
        } catch(error) {
            console.log(error)
        }  
    }
     //This is the event handler that orders the functions to update a product
    async function onSubmitEventHandlerUpdateProduct(event, productId) {
        try {
        event.preventDefault()
        const product = await fetchProductById(productId)
        await updateProductById(product)
        alert("Product has been updated");
        } catch (error) {
            console.log(error)
        }
    }

     //This is the event handler that orders the functions to delete a product
    async function onSubmitEventHandlerDeleteProduct(productId) {
        try {
        const product = await fetchProductById(productId)
        await deleteProductById(product)
        alert("Product has been deleted")
        
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h2>Welcome to the Admin Page</h2>
            <div id="buttoncontainerforusersorproducts">
            <button className="userorproduct"onClick={toggleUsersToDeleteandUpdate}>View Users</button>
            <button className="userorproduct"onClick={toggleDrinksToDeleteandUpdate}>View Products</button>
            </div>
            {
        toggleUsers && users.length > 0 ? (
            users.map((singleUser) => {
                return (
                    <div key={singleUser.id}>
                        <div id="parent">
                            <h4 id="userheader">{singleUser.name}'s Info</h4>
                            <div id="usercontainer">
                        <section className="infocolumn">
                        <h2>Id:</h2>
                        <h2>{singleUser.id}</h2>
                        </section>
                        <section className="infocolumn">
                        <h2>Username:</h2>
                        <h2>{singleUser.username}</h2>
                        </section>
                        <section className="infocolumn">
                        <h2>Name:</h2>
                        <h2>{singleUser.name}</h2>
                        </section>
                        <section className="infocolumn">
                        <h2>Email:</h2>
                        <h2>{singleUser.email}</h2>
                        </section>
                        <section className="infocolumn">
                        <h2>Phone:</h2>
                        <h2>{singleUser.phone}</h2>
                        </section>
                        <section className="infocolumn">
                        <h2>Address:</h2>
                        <h2>{singleUser.address}</h2>
                        </section>
                        </div>
                        </div>
                        <div id="buttoncontainer">
                        <button onClick={editUserForm} className="userorproduct">Edit {singleUser.name}</button>
                        <button className = "userorproduct" onSubmit={(event) => onSubmitEventHandlerDeleteUser(event, singleUser.id)}>Delete This Account</button>
                        </div>
                        {
                            editUser ? (
                                <div>
                                    <form onSubmit={(event) => onSubmitEventHandlerUpdateUser(event, singleUser.id)}>
                                        <div id="userform">
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
                                </div>
                                <p> </p>
                                <div id="submitbutton">
                                <button type="submit">Update</button>
                                </div>
                
                                    

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
            <h3 id="createproduct">Create Product</h3>
            <p> </p>
            <div id="createform">
            <input 
            className="createbox"
            type="text"
            placeholder="New Product Name"
            value={newProductName}
            onChange={(event) => setNewProductName(event.target.value)}
            />
            <input 
            className="createbox"
            type="text"
            placeholder="Category"
            value={newProductCategory}
            onChange={(event) => setNewProductCategory(event.target.value)}
            />
            <input 
            className="createbox"
            type="text"
            placeholder="Price"
            value={newProductPrice}
            onChange={(event) => setNewProductPrice(event.target.value)}
            />
            <button className="submitform"type="submit">Create</button>
            </div>
        </form>
      <h1 className="header">Drinks</h1>
      <section className="productcontainer" id="drinkscontainer">
      <section className="itemsList">
      {drinks.filter(product => product.isActive === true).map((singleDrink) => (
        <section key={singleDrink.id}>
            <div className="imageContainerDrinks">
          <img src={singleDrink.image} id="itemPic" />
          </div>
          <section>{singleDrink.name}</section>
          <section>${singleDrink.price}</section>
          <button onClick={() => editDrinksForm(singleDrink.id)}>Update Drink</button>
          {editDrinks === singleDrink.id && (
                <form onSubmit={(event) => onSubmitEventHandlerUpdateProduct(event, singleDrink.id)}>
                  <p>To Update Product Name, Please Create A New Product and Delete This Product</p>
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
              )}
          <button onClick={() => onSubmitEventHandlerDeleteProduct(singleDrink.id)}>Delete Drink</button>
        </section>
      ))}
      </section>
      </section>
      <h1 className="header">Desserts</h1>
      <section className="productcontainer" id="drinkscontainer">
      <section className="itemsList">
      {desserts.filter(product => product.isActive === true).map((singleDessert) => (
        <div key={singleDessert.id}>
            <div className="imageContainerDesserts">
        <img src={singleDessert.image} id="itemPic" />
        </div>
          <h2>{singleDessert.name}</h2>
          <h2>Price: ${singleDessert.price}</h2>
          <button onClick={() => editDessertsForm(singleDessert.id)}>Update Dessert</button>
          {editDesserts === singleDessert.id && (
                <form onSubmit={(event) => onSubmitEventHandlerUpdateProduct(event, singleDessert.id)}>
                  <p>To Update Product Name, Please Create A New Product and Delete This Product</p>
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
              )}
          <button onClick={() => onSubmitEventHandlerDeleteProduct(singleDessert.id)}>Delete Dessert</button>
        </div>
      ))}
        </section>
      </section>
      <h1 className="header">Sides</h1>
      <section className="productcontainer" id="alldrinks">
      <section className="itemsList">
      {sides.filter(product => product.isActive === true).map((singleSide) => (
        <div key={singleSide.id}>
            <div className="imageContainerSides">
            <img src={singleSide.image} id="itemPic" />
            </div>
          <h2>{singleSide.name}</h2>
          <h2>Price: ${singleSide.price}</h2>
          <button onClick={() => editSidesForm(singleSide.id)}>Update Side</button>
          
            {editSides === singleSide.id && (
                <form onSubmit={(event) => onSubmitEventHandlerUpdateProduct(event, singleSide.id)}>
                  <p>To Update Product Name, Please Create A New Product and Delete This Product</p>
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
              )}
          <button onClick={() => onSubmitEventHandlerDeleteProduct(singleSide.id)}>Delete Side</button>
        </div>
      ))}
      </section>
      </section>
    </div>
  ) : null
}

            
        </div>
    )
}

export default Admin;