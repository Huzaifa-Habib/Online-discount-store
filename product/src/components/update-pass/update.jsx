import { GlobalContext } from '../../context/context';
import axios from "axios"
import {useState,useContext,useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from 'react-bootstrap/Toast';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ToastContainer from 'react-bootstrap/ToastContainer';
import {AiFillLock,AiOutlineCloseCircle} from "react-icons/ai"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import "./update.css"




function UpdatePassword() {
    let { state, dispatch } = useContext(GlobalContext);
    const [currentPass, setCurrentPass] = useState(null)
    const [newPass, setNewPass] = useState(null)
    const firstRef = useRef(null);
    const secondRef = useRef(null);
    const [isSpinner, setIsSpinner] = useState(null)
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [showNote, setShowNote] = useState(null);

    
    if (showNote === true) {
      document.querySelector(".notificationView").style.display = "block"
    
     }

    if (showNote === false) {
        document.querySelector(".notificationView").style.display = "none"
      
    }

    if (isSpinner === true) {
        document.querySelector(".spinnerDiv").style.display = "block"
        
      }
    
    if (isSpinner === false) {
        document.querySelector(".spinnerDiv").style.display = "none"
    }
    



    const logoutHandler = () =>{
        axios.get(`${state.baseUrl}/api/v1/logout`,{
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
        }, 2000);
       
        }, (error) => {
        console.log(error);
        });
    
    }

    const updatePasswordHandler=(e) =>{
        let errorDiv = document.getElementById("error")
        let alertDiv = document.getElementById("alert")
        e.preventDefault()
        axios.post(`${state.baseUrl}/api/v1/change-password`,{
            currentPassword: currentPass,
            password: newPass
        },{withCredentials: true})
        .then((response) => {
            console.log(response);
            setIsSpinner(true)
            setTimeout(() => {
                setIsSpinner(false);
                setShow(true)
                e.target.reset()
            }, 3000);
    
        }, (error) => {
            console.log(error);
            alertDiv.style.display = "block"
            errorDiv.textContent = error?.response?.data
           
            


        });
        


    }

    const closeHandler = () =>{
        let alertDiv = document.getElementById("alert")
        alertDiv.style.display = "none"
  
      }
    

    return(
        <div className='forget-main-div'>
            <div className="alerts-div" id="alert">
                <div className="error-div">
                <p id="error"></p>
                <button onClick={closeHandler}>Ok</button>

            </div>
          </div>

            <div className='spinnerDiv'>
                <div className='spinner'>
                    <Spinner animation="grow" variant="danger" />
                </div>

            </div>
            <ToastContainer position='bottom-end' className='toast-div'>
                <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Body className='txt'>Password change successfully </Toast.Body>
                </Toast>
            </ToastContainer>

            <div className='forgetNav'>
                <h3>Online Store</h3>

                <div style={{marginLeft:"auto"}}>
                    <a href="/">Login</a>

                </div>

                
            </div>

            <div className='center-div'>
                <h3>Update Password</h3>
                <form onSubmit={updatePasswordHandler}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                            <AiFillLock style={{color:"white",fontSize:"25px"}}/>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Current Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            onChange={(e) => {setCurrentPass(e.target.value)}}
                            required
                            type="password"   
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                            <AiFillLock style={{color:"white",fontSize:"25px"}}/>
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="New Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            onChange={(e) => {setNewPass(e.target.value)}}
                            required
                            type="password"   
                        />
                    </InputGroup>
                    <Button variant="primary">Primary</Button>


                </form>
                

            </div>
        </div>

        
    )

}

export default UpdatePassword