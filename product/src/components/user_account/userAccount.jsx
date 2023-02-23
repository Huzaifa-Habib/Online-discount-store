import "./userAccount.css"
import { useState,useEffect } from 'react';
import axios from "axios"
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import {MdDelete} from "react-icons/md"
import {AiOutlineCloseCircle,AiOutlineHome,AiOutlineCheck,AiFillCamera} from "react-icons/ai"
import {FaUserAlt} from "react-icons/fa"
import {BsCart4} from "react-icons/bs"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import moment from 'moment';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



function UserAccount () {
    let { state, dispatch } = useContext(GlobalContext);
    const [show, setShow] = useState(null);
    const [error, setError] = useState("");
    const [isSpinner, setIsSpinner] = useState(null)
    const [value, setValue] = React.useState(0);
    const [isUpdateName, setIsUpdateName] = useState(false)
    const [updatedNameValue, setUpdateNameValue] = useState(null)
    const [myOrders, setMyOrders] = useState([]);
    const [imageUpload,setImageUpload] =useState (null) 
    const [show1, setShow1] = useState(false);
    const handleClose = () => setShow1(false);
    const handleShow = () => setShow1(true);
    let navigate = useNavigate();




    

    




    
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
    const updateProfile = (e) => {
        e.preventDefault()
        setIsSpinner(true)
        let imageRef = ref(storage,`profileImages/${imageUpload?.name + v4()}`);

        uploadBytes(imageRef, imageUpload).then((snapshot) =>{
          console.log("Firebase Storage",snapshot)
    
          getDownloadURL(snapshot.ref)
          .then((url) =>{
            console.log("ImageURL", url)
                axios.post(`${state.baseUrl}/api/v1/updateProfileImg`, {
                    profileImage:url,
                },{ withCredentials: true })
    
                .then((response) => {
                    console.log(response);
                    window.location.reload();
                }, (error) => {
                    console.log(error.message);
                    setIsSpinner(false)

                });
    
            })
            .catch((e) =>{
                console.log("Image Url Error", e)
                setIsSpinner(false)

        
            })
        
        })
        .catch((e) =>{
          console.log("Storage Error", e)
          setIsSpinner(false)
    
        })

    
    }


    const updateUserName = async (e) =>{
        e.preventDefault()
        console.log(updatedNameValue)

        if (updatedNameValue !== null) {
            setIsSpinner(true)
            try {
                const resp = await axios.post(`${state?.baseUrl}/api/v1/updateName`,{
                    updatedName:updatedNameValue
                },{ withCredentials: true})
                 console.log("Name updated sucessfully", resp)   
                 setIsSpinner(false)
                 window.location.reload()

            } catch (error) {
                setIsSpinner(false)
                console.log("Update Name Error",error);
            }
        }
    }

    const orders = async () => {
        try {
            const response = await axios.get(`${state?.baseUrl}/api/v1/orders/${state.user._id}`,{ withCredentials: true });
            console.log(response.data);
            setMyOrders(response.data.data);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    useEffect(() => {
        orders()
    },[])

    const logOutHandler = async () =>{
        setIsSpinner(true)
        try {
            const resp  = await axios.post(`${state?.baseUrl}/api/v1/logout`,{},{ withCredentials: true})
            console.log("Logout", resp)  
             setIsSpinner(false)
            dispatch({
                type: 'USER_LOGOUT',
                payload: null
            })
            navigate("/")
               
        } catch (error) {
            console.log("logout Error",error);
            setIsSpinner(false)
        }
    }


    return(
        <div className="main-container-userAccount">
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
            <div className="userAccountInfoDiv">
                <h3 style={{color:"#024F9D",textAlign:"center"}}>Settings</h3>
                <div className="userImageDiv">
                    <img className="profileImg" src={(state?.user?.profileImage !== "")? state?.user?.profileImage : "https://img.icons8.com/color/1x/administrator-male.png"} height = "100" width="100"/>
                </div>
                 <AiFillCamera className="camera" onClick={handleShow} />
                 <Modal show={show1} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={updateProfile}>
                            <input type="file" style={{width:"100%"}}onChange={(e) => {
                                setImageUpload(e.target.files[0])
                            }} required accept="image/png"/>
                               <Button variant="primary" type="submit" style={{marginTop:"20px"}}>
                                    Update 
                                </Button>
                        </form>

                    </Modal.Body>
                    
                </Modal>
              

                <div className='nameDiv'>
                    {
                        (isUpdateName)?
                        <div className='updateInputDiv' tabIndex="0" >
                            <form onSubmit={updateUserName} >
                                <input required type="text" defaultValue={state?.user?.fullName} autoFocus  onChange = {(e) =>{
                                    setUpdateNameValue(e.target.value)

                                }} />
                                <button type='submit'><AiOutlineCheck style={{
                                                        fontSize:"20px",
                                                        color:"#61B846",
                                                        marginLeft:"10px",
                                                        marginTop:"2px",
                                                        cursor:"pointer"}}/>
                                </button>
                            </form>

                        </div>
                            
                        :
                        <div className='updateNameDiv' tabIndex="0" onFocus={() =>setIsUpdateName(true)} >
                            Update Full Name <span><AiOutlineCheck style={{
                                                fontSize:"20px",
                                                color:"#61B846",
                                                marginLeft:"10px",
                                                marginTop:"2px",
                                                cursor:"pointer"}}/>
                                            </span>
                        </div>
                       
                        
                    }
                    
                </div>
              <h5 style={{color:"#024F9D", paddingLeft:"20px"}}>Orders</h5>
            </div>
            
            <div className="userOrdersDiv">
                {
                                   
                    (myOrders.length !== 0)?
                        myOrders.map((order, i) => (
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

                                
                                
                            </div>
                         
                        ))
                 
                    
                    : <h4>No orders yet!</h4>

                                
                }
               <button className='logOut' onClick={logOutHandler}>Log Out</button>
            </div>

            
            <div className="fixed-navbar">
                <nav >
                    <Paper sx={{ position: 'fixed', bottom:0,  left: 0, right: 0, background:"green" }} elevation={3} className="homeBottomNavbar">
                        <BottomNavigation
                            showLabels
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        >
                            <BottomNavigationAction style={{color:"#6D6E71"}} href='/' label="Home" icon={<AiOutlineHome />} />
                            <BottomNavigationAction style={{color:"#6D6E71"}} href='/cart' label="Cart" icon={<BsCart4/>} />
                            <BottomNavigationAction style={{color:"#61B846"}} href='/adminAccount' label="Account" icon={<FaUserAlt />} />
                        </BottomNavigation>
                    </Paper>
                </nav>
               
            </div>
        </div>
    )
}

export default UserAccount