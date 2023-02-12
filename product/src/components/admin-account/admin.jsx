import './admin.css';
import { useState,useEffect } from 'react';
import axios, { all } from "axios"
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import {useRef,useContext} from 'react';
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import {BiLogOut} from "react-icons/bi"
import {FaUserAlt} from "react-icons/fa"
import InfiniteScroll from 'react-infinite-scroller';
import { async } from '@firebase/util';

function AdminAccount () {
    let { state, dispatch } = useContext(GlobalContext);
    const [isEditFirstName, setIsEditFirstName] = useState(false)
    const [isEditLastName, setIsEditLastName] = useState(false)
    const [editedFirstName, setEditedFirstName] = useState("")
    const [editedLastName, setEditedLastName] = useState("")
    const [imageUpload,setImageUpload] =useState (null) 
    const [categoryName, setCategoryName] = useState("")
    const [getCategories, setgetCategories] = useState([])




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

        try {

           const resp = await axios.post(`${state?.baseUrl}/api/v1/category`, {
                category:categoryName

            },{withCredentials: true})
            console.log(resp.data)
            getCategoriesHandler()

            
            
        } catch (error) {
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
        <div className="main-div">
            <div className="Sub-div">
                <h5 className='settingHead'>Settings</h5>
                  <img className="profileImg" src={(state?.user?.profileImage !== "")? state?.user?.profileImage : "https://img.icons8.com/color/1x/administrator-male.png"} height = "50" width="50"/>
                <div className='nameDiv'>
                    <div className='updateLastName'>
                        {(isEditLastName === false)? <p>Update Full Name</p>: <input type="text"
                        defaultValue={state.user.lastName }  /> }
                    </div>
                </div>
                <div className='profileImageDiv'>
                    <form onSubmit={updateProfile}>
                        <input type="file" name='profilePic' accept='image/png,' placeholder='Update Images'  id='imgInput' onChange={(e) => {
                        setImageUpload(e.target.files[0])
                        }} required/>
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
            <>
                { getCategories.map((eachCategory,i) => (  
                    <div className='category' key={i}>
                      <div className='options'>
                        {eachCategory.name}
                      </div>

                 </div>


                  
                  
        
            ))}

        </>


  :
  <h3>No Products</h3>

    

}


                </div>
                <button className='logOut' onClick={logOutHandler}>Log out</button>



            </div>

        </div>


    )
}

export default AdminAccount