import './home.css';
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
import {BiLogOut} from "react-icons/bi"
import {FaUserAlt} from "react-icons/fa"
import InfiniteScroll from 'react-infinite-scroller';










let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}
else{
  baseUrl = "https://lazy-pear-caterpillar-slip.cyclic.app"
}


function Home() {
  axios.defaults.withCredentials = true


  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [show, setShow] = useState(false);
  const [editTweet,setEditTweet] =useState ("") 
  const [editId,setEditId] =useState (null) 
  const [searchId,setSearchId] =useState (null) 
  
  const [searchData,setSearchData] =useState ("") 
  const [show1, setShow1] = useState(false);

  const handleClose = () => setShow1(false);
  const [loadTweet, setLoadTweet] = useState(false)
  const [isSpinner, setIsSpinner] = useState(null)
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const lastRef = useRef(null);
  let navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);
  const [imageUpload,setImageUpload] =useState (null) 
  const [eof, setEof] = useState(false)




  

  if (isSpinner === true) {
    document.querySelector(".spinner-div").style.display = "block"
    
  }
  if (isSpinner === false) {
    document.querySelector(".spinner-div").style.display = "none"
  }



  const submitHandler =(event) =>{
    event.preventDefault()
    let tweetText = event.target.tweetText.value
    if (imageUpload !== null) {
      let imageRef = ref(storage,`tweetImages/${imageUpload?.name + v4()}`);

      uploadBytes(imageRef, imageUpload).then((snapshot) =>{
        console.log("Firebase Storage",snapshot)
  
        getDownloadURL(snapshot.ref)
        .then((url) =>{
          console.log("ImageURL", url)
          axios.post(`${baseUrl}/api/v1/tweet`, {
            text: tweetText,
            image: url,
            profilePhoto:state.user.profileImage,
            userFirstName:state.user.firstName,
            userLastName:state.user.lastName,
            email:state.user.email
          },{withCredentials: true})
  
            .then((response) => {
              console.log(response);
              setData(response.data.data)
              setIsSpinner(true)
              setTimeout(() => {
                setIsSpinner(false);
                setLoadTweet(!loadTweet)
            }, 2000);
              event.target.reset();
  
            }, (error) => {
              console.log("Tweet Posting Error",error);
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

    else{
      axios.post(`${baseUrl}/api/v1/tweet`, {
        text: tweetText,
        profilePhoto:state.user.profileImage,
        userFirstName:state.user.firstName,
        userLastName:state.user.lastName,
        email:state.user.email

      },{withCredentials: true})

        .then((response) => {
          console.log(response);
          setData(response.data.data)
          setIsSpinner(true)
          setTimeout(() => {
            setIsSpinner(false);
            setLoadTweet(!loadTweet)
        }, 2000);
          event.target.reset();

        }, (error) => {
          console.log("Tweet Posting Error",error);
        });
      
    }


     

    




   

  }

  const allTweetsHandler= async ()=>{
    if (eof) return;
        try {
            const response = await axios.get(`${baseUrl}/api/v1/tweetFeed?page=${allData.length}`)

           


setAllData(response.data.data)
            // setAllData((prev) => {

            //     // if (prev.length >= 5) {
            //     //     prev = prev.slice(5)
            //     // }
            //     return [...prev, ...response.data.data]
            // })

        } catch (error) {
            console.log("error in getting all tweets", error);
        }

 
  }

  
  useEffect(() => {
    allTweetsHandler()
  },[loadTweet])

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


  let descEmptyError = document.querySelector(".descEmptyError")
  let descError = document.querySelector(".descLengthError")

  const descHandler = (e) =>{
    if (e.target.value == "") {
      descEmptyError.style.display = "block"
      descError.style.display = "none"

    }

    else{
      descEmptyError.style.display = "none"
      descError.style.display = "none"
    }

  }

  const descLengthError = (e) =>{
    if (e?.target?.value?.length < 3) {
      descError.style.display = "block"
      descEmptyError.style.display = "none"

    }

    else{
      descEmptyError.style.display = "none"
      descError.style.display = "none"
    }

  }

  const logoutHandler =  () =>{
    axios.get(`${baseUrl}/api/v1/logout`,{
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

    <div className='leftPannel'>

      <div className='icons'>
      <p title='Home'><a href="/"><img src="https://img.icons8.com/fluency/512/twitter.png" alt="twitter logo" height="40" width="40"  /></a> </p>
      <p><a href="/profile"><FaUserAlt style={{fontSize:"35px",cursor:"pointer",color:"#3f3f3f"}} title='Profile'></FaUserAlt></a> </p>
      <p><BiLogOut onClick={logoutHandler} style={{fontSize:"35px",cursor:"pointer",color:"#3f3f33"}} title="Log Out"/></p>
      </div>

    </div>

    <div className='centre-div'>

   
  

  
   
     

      <div className='input-div'>
        <form onSubmit={submitHandler}>
          <div className='userPic'>
            <img src={state?.user?.profileImage} alt="Proflie Image" height="60" width="60" />
              <div>
                 <p>For Everyone</p>
              </div>
          </div>
        
          <textarea name="tweetText" ref={lastRef} id='desc' rows={3} placeholder="What's happening?" required maxLength={200} onBlur={descHandler} onChange={descLengthError}></textarea>
          <span className='descEmptyError'>Don't leave field empty!</span>
          <span className='descLengthError'>Your Value should be greater than two characters</span>

          
          <div className="image-upload">
            <div>
            <label htmlFor="imgInput">
              <img src="https://img.icons8.com/color/512/image-gallery.png" height="40" width="40" alt='Gallery icon' title='Upload Image'/>
            </label>

              <input type="file" name='profilePic' accept='image/png, image/jpg, image.jpeg'  id='imgInput' onChange={(e) => {
                 setImageUpload(e.target.files[0])
              }}/> <span className='optional'>*Optional</span> 

            </div>

            <div>
              <button type='submit' className='btn'>Tweet</button>
            </div>

         
    
          </div>


        </form>
      </div>

      {/* <InfiniteScroll
        pageStart={5}
        loadMore={allTweetsHandler}
        hasMore={!eof}
        loader={<div className="loader">Loading ...</div>}
      
      > */}

      <div className='display-div'id='display'>
    
        {

              (allData && allData?.length !== 0)?
                  <div className='posts-div'>

                
                     { allData.map((eachData,i) => (  
                        <div className='posts' key={i}>
                          <div className='info-div'>
                          {console.log(eachData)}

                         
                            <img src={(!eachData?.profilePhoto)?"https://img.icons8.com/material-sharp/256/user.png":eachData?.profilePhoto} alt="profilePic" width="50" height = "50" />
                            <p>{eachData?.userFirstName} {eachData.userLastName}</p>
                            <p className='date'>.{eachData?.createdOn.split('T')[0]}</p>                                       
                          </div>

                          <div className='text'>   
                            <p>{eachData?.text}</p>                      
                          </div>

                          <div className='tweetImage'>
                          {
                              (eachData?.image !== undefined)?
                              <img src={eachData.image} />
                              :
                              null
                            }
                            

                          </div>
                        

                        </div>

                      
                   
                      ))}

      


                  </div>
              

                :
                null
               
        }
      {/* </InfiniteScroll> */}
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

export default Home;