import "./cart.css"
import { useState,useEffect } from 'react';
import axios from "axios"
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import {MdDelete} from "react-icons/md"
import {AiOutlineMinus,AiOutlinePlus,AiOutlineCloseCircle} from "react-icons/ai"



function Cart () {
    let { state, dispatch } = useContext(GlobalContext);
    const [isSpinner, setIsSpinner] = useState(null)
    const [cartItems, setCartItems] = useState([])
    const [error, setError] = useState("");
    const [show, setShow] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    
    




    

    if (isSpinner === true) {
        document.querySelector(".spinner-div").style.display = "block"
      
    }
  
    if (isSpinner === false) {
        document.querySelector(".spinner-div").style.display = "none"
    }
    if (show === true) {
        document.querySelector(".notificationView").style.display = "block"
      
    }

    if (show === false) {
        document.querySelector(".notificationView").style.display = "none"
      
    }


    const getCartItems = async () => {
        let userId = state.user._id
        try {
          const response = await axios.get(`${state?.baseUrl}/api/v1/cart/${userId}`);
          console.log("cart items",response?.data);
          setCartItems(response.data)
          setTotalPrice(
            response.data.reduce(
              (total, item) => total + item.productPrice * item.quantity,
              0
            )
          );
         
        } catch (error) {
          console.log(error);
        }
    };

    const removeProductFromCart = async (productId) =>{
        setIsSpinner(true)
        try {
            const response = await axios.delete(`${state.baseUrl}/api/v1/cart/${productId}`);
            console.log(response.data.message);
            // Reload the page or update the cart state to reflect the change
            getCartItems()
            setIsSpinner(false)
          } catch (error) {
            console.error(error);
            setIsSpinner(false)
            // Handle the error appropriately
          }

    }

    const handleDeleteAllCarts = async () => {
        if(cartItems.length !== 0){
            setIsSpinner(true)
            try {
                const resp =  await axios.delete(`${state.baseUrl}/api/v1/deleteCarts/`);
                console.log(resp)
                getCartItems()
                setIsSpinner(false)
            
            } catch (error) {
                console.error(error);
                setError(error.response.data.message)
                setShow(true)
                setIsSpinner(false)


            }
        }
        else{
            setError("Cart is already empty")
            setShow(true)

        }
      };

    const submitOrderHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('/api/orders', {
                userName:state.user.fullName,
                userNumber:phone,
                product:cartItems,

        

            });
            return response.data;
          } catch (error) {
            console.error(error);
          }



    }


    const handleIncrement = (productId) => {
        setIsSpinner(true)
        const updatedCartItems = cartItems.map(cartItem => {
          if (cartItem.productId === productId) {
            return {
              ...cartItem,
              quantity: cartItem.quantity + 1 
            };
          }
          return cartItem;
        });
        
        axios.put(`${state.baseUrl}/api/v1/cart/${productId}`, { quantity: updatedCartItems.find(item => item.productId === productId).quantity })
          .then((response) => {
            console.log(response.data);
            getCartItems();
            setIsSpinner(false)

          })
          .catch((error) => {
            console.log(error);
            setIsSpinner(false)

          });
      
        setCartItems(updatedCartItems);
        setTotalPrice(
            cartItems.reduce(
              (total, item) => total + item.productPrice * item.quantity,
              0
            )
          );
      };
      
      const handleDecrement = (productId) => {
        const updatedCartItems = cartItems.map(cartItem => {
          if (cartItem.productId === productId && cartItem.quantity > 1) {
            return {
              ...cartItem,
              quantity: cartItem.quantity - 1
            };
          }
          return cartItem;
        });
      
        // check if the quantity was actually decremented
        const quantityDecremented = updatedCartItems.find(item => item.productId === productId).quantity < cartItems.find(item => item.productId === productId).quantity;
      
        if (quantityDecremented) {
          setIsSpinner(true)
      
          axios.put(`${state.baseUrl}/api/v1/cart/${productId}`, {quantity: updatedCartItems.find(item => item.productId === productId).quantity})
            .then((response) => {
              console.log(response.data);
              setIsSpinner(false);
              setCartItems(updatedCartItems);
              setTotalPrice(updatedCartItems.reduce(
                (total, item) => total + item.productPrice * item.quantity,
                0
              ));
            })
            .catch((error) => {
              console.log(error);
              setIsSpinner(false);
            });
        }
      };
      

      useEffect(() => {
        getCartItems()
      
    },[])



  


    



    return(
        <div className="main-container">
            <div className='spinner-div'>
                <div className='spinner'>
                    <Spinner animation="grow" variant="danger" />
                </div>
             </div>

             <div className='notificationView' >
                <div className="notification">
                    <AiOutlineCloseCircle style={{marginLeft:"auto",cursor:"pointer",fontSize:"18px",position:"relative",top:"-10px",right:"-10px"} }onClick= {() => setShow(false)}/>
                    <p className="notification-message">{error} !</p>
                </div> 
            </div>

       
        {/* Top navbar */}
        <div className="top-navbar">
            <div style={{
                    backgroundImage:(state?.user?.profileImage !== "")?`url(${state?.user?.profileImage})`:`url(https://img.icons8.com/color/1x/administrator-male.png)`,
                    boxSizing: "border-box",
                    height:30,
                    width:30,
                    border: "2px solid gray",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius:"50%",
                    marginLeft:"auto",  
                }}>

            </div>
        </div>
        <div className="headingDiv">
            <p style={{color:"#1e3a8a",fontSize:"20px",fontWeight:"400"}}>Shopping</p>
            <div style={{display:"flex",position:"relative", top:"-23px"}}>
                <p style={{color:"#61B846",fontWeight:"600",fontSize:"20px"}}>Cart</p>
                <p style={{color:"#61B846",fontWeight:"600",fontSize:"20px",marginLeft:"auto",marginTop:"5px",marginRight:"5px",cursor:"pointer"}} onClick = {handleDeleteAllCarts}><MdDelete/></p>
            </div>
        </div>
        {/* Scrollable container */}
        <div className="scrollable-container">
          <div className="item">
                {
                    (cartItems.length !== 0)?
                    <>
                        { cartItems.map((eachProduct,i) => (  
                       

                            <div className="cartItems" key={i}>
                                <AiOutlineCloseCircle onClick={() => removeProductFromCart(eachProduct.productId)} style={{marginLeft:"auto",cursor:"pointer",position:"relative",top:"-6px",right:"-5px"}}/>
                                <div className="cartItemsDesc">
                                    <img src={eachProduct.productImage} height = "50" width="50"/>
                                    
                                    <p style={{marginLeft:"8px",marginTop:"15px",fontSize:"0.8em",textTransform:"capitalize",fontWeight:"400"}}>{eachProduct.productName}</p>

                                    <AiOutlineMinus  onClick={() => handleDecrement(eachProduct.productId)} style={{marginLeft:"10px",marginTop:"20px",fontSize:"0.6em",cursor:"pointer"}}/>

                                    <p style={{marginLeft:"2px",marginTop:"17px",fontSize:"0.6em",backgroundColor:"#D4D3D3",padding:'1px 10px'}}>{eachProduct.quantity}</p>
                                    <AiOutlinePlus onClick={() => handleIncrement(eachProduct.productId)} style={{marginLeft:"2px",marginTop:"20px",fontSize:"0.6em",cursor:"pointer"}}/>
                                    
                                    <p style={{marginLeft:"auto",marginTop:"16px",fontSize:"0.7em",fontWeight:"bold"}}>Rs.{eachProduct.productPrice * eachProduct.quantity}</p>

                                </div>
                            
                            </div>
                                
                            

                        ))}

                    </>
                    
                    : <div className="emptyCart">
                        <h3>Cart is empty now</h3>


                    </div>
                }           
          
          </div>
         
         
            <div className="orderDiv">
                <div className="totalPrice">
                    <p>Total</p>
                    <p>Rs.{totalPrice}</p>

                </div>
                <form onSubmit={submitOrderHandler}>
                    <div>
                        <input
                        type="text"
                        id="name"
                        onChange={(e) =>{setName(e.target.value)}}
                        placeholder = "Full Name"
                        required

                        />
                    </div>
                    <div>
                        <input
                        type="email"
                        id="email"
                        onChange={(e) =>{setEmail(e.target.value)}}
                        placeholder = "Email"
                        required

                        />
                    </div>
                    <div>
                        <input
                        type="tel"
                        id="phone"
                        onChange={(e) =>{setPhone(e.target.value)}}
                        placeholder = "Phone Number"
                        required

                        />
                    </div>
                    <div>
                        <textarea
                        id="address"
                        onChange={(e) =>{setAddress(e.target.value)}}
                        placeholder = "Shipping Address"
                        required
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className="cool-button">Place Order</button>
                    </div>
                </form>

            </div>
        </div>
 
        {/* Bottom navbar */}
        <div className="bottom-navbar">
          <button>Home</button>
          <button>Cart</button>
          <button>Profile</button>
        </div>
      </div>
    )


}

export default Cart