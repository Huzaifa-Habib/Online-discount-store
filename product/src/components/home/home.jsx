import "./home.css"
import { useState,useEffect } from 'react';
import axios from "axios"
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import Carousel from 'react-bootstrap/Carousel';
import {BsCart4,BsSearch} from "react-icons/bs"
import {FaUserAlt} from "react-icons/fa"
import {BiPlus} from "react-icons/bi"
import {AiOutlineHome, AiFillCamera, AiOutlineCloseCircle} from "react-icons/ai"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Toast from 'react-bootstrap/Toast';



function Home (){
    let { state, dispatch } = useContext(GlobalContext);
    const [isSpinner, setIsSpinner] = useState(null)
    const [getAllCategories, setGetAllCategories] = useState([])
    let navigate = useNavigate();
    const [allData,setAllData] =useState ([]) 
    const [value, setValue] = React.useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [show, setShow] = useState(null);



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

  
  
  


    const getCategoriesHandler = async () =>{
        try {
            const response = await axios.get(`${state?.baseUrl}/api/v1/categories`)
            console.log("Categories",response.data)
              setGetAllCategories(response.data.data)
        
        } catch (error) {
            console.log("error in getting all categories", error);
        }
      }
    
    const allProductsHandler= async (e)=>{
      if (e) e.preventDefault();
        try {
          const response = await axios.get(`${state?.baseUrl}/api/v1/items?q=${searchTerm}`)
            console.log("Products",response.data)
            setAllData(response.data)
        
        } catch (error) {
            console.log("error in getting all Product", error);
        }
    }

    const addToCarts = async (productId, productImage, productName, productPrice, productUnitName) => {
   
        try {
            const response = await axios.post(`${state?.baseUrl}/api/v1/cart`, {
              userId:state.user._id,
              productId,
              productImage,
              productName,
              productPrice,
              productUnitName,
              quantity:1
            });
      
            console.log(response.data);
          } catch (error) {
            setShow(true)
            console.log(error.response);
            setError(error.response.data.message)
          }
     
    }

    
    useEffect(() => {
        getCategoriesHandler()
        allProductsHandler()
    },[])
    
    return(
        <div className="main">
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

            <nav className="topNavbar">
                <div className='homeLogo'>
                    <h3>Online Store</h3>
                </div>
                <BsCart4 className='cartIcon'/>
            </nav>
          
            <div className="content">
                <div className="child1">
                    <Carousel style={{margin:"10px",borderRadius:"8px", overflow:"hidden",height:"calc(25vh)"}}>
                    <Carousel.Item >
                    <img
                        className="d-block w-100"
                        src="https://media.istockphoto.com/id/1371318211/photo/groceries-shopping-flat-lay-of-fruits-vegetables-greens-bread-and-oil-in-eco-friendly-bags.jpg?b=1&s=170667a&w=0&k=20&c=LwOTGwEKL2hSwCgIpWKoYWmFBxqwQCLJMtDVRu4I-ys="
                        alt="First slide"

                    />
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://media.istockphoto.com/id/1385196919/photo/inflation-concept.jpg?b=1&s=170667a&w=0&k=20&c=kaezh3QQC46Tf9XBtBehTfFlg-TyIoma-8wtPcWIJJI="
                        alt="Second slide"

                    />
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FybWVudHN8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
                        alt="Third slide"

                    />
                    </Carousel.Item>
                    <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dmVnZXRhYmxlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
                        alt="Fourth slide"

                        
                    />
                    </Carousel.Item> 
                    <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1566707675793-3ec9e5590bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlaG9sZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
                        alt="Fifth slide"

                    />
                    </Carousel.Item>  
                    <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1633881614907-8587c9b93c2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bWFzYWxhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
                        alt="Sixth slide"

                    />
                    </Carousel.Item>  
                    <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZGV2aWNlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
                        alt="Seventh slide"

                    />
                    </Carousel.Item>
                    </Carousel>
                </div>

                <div className="child2">
                    <div className="child2a">
                        <form onSubmit={allProductsHandler}>
                            <InputGroup className="mb-3" style={{margin:"10px",width:"90%"}}>
                                <InputGroup.Text id="basic-addon1" style={{border:"none",background:"#D9D9D9"}}><BsSearch/> </InputGroup.Text>
                                    <Form.Control
                                    placeholder="Search by product name"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className='searchInput'
                                    style={{
                                        background:"#D9D9D9",
                                        color:"dodgerblue",
                                        textTransform:"capitalize",
                                        fontWeight:500

                                    }}
                                    onChange={(e) =>{setSearchTerm(e.target.value)}}
                                  
                                    
                                    />
                            </InputGroup>
                        </form>

                    </div>
                    <div className="child2b">
                    <h5 style={{fontSize:"12px"}}>Shop By Category</h5>
                        {       
                            (getAllCategories.length !== 0)?
                                <div className='home-feed'  >
                                    { getAllCategories.map((eachCategory,i) => (  
                                        <div className='home-options'key={i} >{eachCategory.name}</div>
                                    ))}
                                </div>   
                            :null
                        } 

                    </div>
                    <div className="child2c">
                        <div className="scrollable-content">
                        {

                            (allData?.length)?
                            <>
                                { allData.map((eachProduct,i) => (  
                                <div className='homeProduct' key={i}>
                                    <div className="card">
                                        <div className="card-img"><img src={eachProduct.image} alt="product Image" height="150" width="150"/></div>
                                        <div className="card-body">
                                            <h2 className="card-title">{eachProduct.name}</h2>
                                            <p className="card-description">{eachProduct.description}</p>
                                            <p className="card-price">Rs.{eachProduct.unitPrice} - per {eachProduct.unitName}</p>
                                            <p className="card-button" onClick={() => addToCarts(eachProduct._id, eachProduct.image,eachProduct.name,eachProduct.unitPrice,eachProduct.unitName)}>Add to Cart</p>
                                        </div>
                                    </div>
                                                                    

                                    
                                   
                             
                                </div>
                                ))}
                            </>
                            :
                            null}
                               {(allData?.length === 0 ? "No Product found" : null)}
                              <div style={{position:"absolute", top:"50%",left: "50%"}}>
                                {(allData === null ? <Spinner animation="grow" variant="primary" /> : null)}
                              </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            <nav >
            <Paper sx={{ position: 'fixed', bottom:0,  left: 0, right: 0, background:"green" }} elevation={3} className="homeBottomNavbar">
                <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                >
                    <BottomNavigationAction style={{color:"#61B846"}} href='/' label="Home" icon={<AiOutlineHome />} />
                    <BottomNavigationAction style={{color:"#6D6E71"}} href='/cart' label="Cart" icon={<BsCart4/>} />
                    <BottomNavigationAction style={{color:"#6D6E71"}} href='/adminAccount' label="Account" icon={<FaUserAlt />} />
                </BottomNavigation>
            </Paper>

            </nav>
        </div>

    
      
    )


}

export default Home