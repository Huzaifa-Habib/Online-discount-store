import "./signup.css"
import { useState,useRef,useContext } from 'react';
import { GlobalContext } from '../../context/context';
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {v4} from "uuid"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {BiUser} from "react-icons/bi"
import {MdEmail} from "react-icons/md"
import {AiFillLock,AiOutlinePlus,AiOutlineCloseCircle} from "react-icons/ai"
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';





function Signup() {
    axios.defaults.withCredentials = true
    const [fullName,setFullName] =useState ("") 
    const [email,setEmail] =useState ("") 
    const [password,setPassword] =useState ("") 
    let navigate = useNavigate();
    const [imageUpload,setImageUpload] =useState (null) 
    let { state, dispatch } = useContext(GlobalContext);
    const [error, setError] = useState("");
    const [show, setShow] = useState(null);
    const [isSpinner, setIsSpinner] = useState(null)


    
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



    const signUpHandler = (event)=>{
        event.preventDefault()
        let errorDiv = document.getElementById("error")
        let alertDiv = document.getElementById("alert")

        if(imageUpload !== null){
            setIsSpinner(true)

            let imageRef = ref(storage,`profileImages/${imageUpload?.name + v4()}`);
            uploadBytes(imageRef, imageUpload).then((snapshot) =>{
            console.log("Firebase Storage",snapshot)

                getDownloadURL(snapshot.ref)
                .then((url) =>{
                    console.log("ImageURL", url)
                        axios.post(`${state.baseUrl}/api/v1/signup`, {
                            fullName: fullName,   
                            email:email,
                            password:password,
                            profileImage:url
                        })

                        .then((response) => {
                            console.log(response);
                            event.target.reset();
                            setIsSpinner(false)
                            navigate("/")
                            

                        }, (error) => {
                            console.log(error);
                            alertDiv.style.display = "block"
                            errorDiv.textContent = error?.response?.data?.message
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

        else{
            setIsSpinner(true)

            axios.post(`${state.baseUrl}/api/v1/signup`, {
                fullName: fullName,   
                email:email,
                password:password,
                profileImage:""
            })

            .then((response) => {
                console.log(response);
                event.target.reset();
                setIsSpinner(false)
                navigate("/")

            }, (error) => {
                setIsSpinner(false)
                setShow(true)
                console.log(error.response);
                setError(error.response.data.message)
                
            });

        }


    }
    
 

    return (

        <div className='signup-main-div'>
            <div className='spinner-div'>
                <div className='spinner'>
                <Spinner animation="grow" variant="danger" />
                </div>
            </div>
                   
            <div className='notificationView' >
                <div className="notification">
                    <AiOutlineCloseCircle style={{marginLeft:"auto",cursor:"pointer",fontSize:"18px",position:"relative",top:"-10px",right:"-10px"} }onClick= {() => setShow(false)}/>
                    <p className="notification-message">{error} </p>
                </div> 
            </div>


            <div className='signUp-sub-div'>
                <h3>Register Yourself</h3>
                <form onSubmit={signUpHandler} className = "submitForm">
                    <InputGroup className="mb-3" >
                        <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                            <BiUser style={{color:"white",fontSize:"25px"}}/>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            onChange={(e) => {setFullName(e.target.value)}}
                            required
                            type="text"
                            style={{textTransform:"capitalize"}}
                        />
                    </InputGroup>


                    
                    <InputGroup className="mb-3" >
                        <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                            <MdEmail style={{color:"white",fontSize:"25px"}}/>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Email"
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                            onChange={(e) => {setEmail(e.target.value)}}
                            required
                            type="email"


                            
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                            <AiFillLock style={{color:"white",fontSize:"25px"}}/>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            onChange={(e) => {setPassword(e.target.value)}}
                            required
                            type="password"


                            
                        />
                    </InputGroup>

                    <InputGroup className="mb-3" >
                        <label htmlFor="imageInput" style={{width:"100%"}}>  
                            <div className="uploadDiv"><AiOutlinePlus style={{color:"white", fontWeight:"bold", fontSize:"30px", marginRight:"5px"}}/> Upload Profile</div>
                        </label>
                            <Form.Control
                                placeholder="Profile Image"
                                aria-label="Profile Image"
                                aria-describedby="basic-addon1"
                                id="imageInput"
                                type="file"
                                style={{display:"none"}}
                                onChange={(e) => {setImageUpload(e.target.value)}}

                            />
                    </InputGroup>

                    <Button variant="primary" size="lg" active type="submit">
                        Sign Up
                    </Button>       
                </form>
                <br />
                <a href="/" style={{color:"white", fontSize:"14px"}}>Already have an account? LogIn.</a>

                
                

            </div>
          
        </div>
      );


}


export default Signup;