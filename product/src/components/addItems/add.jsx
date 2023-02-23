import { useState,useEffect } from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import { GlobalContext } from '../../context/context';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import axios from "axios"
import Button from 'react-bootstrap/Button';
import {AiOutlineHome, AiFillCamera} from "react-icons/ai"
import {FaUserAlt} from "react-icons/fa"
import {MdAddCircle} from "react-icons/md"
import {IoMdArrowDropdown} from "react-icons/io"
import Spinner from 'react-bootstrap/Spinner';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import {IoChevronBackSharp} from "react-icons/io5"






import './add.css';


function AddItem (){
    const [productName,setProductName] =useState (null) 
    const [productDesc,setProductDesc] =useState (null) 
    const [productUnit,setProductUnit] =useState (null) 
    const [productPrice,setProductPrice] =useState (null) 
    const [productImageUpload,setProductImageUpload] =useState (null) 
    const [isSpinner, setIsSpinner] = useState(null)
    const [loadTweet, setLoadTweet] = useState(false)
    let { state, dispatch } = useContext(GlobalContext);
    const [data,setData] =useState ("") 
    let navigate = useNavigate();
    const [getAllCategories, setgetAllCategories] = useState([])
    const [value, setValue] = React.useState(0);


    
  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
  }







const productSubmitHandler =(event) =>{
    event.preventDefault()
    setIsSpinner(true)
    let category = document.forms["form"].categories.value
    let imageRef = ref(storage,`Store Items/${productImageUpload?.name + v4()}`);

    uploadBytes(imageRef, productImageUpload).then((snapshot) =>{
    console.log("Firebase Storage",snapshot)

    getDownloadURL(snapshot.ref)
    .then((url) =>{
        console.log("ImageURL", url)
        axios.post(`${state?.baseUrl}/api/v1/item`, {
        name: productName,
        productImage: url,
        description:productDesc,
        price:productPrice,
        unit:productUnit,
        category:category

        },{withCredentials: true})

        .then((response) => {
            console.log(response);
            setData(response.data.data)
            event.target.reset();
            setIsSpinner(false)
            navigate("/")

        }, (error) => {
            console.log("Product Posting Error",error);
        });

    })
    .catch((e) =>{
        console.log("Image Url Error", e)

    })
    
    })
    .catch((e) =>{
    console.log("Storage Error", e)

    })
}

const getCategoriesHandler = async () =>{
    try {
        const response = await axios.get(`${state?.baseUrl}/api/v1/categories`)
        console.log("Categories",response.data)
         setgetAllCategories(response.data.data)
    
    } catch (error) {
        console.log("error in getting all categories", error);
    }
}

useEffect(() => {
    getCategoriesHandler()
},[])

    return(
        <div className='mainDivAdd'>
            <div className='spinner-div'>
                <div className='spinner'>
                    <Spinner animation="grow" variant="danger" />
                </div>
            </div>
                <div className='navBar'>
                <IoChevronBackSharp onClick={()=>navigate(-1)} style={{height:"35",width:"35",marginTop:"8px",color:"#3f3f3f3f"}}/>
                    <div className='adminInfo'>
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
                        <span>{state?.user?.fullName}</span>
                        <p>Admin</p>
                    </div>
                </div>
            <div className='addItemSubDiv'>

                <h4 className='addItemHead'>Add New Item</h4>
                <form onSubmit={ productSubmitHandler} className = "addProductForm" id='form'>
                    <label htmlFor="productImage">
                        <div className='imageInputDiv'>
                            <AiFillCamera style={{height:"80px", width:"80px"}}/>
                        </div>

                    </label>
                    <input type="file" onChange={(e) => {
                        setProductImageUpload(e.target.files[0])
                    }} required accept='image/png' id='productImage' style={{display:"none"}}  />


                  

                    <input type="text" placeholder='Item Name' 
                        onChange={(e) => {
                        setProductName(e.target.value)
                    }} required />

                        {
                            (getAllCategories.length === 0)?<p>Add Category First</p>:
                            <>
                                <select required name="categories" id="categories" style={{width:"94%",padding:"5px", marginTop:"10px",backgroundColor:"rgba(128, 128, 128, 0.212)",border:"none", borderRadius:"5px",textTransform:"capitalize",fontWeight:"bold",}}>
                                    { getAllCategories.map((eachCategory, i) => (                                
                                        <option key={i} style={{textTransform:"capitalize",fontWeight:"bold"}}>{eachCategory?.name}</option> 
                                    ))}
                                </select>
            
                             </>
            


                        }
                        



                    <textarea name="" id="" rows="5" placeholder='Describe this Item' required
                        onChange={(e) => {
                        setProductDesc(e.target.value)
                        }}
                    ></textarea>

                    <div className='unitName'>
                        <p>Unit Name </p>
                        <input type="text" placeholder='Pcs. / Kg/ dozen' maxLength="5" required
                        onChange={(e) => {
                            setProductUnit(e.target.value)
                        }}/>
                    </div>

                    <div className='unitPrice'>
                        <p>Unit Price </p>
                        <input type="number" placeholder='Rs.0.00' required maxLength="4"
                            onChange={(e) => {
                            setProductPrice(e.target.value)
                        }}/> 
                    </div>

                    <Button variant="primary" type = "submit" className='addItemBtn'>
                        Add Product
                    </Button>
                </form>

            </div>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                >
              <BottomNavigationAction style={{color:"#6D6E71"}} href='/' label="Home" icon={<AiOutlineHome />} />
              <BottomNavigationAction style={{color:"dodgerblue"}} href='/addItems' label="Add Items" icon={<MdAddCircle/>} />
              <BottomNavigationAction style={{color:"#6D6E71"}} href='/adminAccount' label="Account" icon={<FaUserAlt />} />
          </BottomNavigation>
        </Paper>        

        </div>
  
    )
}

export default AddItem