import './adminScreen.css';
import { useState,useEffect } from 'react';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import {BiLogOut} from "react-icons/bi"
import {AiOutlineHome} from "react-icons/ai"
import {FaUserAlt} from "react-icons/fa"
import {IoChevronBackSharp} from "react-icons/io5"
import {MdAddCircle} from "react-icons/md"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import {BsCardList} from "react-icons/bs"


function AdminScreen() {
  axios.defaults.withCredentials = true
  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [loadTweet, setLoadTweet] = useState(false)
  const [isSpinner, setIsSpinner] = useState(null)
  let navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);
  const [value, setValue] = React.useState(0);


  // console.log("state", state)

  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
  }




  const allProductsHandler= async ()=>{
        try {
            const response = await axios.get(`${state?.baseUrl}/api/v1/items`,{ withCredentials: true })
            console.log("Products",response.data)
             setAllData(response.data)
        
        } catch (error) {
            console.log("error in getting all tweets", error);
        }
  }

  
  useEffect(() => {
    allProductsHandler()
  },[loadTweet])


  const logoutHandler =  () =>{
    axios.get(`${state.baseUrl}/api/v1/logout`,{
      withCredentials: true
    })

    .then((response) => {
      console.log(response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        setLoadTweet(!loadTweet)
        dispatch({
          type: 'USER_LOGOUT',
          payload: null
      })
    }, 2500);
     
    }, (error) => {
      console.log(error);
    });

    
    
  }


  return (
    <div className='main-div'>
      <div className='spinner-div'>
        <div className='spinner'>
          <Spinner animation="grow" variant="danger" />
        </div>
      </div>
      <div className='subDiv'>
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

          <h5 className='productHead'>All Products</h5>
        <div className='productDisplayDiv'>
          {

            (allData.length)?
              <>
                { allData.map((eachProduct,i) => (  
                  <div className='product' key={i}>

                  <img className='item-img' src={eachProduct.image} alt="product img" />
                  <div>
                  <span style={{fontSize:'1em',color:"#239400", textTransform:"capitalize"}}
                  >{eachProduct.name}</span>
                  <br />
                  <span style={{fontSize:'0.8em',color:"#444444", textTransform:"capitalize"}}
                  >1. {eachProduct.unitName}</span>
    
                  </div>
                  <p style={{fontSize:'0.9em',color:"#444444",marginLeft:"auto",paddingRight:'5px'}}
                  >Rs.{eachProduct.unitPrice}</p>
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
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
              setValue(newValue);
          }}
          >
              <BottomNavigationAction style={{color:"dodgerblue"}}  href='/' label="Home" icon={<AiOutlineHome />} />
              <BottomNavigationAction style={{color:"#6D6E71"}} href='/addItems' label="Add Items" icon={<MdAddCircle/>} />
              <BottomNavigationAction style={{color:"#6D6E71"}} href='/adminAccount' label="Account" icon={<FaUserAlt />} />
          </BottomNavigation>
        </Paper>        
      

    </div>
    
  );
}

export default AdminScreen;