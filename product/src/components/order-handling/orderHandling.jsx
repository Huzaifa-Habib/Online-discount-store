import './orderHandling.css';
import { useState,useEffect } from 'react';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import {BsCardList} from "react-icons/bs"
import {IoChevronBackSharp} from "react-icons/io5"
import {AiOutlineCloseCircle,AiOutlineHome,AiOutlineCheck,AiFillCamera} from "react-icons/ai"
import moment from 'moment';
import Form from 'react-bootstrap/Form';






function OrderHandling () {
    let { state, dispatch } = useContext(GlobalContext);
    const [show, setShow] = useState(null);
    const [error, setError] = useState("");
    const [isSpinner, setIsSpinner] = useState(null)
    const [getAllOrders, setGetAllOrders] = useState([])
    let navigate = useNavigate();
    const [selectedValues, setSelectedValues] = useState([]);



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

    const allOrders = async () => {
        try {
            const response = await axios.get(`${state?.baseUrl}/api/v1/allOrders`);
            console.log(response.data);
            setGetAllOrders(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        allOrders()
    },[])

    useEffect(() => {
        setSelectedValues(Array(getAllOrders.length).fill(''));
    }, [getAllOrders]);

    const handleSelectChange = (event, orderId) => {
        const { value } = event.target;
        const orderToUpdate = getAllOrders.find(order => order._id === orderId);

        if (orderToUpdate.orderStatus !== value) {
            orderToUpdate.orderStatus = value;
            // make API call to update the order in the database
            axios.put(`${state?.baseUrl}/api/v1/updateStatus/${orderId}`, { orderStatus: value })
            .then(res => {
                console.log(res.data);
                allOrders()
            })
            .catch(err => {
                console.log(err);
            });
        }
    };





    return(
        <div className='main-div-orderHandling'>
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
            <div className='navBar'>
                <div className='adminInfo'>
                <IoChevronBackSharp onClick={()=>navigate(-1)} style={{height:"35",width:"35",marginTop:"8px",color:"#3f3f3f3f"}}/>
                    <div className='adminImage' style={{
                    backgroundImage:(state?.user?.profileImage !== "")?`url(${state?.user?.profileImage})`:`url(https://img.icons8.com/color/1x/administrator-male.png)`,
                    boxSizing: "border-box",
                    height:50,
                    width:50,
                    border: "2px solid gray",
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    borderRadius:"50%",
                    
                    
                    }}>
    
                    </div>
                {/* <img src={(state?.user?.profileImage !== "")? state?.user?.profileImage : "https://img.icons8.com/color/1x/administrator-male.png"} height = "50" width="50"/> */}
                <span>{state?.user?.fullName}</span>
                <div></div>
                <p>Admin</p>
    
        
                </div>
                <a href="orderHandling" style={{marginLeft:"auto",marginTop:"10px"}}><BsCardList style={{height:"25px",width:"25px"}}/></a>
                
            </div>
            <h5 style={{color:"#024F9D", paddingLeft:"20px",marginTop:"20px"}}>Orders</h5>

            <div className='displayUsersOrder'>
                {
                                    
                    (getAllOrders.length !== 0)?
                        getAllOrders.map((order, i) => (
                            <div className="ordersDisplayDiv" key={i}>
                                <div className="userName">
                                    {order.userName}
                                </div>
                                <div className="time-status-contact">
                                    <span>{moment(order.createdOn).fromNow()} - {order.orderStatus} </span> 
                                    
                                    <p className="userPhone">{order.userNumber}</p>

                                </div>
                                    {order.products.map((product, i) => (
                                        <div className="productInfo" key={i}>
                                            <div className="quantity">
                                                <p>{product.quantity} x {product.productName}</p>
                                                <p>Rs.{product.productPrice} - per {product.productUnitName}</p>
                                            </div>

                                        </div>
                                            
                                    
                                    ))}
                                    <div className="totalOrderPrice">
                                        <p>Total</p>
                                        <p>Rs.{order.totalPrice}</p>
                                        
                                        
                                    </div>

                                    <div className='changeStatus'>
                                          
                                            <Form.Select aria-label="Default select example" name="status" value={selectedValues[i]} onChange={(event) => handleSelectChange(event,order._id)}>
                                                <option value= "Change Status" >Change Status</option>
                                                <option value= "In Progress" >In Progress</option>
                                                <option value = "Delivered" >Delivered</option>
                                            </Form.Select>
                                    </div>

                                
                                
                            </div>
                            
                        ))
                    
                    
                    : <h4>No orders yet!</h4>

                                                
                }



            </div>

        </div>

  


    )


}

export default OrderHandling;