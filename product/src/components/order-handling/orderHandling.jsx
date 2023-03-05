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
// import {io} from "socket.io-client";
import Toast from 'react-bootstrap/Toast';









function OrderHandling () {
    let { state, dispatch } = useContext(GlobalContext);
    const [show, setShow] = useState(null);
    const [error, setError] = useState("");
    const [isSpinner, setIsSpinner] = useState(null)
    let navigate = useNavigate();
    const [selectedValues, setSelectedValues] = useState([]);
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showToast, setShowToast] = useState(true);







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
            const response = await axios.get(`${state?.baseUrl}/api/v1/allOrders`,{ withCredentials: true });
            console.log(response.data);
            setOrders(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        allOrders()
    },[])

    useEffect(() => {
        setSelectedValues(Array(orders.length).fill(''));
    }, [orders]);
    


  
    const handleSelectChange = (event, orderId) => {
        const { value } = event.target;
        const orderToUpdate = orders.find(order => order._id === orderId);

        if (orderToUpdate.orderStatus !== value) {
            orderToUpdate.orderStatus = value;
            // make API call to update the order in the database
            axios.put(`${state?.baseUrl}/api/v1/updateStatus/${orderId}`, { orderStatus: value },{ withCredentials: true })
            .then(res => {
                console.log(res.data);
                allOrders()
            })
            .catch(err => {
                console.log(err);
            });
        }
    };

    // useEffect(() => {
    //     const socket = io("http://localhost:5001");

    //     socket.on(`connect`, function (){
    //         console.log("connected")
    //     })

    //     socket.on('Received Order', ({ newOrder }) => {
    //         setOrders(prevOrders => [ newOrder,...prevOrders]);
    //         setNotifications(prevOrders => [newOrder,...prevOrders])
    //         setShowToast(true)

          
    //     });

    //     socket.on('disconnect', function (message) {
    //         console.log("Socket disconnected from server: ", message);
    //     });
      
    
    //     return () => {
    //       socket.disconnect(); 
    //     };
    //   }, []);


    const dismissNotification = (notification) => {
        setNotifications(
            allNotifications => allNotifications.filter(eachItem => eachItem._id !== notification._id)
        )
        setShow(false)
    }



    return(
        <div className='main-div-orderHandling'>
            <div className='orderNotification'>
            {
                    notifications.map((eachNotification, index) => {
                        return <div key={index} className="item">
                                    <Toast >
                                        <img
                                        src="holder.js/20x20?text=%20"
                                        className="rounded me-2"
                                        alt=""
                                        />

                                        <strong style={{float:"right", fontSize:"16px", marginRight:"10px",cursor:"pointer"}} onClick={() => { dismissNotification(eachNotification) }} className="close"> X </strong>
                                        <small style={{ float:"right", marginRight:"10px",paddingTop:"1px"}}>{moment(eachNotification.createdOn).fromNow()}</small>
                                            <Toast.Body>
                                                <div style={{borderTop:"1px solid gray",marginTop:"15px", paddingTop:"10px"}}>New Order arrived from <strong style={{textTransform:"capitalize"}}>{eachNotification.userName}</strong></div>
                                            </Toast.Body>

                                      
                                    </Toast> 
                                </div>
                            })
            }
         

            </div>
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
                    (orders?.length !== 0)?
                        orders.map((order, i) => (
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
                    
                    
                    :null}
                    {(orders?.length === 0 ? "No Orders Yet!" : null)}
                    <div style={{position:"absolute", top:"50%",left: "50%"}}>
                        {(orders === null ? <Spinner animation="grow" variant="primary" /> : null)}
                    </div>



            </div>

        </div>

  


    )


}

export default OrderHandling;