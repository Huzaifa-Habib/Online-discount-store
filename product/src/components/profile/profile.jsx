import './profile.css';
import { useState,useEffect } from 'react';
import axios from "axios"
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
import {AiOutlinePlus,AiFillDelete} from "react-icons/ai"
import {BiUpload,BiLogOut} from "react-icons/bi"
import {BsFillCameraFill} from "react-icons/bs"
import Dropdown from 'react-bootstrap/Dropdown';
import {GrUpdate} from "react-icons/gr"
import {FaUserAlt} from "react-icons/fa"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';






















let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}
else{
  baseUrl = "https://lazy-pear-caterpillar-slip.cyclic.app"
}


function Profile() {
  axios.defaults.withCredentials = true


  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [show, setShow] = useState(false);
  const [editTweet,setEditTweet] =useState ("") 
  const [editId,setEditId] =useState (null) 
  const [searchId,setSearchId] =useState (null) 
  
  const [searchData,setSearchData] =useState ("") 
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [showToast, setShowToast] = useState(false);






  const handleClose = () => setShow1(false);
  const handleClose1 = () => setShow2(false);
  const handleShow = () => setShow2(true);
  const handleShow4 = () => setShow4(true);

 

  const handleClose2 = () => setShow2(false);
  const handleClose3 = () => setShow3(false);
  const handleClose4 = () => setShow4(false);





  const [loadTweet, setLoadTweet] = useState(false)

  const [isSpinner, setIsSpinner] = useState(null)
  

  let navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);
  const [imageUpload,setImageUpload] =useState (null) 
  const [imageCoverUpload,setImageCoverUpload] =useState (null) 
  const [showDrpItems,setShowDrpItems] =useState (false) 
  const [deleteAccountEmail, setDeleteAccountEmail] = useState(null)

  // console.log("State", state)




  

  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
    
  }

  const handleShow1 = () => {
    if(showDrpItems == true){
      document.querySelector(".drp-items").style.display = "block"
    }
    
    if(showDrpItems == false){
      document.querySelector(".drp-items").style.display = "none"
    }
  
  
    setShowDrpItems(false)
    setShow3(true)
  };





  
  const allTweetsHandler=()=>{
    axios.get(`${baseUrl}/api/v1/tweets`,{withCredentials: true})
    .then((response) => {
      console.log(response);
      setAllData(response.data.data)
 
    }, (error) => {
      console.log(error);
    });

 
  }

  
  useEffect(() => {
    allTweetsHandler()
  },[loadTweet])


  const deleteTweetHandler = (ids) =>{
    console.log(ids)
    axios.delete(`${baseUrl}/api/v1/tweet/${ids}`,{withCredentials: true})
    .then(response => {
      console.log("response: ", response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        setLoadTweet(!loadTweet)

    }, 1000);
    })

    .catch(err => {
        console.log("error: ", err);
    })

  }

  const handleData = async (id,names,price,desc) =>{
    setShow(true)
    setLoadTweet(!loadTweet)


    // setEditId(id)
    // setEditName(names)
    // setEditPrice(price)
    // setEditDesc(desc)

    // console.log(editId)
    // console.log(editName)


  }
  const updateTweetHandler = (event) =>{
    setShow(false)
    event.preventDefault()
    let Updatetweet = event?.target?.updateTweetText?.value
      axios.put(`${baseUrl}/api/v1/tweet/${editId}`,{
      text:Updatetweet ,
      
    },{withCredentials: true})
    .then((response) => {
      console.log(response);
      setIsSpinner(true)
      setLoadTweet(!loadTweet)

      setTimeout(() => {
        setIsSpinner(false);

    }, 1500);
     
    }, (error) => {
      console.log(error);
    });

    
  



  }

  const getProductHandlerOnId = () =>{
    setShow1(true)
    axios.get(`${baseUrl}/api/v1/tweet/${searchId}`,{withCredentials: true})
    .then((response) => {
      console.log(response);
      setSearchData(response.data.data)


     
    }, (error) => {
      console.log(error);
    });

  }







  const logoutHandler = () =>{
    axios.get(`${baseUrl}/api/v1/logout`,{
      withCredentials: true
    })

    .then((response) => {
      console.log(response);
      setIsSpinner(true)
      setTimeout(() => {
        setIsSpinner(false);
        dispatch({
          type: 'USER_LOGOUT',
          payload: null
      })
    }, 2500);
      
  
    }, (error) => {
      console.log(error);
    });

    
    
  }

  const updateProfilePhotoHandler= () =>{
    let imageRef = ref(storage,`profileImages/${imageUpload?.name + v4()}`);

    uploadBytes(imageRef, imageUpload).then((snapshot) =>{
      console.log("Firebase Storage",snapshot)

      getDownloadURL(snapshot.ref)
      .then((url) =>{
        console.log("ImageURL", url)
            axios.post(`${baseUrl}/api/v1/updateProfileImg`, {
                profileImage:url
            })

            .then((response) => {
                console.log(response);
                setIsSpinner(true)
                setTimeout(() => {
                  setIsSpinner(false);
                  setShow2(false)
                  window.location.reload()
              }, 2000);
                
                
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



  const uploadCoverImageHandler = () =>{
  
    if (imageCoverUpload != null) {}
      let imageRef = ref(storage,`profileImages/${imageCoverUpload?.name + v4()}`);

      uploadBytes(imageRef, imageCoverUpload).then((snapshot) =>{
        console.log("Firebase Storage",snapshot)
  
        getDownloadURL(snapshot.ref)
        .then((url) =>{
          console.log("ImageURL", url)
        
              axios.post(`${baseUrl}/api/v1/uploadCoverPhoto`, {
                coverPhoto:url
              })
  
              .then((response) => {
                  console.log(response);
                  setIsSpinner(true)
                  setTimeout(() => {
                    setIsSpinner(false);
                    window.location.reload()
                }, 1500);
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

  const removeCover = () =>{
      if(state.user.coverPhoto != null){

        axios.put(`${baseUrl}/api/v1/deleteCoverPhoto`)
        .then(response => {
          console.log("response: ", response);
          setIsSpinner(true)
          setTimeout(() => {
            setIsSpinner(false);
            window.location.reload()
        }, 2500);
        })
    
        .catch(err => {
            console.log("error: ", err);
        })
      }
  }

  const accountSuspensionHandler = (e) =>{
    e.preventDefault()
    console.log(deleteAccountEmail)
    if (state.user.email == deleteAccountEmail){
      axios.delete(`${baseUrl}/api/v1/deleteAccount/${deleteAccountEmail}`)
      .then(response => {
        console.log("response: ", response);
        setIsSpinner(true)
        setTimeout(() => {
          setIsSpinner(false);
          navigate("/signup")
          
      }, 2500);
      })
  
      .catch(err => {
          console.log("error: ", err);
      })

    }

    else{
      setShowToast(true)
      
    }


  }

  

  



  


  

  



  return (
    <div className='main-div'>
      <div className='spinner-div'>
        <div className='spinner'>
        <Spinner animation="grow" variant="danger" />
        </div>
      </div>

      

    <div className='leftPannel'>

      <div className='icons'>
      <p><a href="/"><img src="https://img.icons8.com/fluency/512/twitter.png" alt="twitter logo" height="40" width="40" /></a> </p>
      <p><a href="/profile"><FaUserAlt style={{fontSize:"35px",cursor:"pointer",color:"#3f3f3f"}} title='Profile'></FaUserAlt></a> </p>
      <Dropdown>
        <Dropdown.Toggle className='menuBtn' id="dropdown-button-dark-example1" variant="secondary">
          <img src={state?.user?.profileImage} alt='account' height="40" width="40" title = "logout"/>
        </Dropdown.Toggle>

        <Dropdown.Menu >
          <Dropdown.Item onClick={logoutHandler} style={{fontWeight:"bold"}} ><BiLogOut style={{marginRight:"10px",fontSize:"25px"}}/>Log Out</Dropdown.Item>
          <Dropdown.Item style={{fontWeight:"bold"}} ><GrUpdate style={{marginRight:"10px",marginLeft:"3px",fontSize:"20px"}}/>Update Password</Dropdown.Item>
          <Dropdown.Item onClick={handleShow4} style={{fontWeight:"bold"}} href="#/action-4"><AiFillDelete style={{marginRight:"10px",fontSize:"25px"}}/>Delete Account</Dropdown.Item>
            <Modal show={show4} onHide={handleClose4}>
              <Modal.Header closeButton>
                <Modal.Title>Delete My Acconut</Modal.Title>
              </Modal.Header>
                <div>
                  <form onSubmit={accountSuspensionHandler}>
                    <input type="email" required placeholder='Enter your Acconut Email' onChange={(e) =>{
                      setDeleteAccountEmail(e.target.value)

                    }} />
                    <button type='submit' style={{marginBottom:"20px"}}>
                      Delete
                    </button>
                  </form>
                </div>
            </Modal>
        </Dropdown.Menu>
      </Dropdown>

      </div>
    </div>
    <ToastContainer className="p-3" position="bottom-start">
      <Toast onClose={() => setShowToast(false)} show={showToast}  delay={4000} autohide  >
         
          <Toast.Body style={{color:"red",fontWeight:"bold"}}>Your entered Email is not valid!</Toast.Body>
      </Toast>
    </ToastContainer>

 

    <nav className='nav-bar'>
        <h4>{state.user.firstName} {state.user.lastName}</h4>
        <p>{allData.length} Tweets</p>
    </nav>

    <div className='profile-centre-div'> 
        <div className='profile-sec'>
            <div className='coverPhoto' style={{backgroundImage:`url(${state?.user?.coverPhoto})`,backgroundRepeat:"no-repeat",backgroundSize:"cover",imageRendering:"pixelated",backgroundPosition:"50% 50%"}}> 
               <label htmlFor="coverInput">
                </label>
                <Dropdown className='drp'>
                  <Dropdown.Toggle className='cover-btn' id="dropdown-button-dark-example1" variant="secondary">
                      <BsFillCameraFill className='camera-icon'  />Edit Cover Photo

                  </Dropdown.Toggle>

                  <Dropdown.Menu variant="dark" className='menu'>
                    <p onClick={handleShow1}><BiUpload className='upload-icon'/>Upload Photo</p>
                      <Modal show={show3} onHide={handleClose3} animation={false}>
                        <Modal.Header closeButton>
                          <Modal.Title>Update Cover Photo</Modal.Title>
                        </Modal.Header>

                        <Modal.Body className='modal-body'>
                          <label htmlFor="coverInput">
                            <p className='upload-btn'> <AiOutlinePlus className='plus-icon'/>Upload Photo</p>
                          </label>

                          <input style={{display:"none"}}  type="file" name='coverPic' accept='image/jpg, image.jpeg'  id='coverInput' onChange={(e) => {
                              setImageCoverUpload(e.target.files[0])
                        
                          }}/>
                          {/* <span>{imageUpload?.name}</span> */}
                            
                        </Modal.Body>

                        <Modal.Footer>
                          <Button variant="primary" onClick={uploadCoverImageHandler} >
                            Save Changes
                          </Button>
                        </Modal.Footer>

                      </Modal>
                      {(state.user.coverPhoto == "")?
                          null

                      :
                      <p onClick={removeCover}><AiFillDelete className='upload-icon' />Remove</p>

                      }
                  </Dropdown.Menu>
                </Dropdown>
  
      
                  <div className='drp-items'>
                
                  

                   
                
                  </div>


                  
                  

             
            </div>
             
            <div className='profilePhoto'>
                <img src={(!state?.user?.profileImage)?"https://img.icons8.com/material-sharp/256/user.png":state?.user?.profileImage} alt="profile Image" height="150" width="150"/> 
                <img className='updatePhoto' onClick={handleShow} src="https://img.icons8.com/ios-filled/2x/compact-camera.png" alt="Upload Photo" title='Upload Photo' height="40" width="40"/>
                <Modal show={show2} onHide={handleClose2} animation={false}>
                  <Modal.Header closeButton>
                    <Modal.Title>Update Profile Picture</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='modal-body'>
                    <label htmlFor="imgInput">
                      <p className='upload-btn'> <AiOutlinePlus className='plus-icon'/>Upload Photo</p>
                    </label>

                    <input style={{display:"none"}} type="file" name='profilePic' accept='image/png, image/jpg, image.jpeg'  id='imgInput' onChange={(e) => {
                      setImageUpload(e.target.files[0])
                    }}/>
                    {/* <span>{imageUpload?.name}</span> */}
                       
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={updateProfilePhotoHandler}>
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>

            </div>


            <div className='userDetails'>
                <p>{state?.user?.firstName} {state?.user?.lastName}</p>
                <p>@{state?.user?.email}</p>
                <p><img src="https://img.icons8.com/material-sharp/2x/calendar--v2.png" alt="calender logo" height="20" width = "20" />
                <span className='userDate'>Joined {state?.user?.createdOn.split('T')[0]}</span>
                


                </p>
            </div>

           

        </div> 

    

      <div className='display-div' id='display'>
        {

              (allData && allData?.length !== 0)?
                  <div className='profile-posts-div'>

                
                     { allData.map((eachData,i) => (  
                        <div className='posts' key={i}>
                          <div className='info-div'>
                            <img src={(!eachData?.profilePhoto)?"https://img.icons8.com/material-sharp/256/user.png":eachData?.profilePhoto} alt="profilePic" width="50" height = "50" />
                            <p>{eachData?.userFirstName} {eachData.userLastName}</p>
                            <p className='date'>.{eachData?.createdOn.split('T')[0]}</p>          
                            <div className='modifying-div'>
                                <img src="https://img.icons8.com/color/2x/delete-forever.png" alt="delete icon" height="25" onClick={()=>{
                                     deleteTweetHandler(eachData?._id)

                                 }} />
                                <img src="https://img.icons8.com/material-sharp/2x/edit--v3.png" title="Edit"  width="30" height="30" onClick={()=>{
                                    handleData(
                                        setEditId(eachData?._id),
                                        setEditTweet(eachData?.text)
                                      
                                    )

                                }}/>
                            </div>                             
                          </div>

                          <div className='text'>   
                            <p>{eachData?.text}</p>                      
                          </div>

                          <div className='tweetImage'>
                            <img src={eachData.image} />

                          </div>
                        

                        </div>

                      
                   
                      ))}

      


                  </div>
              

                :
                null
          
                    

        

              
        }


      

        <div className='modal-div'>
          <Modal
            show={show}
            backdrop="static"
            keyboard={false}
          >
          <Modal.Header>
            <Modal.Title>Update Your Tweet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form onSubmit={updateTweetHandler} className = "updateForm" >
              
                <label>Tweet Text:</label>
                <textarea name="updateTweetText" id="" cols="80" rows="5" defaultValue={editTweet} required
                 
                ></textarea>
              <Button variant="primary" type='submit' className='updateBtn'>Save Changes</Button>

            </form>


           
          </Modal.Body>

          <Modal.Footer>

          </Modal.Footer>
        </Modal>

        </div>

      </div>


      <div className='onSearchData'>
        
          <Modal
            show={show1}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Your Data of id: {searchData?.id} </Modal.Title>
            </Modal.Header>
            <Modal.Body>
             
             <p>Name: {searchData?.name}</p>
             <p>Price: {searchData?.price}</p>
             <p>Description: {searchData?.description}</p>

             

            
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Ok.
              </Button>
            </Modal.Footer>
          </Modal>

      </div>

     




      
      </div>
    </div>
    
  );
}

export default Profile;