// import "./test.css"
// import { useState,useEffect } from 'react';
// import axios from "axios"
// import Spinner from 'react-bootstrap/Spinner';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {useRef,useContext} from 'react';
// import {useNavigate} from "react-router-dom"
// import { GlobalContext } from '../../context/context';
// import Carousel from 'react-bootstrap/Carousel';
// import {BsCart4,BsSearch} from "react-icons/bs"
// import {FaUserAlt} from "react-icons/fa"
// import {AiOutlineHome, AiFillCamera} from "react-icons/ai"
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import Paper from '@mui/material/Paper';
// import * as React from 'react';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';


// function Test (){
//     let { state, dispatch } = useContext(GlobalContext);
//     const [isSpinner, setIsSpinner] = useState(null)
//     const [getAllCategories, setGetAllCategories] = useState([])
//     let navigate = useNavigate();
//     const [allData,setAllData] =useState ([]) 
//     const [value, setValue] = React.useState(0);
//     if (isSpinner === true) {
//         document.querySelector(".spinner-div").style.display = "block"
      
//       }
  
//     if (isSpinner === false) {
//         document.querySelector(".spinner-div").style.display = "none"
//     }
//     const getCategoriesHandler = async () =>{
//         try {
//             const response = await axios.get(`${state?.baseUrl}/api/v1/categories`)
//             console.log("Categories",response.data)
//               setGetAllCategories(response.data.data)
        
//         } catch (error) {
//             console.log("error in getting all categories", error);
//         }
//       }
    
//     const allProductsHandler= async ()=>{
//         try {
//             const response = await axios.get(`${state?.baseUrl}/api/v1/items`)
//             console.log("Products",response.data)
//                 setAllData(response.data.data)
        
//         } catch (error) {
//             console.log("error in getting all tweets", error);
//         }
//     }
    
//     useEffect(() => {
//         getCategoriesHandler()
//         allProductsHandler()
//     },[])
    
//     return(
//         <div class="main">
//             <div className='spinner-div'>
//                 <div className='spinner'>
//                 <Spinner animation="grow" variant="danger" />
//                 </div>
//             </div>
//             <nav class="topNavbar">
//                 <div className='homeLogo'>
//                     <h3>Online Store</h3>
//                 </div>
//                 <BsCart4 className='cartIcon'/>
//             </nav>
          
//             <div class="content">
//                 <div class="child1">
//                     <Carousel style={{margin:"10px",borderRadius:"8px", overflow:"hidden",height:"calc(25vh)"}}>
//                     <Carousel.Item >
//                     <img
//                         className="d-block w-100"
//                         src="https://media.istockphoto.com/id/1371318211/photo/groceries-shopping-flat-lay-of-fruits-vegetables-greens-bread-and-oil-in-eco-friendly-bags.jpg?b=1&s=170667a&w=0&k=20&c=LwOTGwEKL2hSwCgIpWKoYWmFBxqwQCLJMtDVRu4I-ys="
//                         alt="First slide"

//                     />
//                     </Carousel.Item>
//                     <Carousel.Item>
//                     <img
//                         className="d-block w-100"
//                         src="https://media.istockphoto.com/id/1385196919/photo/inflation-concept.jpg?b=1&s=170667a&w=0&k=20&c=kaezh3QQC46Tf9XBtBehTfFlg-TyIoma-8wtPcWIJJI="
//                         alt="Second slide"

//                     />
//                     </Carousel.Item>
//                     <Carousel.Item>
//                     <img
//                         className="d-block w-100"
//                         src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FybWVudHN8ZW58MHx8MHx8&auto=format&fit=crop&w=400&q=60"
//                         alt="Third slide"

//                     />
//                     </Carousel.Item>
//                     <Carousel.Item>
//                     <img
//                         className="d-block w-100"
//                         src="https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dmVnZXRhYmxlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
//                         alt="Fourth slide"

                        
//                     />
//                     </Carousel.Item> 
//                     <Carousel.Item>
//                     <img
//                         className="d-block w-100"
//                         src="https://images.unsplash.com/photo-1566707675793-3ec9e5590bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGhvdXNlaG9sZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
//                         alt="Fifth slide"

//                     />
//                     </Carousel.Item>  
//                     <Carousel.Item>
//                     <img
//                         className="d-block w-100"
//                         src="https://images.unsplash.com/photo-1633881614907-8587c9b93c2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bWFzYWxhfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
//                         alt="Sixth slide"

//                     />
//                     </Carousel.Item>  
//                     <Carousel.Item>
//                     <img
//                         className="d-block w-100"
//                         src="https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZGV2aWNlc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=400&q=60"
//                         alt="Seventh slide"

//                     />
//                     </Carousel.Item>
//                     </Carousel>
//                 </div>

//                 <div class="child2">
//                     <div class="child2a">
//                         <form>
//                             <InputGroup className="mb-3" style={{margin:"10px",width:"90%"}}>
//                                 <InputGroup.Text id="basic-addon1" style={{border:"none",background:"#D9D9D9"}}><BsSearch/> </InputGroup.Text>
//                                     <Form.Control
//                                     placeholder="Search by product name"
//                                     aria-label="Username"
//                                     aria-describedby="basic-addon1"
//                                     className='searchInput'
//                                     style={{
//                                         background:"#D9D9D9",
//                                         color:"dodgerblue",
//                                         textTransform:"capitalize",
//                                         fontWeight:500

//                                     }}
                                    
//                                     />
//                             </InputGroup>
//                         </form>

//                     </div>
//                     <div class="child2b">
//                     <h5 style={{fontSize:"12px"}}>Shop By Category</h5>
//                         {       
//                             (getAllCategories.length !== 0)?
//                                 <div className='home-feed'  >
//                                     { getAllCategories.map((eachCategory,i) => (  
//                                         <div className='home-options'key={i} >{eachCategory.name}</div>
//                                     ))}
//                                 </div>   
//                             :null
//                         } 

//                     </div>
//                     <div class="child2c">
//                         <div class="scrollable-content">
//                         {

//                             (allData.length !== 0)?
//                             <>
//                                 { allData.map((eachProduct,i) => (  
//                                 <div className='homeProduct' key={i}>
//                                     <img className='item-img' src={eachProduct.image} alt="product img" />
//                                     <div>
//                                     <span style={{fontSize:'1em',color:"#239400", textTransform:"capitalize"}}
//                                     >{eachProduct.name}</span>
//                                     <br />
//                                     <span style={{fontSize:'0.8em',color:"#444444", textTransform:"capitalize"}}
//                                     >1. {eachProduct.unitName}</span>
//                                     </div>
//                                     <p style={{fontSize:'0.9em',color:"#444444",marginLeft:"auto",paddingRight:'5px'}}
//                                     >Rs.{eachProduct.unitPrice}</p>
//                                 </div>
//                                 ))}
//                             </>
//                             :
//                             <h3>No Products</h3>}
                            
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <nav >
//             <Paper sx={{ position: 'fixed', bottom:0,  left: 0, right: 0, background:"green" }} elevation={3} className="homeBottomNavbar">
//                 <BottomNavigation
//                 showLabels
//                 value={value}
//                 onChange={(event, newValue) => {
//                     setValue(newValue);
//                 }}
//                 >
//                     <BottomNavigationAction style={{color:"#61B846"}} href='/' label="Home" icon={<AiOutlineHome />} />
//                     <BottomNavigationAction style={{color:"#6D6E71"}} href='/addItems' label="Add Items" icon={<BsCart4/>} />
//                     <BottomNavigationAction style={{color:"#6D6E71"}} href='/adminAccount' label="Account" icon={<FaUserAlt />} />
//                 </BottomNavigation>
//             </Paper>

//             </nav>
//         </div>

    
      
//     )


// }

// export default Test