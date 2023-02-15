import './admin.css';
import { useState,useEffect,useRef } from 'react';
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import {useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import {BiLogOut} from "react-icons/bi"
import {FaUserAlt} from "react-icons/fa"
import {AiOutlineHome, AiFillCamera} from "react-icons/ai"
import {MdAddCircle} from "react-icons/md"
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import * as React from 'react';





function AdminAccount () {
    let { state, dispatch } = useContext(GlobalContext);
    const [imageUpload,setImageUpload] =useState (null) 
    const [categoryName, setCategoryName] = useState("")
    const [getCategories, setgetCategories] = useState([])
    const [isSpinner, setIsSpinner] = useState(null)
    const [value, setValue] = React.useState(0);


    if (isSpinner === true) {
        document.querySelector(".spinner-div").style.display = "block"
        
    }

    if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
    }
    


    const updateProfile = (e) => {
        e.preventDefault()
        let imageRef = ref(storage,`profileImages/${imageUpload?.name + v4()}`);

        uploadBytes(imageRef, imageUpload).then((snapshot) =>{
          console.log("Firebase Storage",snapshot)
    
          getDownloadURL(snapshot.ref)
          .then((url) =>{
            console.log("ImageURL", url)
                axios.post(`${state.baseUrl}/api/v1/updateProfileImg`, {
                    profileImage:url
                })
    
                .then((response) => {
                    console.log(response);
                    window.location.reload();
                }, (error) => {
                    console.log(error.message);
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

    const categorySubmitHandler = async  (e) =>{
        e.preventDefault()
        setIsSpinner(true)

        try {

           const resp = await axios.post(`${state?.baseUrl}/api/v1/category`, {
                category:categoryName

            },{withCredentials: true})
            console.log(resp.data)
            getCategoriesHandler()
            setIsSpinner(false)        
            e.target.reset()

            
            
        } catch (error) {
            setIsSpinner(false)
            console.log("Error in adding category", error)
            
        }

    }

    const getCategoriesHandler = async () =>{
        try {
            const response = await axios.get(`${state?.baseUrl}/api/v1/categories`)
            console.log("Categories",response.data)
             setgetCategories(response.data.data)
        
        } catch (error) {
            console.log("error in getting all categories", error);
        }
    }

    useEffect(() => {
        getCategoriesHandler()
      },[])

      const logOutHandler = () =>{
        axios.get(`${state?.baseUrl}/api/v1/logout`,{
            withCredentials: true
          })
      
          .then((response) => {
            console.log(response);
                dispatch({
                    type: 'ADMIN_LOGOUT',
                    payload: null
                  })
        
          }, (error) => {
            console.log(error);
          });
      }

  

    return(
        <div className="admin-main-div">
            
             <div className='spinner-div'>
                <div className='spinner'>
                  <Spinner animation="grow" variant="danger" />
                </div>
             </div>
    
    
            <div className="Sub-div">
                <h5 className='settingHead'>Settings</h5>
                  <img className="profileImg" src={(state?.user?.profileImage !== "")? state?.user?.profileImage : "https://img.icons8.com/color/1x/administrator-male.png"} height = "100" width="100"/>
                <div className='nameDiv'>
                    
                </div>
                <div className='profileImageDiv'>
                    <form onSubmit={updateProfile}>
                        <label htmlFor="profileImageInput">
                            <div className='imageInputDiv'>
                                <AiFillCamera style={{height:"80px", width:"80px"}}/>
                            </div>

                        </label>
                        <input type="file" name='profilePic' accept='image/png,' placeholder='Update Images'  id='profileImageInput' onChange={(e) => {
                        setImageUpload(e.target.files[0])
                        }} required style={{display:"none"}}/>
                        <button type='submit'>Update</button>

                    </form>
              
                </div>

                <div className='categoryDiv'>
                    <form onSubmit={categorySubmitHandler}>
                        <input type="text" placeholder='Enter new category name' onChange={(e) =>{
                            setCategoryName(e.target.value)

                        }} required />
                        <button type='submit'>Add</button>
                    </form>

                </div>

                <h3 className='cateHead'>All Categories</h3>

            
                    <div className='showCategoryDiv'>
                        {       
                        (getCategories.length !== 0)?
                          <div className='feed'  >
                                { getCategories.map((eachCategory,i) => (  
                                    <div className='options'key={i} >{eachCategory.name}</div>
                                ))}
                          </div>   
                         :<h3>No Products</h3>
                        } 
                    </div>

            </div>

            <div className='footer'>
            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                >
                    <BottomNavigationAction style={{color:"#6D6E71"}} href='/' label="Home" icon={<AiOutlineHome />} />
                    <BottomNavigationAction style={{color:"#6D6E71"}} href='/addItems' label="Add Items" icon={<MdAddCircle/>} />
                    <BottomNavigationAction style={{color:"dodgerblue"}} href='/adminAccount' label="Account" icon={<FaUserAlt />} />
                </BottomNavigation>
            </Paper>            
            </div>

        </div>


    )
}

export default AdminAccount