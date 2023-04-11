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
    const { products, users, currentUser, drinks, sides, desserts, setDrinks, setSides, setDesserts } = props
    const [allUsers, setAllUsers] = useState({})
    const [allProducts, setAllProducts] = useState({})
    const [userToEdit, setUserToEdit] = useState({})
    const [newProductName, setNewProductName] = useState("")
    const [newProductCategory, setNewProductCategory] = useState("")
    const [newProductPrice, setNewProductPrice] = useState("")

    const navigate = useNavigate()
    

    function toggleUsersToDeleteandUpdate() {
        setToggleUsers(!toggleUsers)
    }

    function toggleDrinksToDeleteandUpdate() {
        setToggleProducts(!toggleProducts)
    }
    function editUserForm() {
        setEditUser(!editUser)
    }
    function editSidesForm(productId) {
        setEditSides(productId === editSides ? null : productId)
    }
    function editDessertsForm(productId) {
        setEditDesserts(productId === editDesserts ? null : productId)
    }
    function editDrinksForm(productId) {
        setEditDrinks(productId === editDrinks ? null : productId)
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

        if (address != '') {updatedAddress = address}
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

    async function createNewProduct () {
        
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

            location.reload()
        

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

            console.log("This is the product.category", product.category)

            setAllProducts(result)
            if (product.category == "drinks") {
                setDrinks(result)
            } else if (product.category == "sides") {
                setSides(result)
            } else if (product.category == "desserts") {
                setDesserts(result)
            } else {
                console.log("unknown category:", product.category);
              }
            
            
            
            location.reload()
        

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


    // async function setUserDefaultState (user) {
    //     console.log("This is the user",  user)
    //     setUsername(user.username)
    //     setName(user.name)
    //     setEmail(user.email)
    //     setPhone(user.phone)
    //     setAddress(user.address)

    // }

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
          navigate('/admin')
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
        navigate('/admin')
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
        alert("Product has been updated");
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
    useEffect(() => {
       console.log("this is drinks", drinks)
       console.log("this is desserts", desserts)
       console.log("this is sides", sides)
    }, []);

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