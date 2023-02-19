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
    const [cart, setCart] = useState(new Map());
    const totalPriceRef = useRef(0);


    

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

    // const calculateTotalPrice = () => {
    //     const totalPrice = cartItems.reduce((acc, curr) => acc + curr.product.unitPrice * count, 0);
    //     setTotal(totalPrice);
    //     console.log(total)
    // }

    const getCartItems = async () => {
        let userId = state.user._id
        try {
          const response = await axios.get(`${state?.baseUrl}/api/v1/cart/${userId}`);
          console.log("cart items",response?.data);
          setCartItems(response.data)
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

    useEffect(() => {
        getCartItems()
      
    },[])

    const handleIncrement = (productId) => {
        const newCart = new Map(cart);
        const quantity = newCart.get(productId) || 1;
        newCart.set(productId, quantity + 1);
        setCart(newCart);
 
      };
    
    const handleDecrement = (productId) => {
        const newCart = new Map(cart);
        const quantity = newCart.get(productId) || 1;
        if (quantity > 0) {
            newCart.set(productId, quantity - 1);
            setCart(newCart);
        }

    };


    // let total = 0;
    // cartItems.forEach((item) => {
    //     total += item.product.unitPrice * cart.get(item.product._id) || item.product.unitPrice ;

    // });
    totalPriceRef.current = cartItems.reduce((accumulator, item) => {
        return accumulator + (item.product.unitPrice * cart.get(item.product._id) || item.product.unitPrice);
      }, 0);
      console.log(totalPriceRef.current)
    // setTotalPrice({total})


    



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
                                <AiOutlineCloseCircle onClick={() => removeProductFromCart(eachProduct.product._id)} style={{marginLeft:"auto",cursor:"pointer",position:"relative",top:"-6px",right:"-5px"}}/>
                                <div className="cartItemsDesc">
                                    <img src={eachProduct.product.image} height = "50" width="50"/>
                                    
                                    <p style={{marginLeft:"8px",marginTop:"15px",fontSize:"0.8em",textTransform:"capitalize",fontWeight:"400"}}>{eachProduct.product.name}</p>

                                    <AiOutlineMinus  onClick={() => handleDecrement(eachProduct.product._id)} style={{marginLeft:"10px",marginTop:"20px",fontSize:"0.6em",cursor:"pointer"}}/>

                                    <p style={{marginLeft:"2px",marginTop:"17px",fontSize:"0.6em",backgroundColor:"#D4D3D3",padding:'1px 10px'}}>{cart.get(eachProduct.product._id) || 1}</p>
                                    <AiOutlinePlus onClick={() => handleIncrement(eachProduct.product._id)} style={{marginLeft:"2px",marginTop:"20px",fontSize:"0.6em",cursor:"pointer"}}/>
                                    
                                    <p style={{marginLeft:"auto",marginTop:"16px",fontSize:"0.7em",fontWeight:"bold"}}>Rs.{eachProduct.product.unitPrice * cart.get(eachProduct.product._id) || eachProduct.product.unitPrice}</p>

                                </div>
                            
                            </div>
                                
                            

                        ))}

                    </>
                    
                    : <div className="emptyCart">
                        <h3>Cart is empty now</h3>


                    </div>
                }           
          
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