import "./login.css"
import { useState,useEffect,useContext } from 'react';
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {BiUser} from "react-icons/bi"
import {MdEmail} from "react-icons/md"
import {AiFillLock,AiOutlineCloseCircle} from "react-icons/ai"
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
// import { io } from "socket.io-client";
import GoogleLogin from "react-google-login"











function Login() {
  axios.defaults.withCredentials = true
    const [email,setEmail] =useState ("") 
    const [password,setPassword] =useState ("") 
    let navigate = useNavigate();
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



  const loginHandler = (event)=>{
      event.preventDefault()
      setIsSpinner(true)
      

      axios.post(`${state.baseUrl}/api/v1/login`, {
          email:email,
          password:password
        },{ withCredentials: true })

        .then((response) => {
          console.log(response);
          event.target.reset();
          if(email === "huzaifahabib098@gmail.com"){
            dispatch({
              type: 'ADMIN_LOGIN',
              payload: response.data.profile
            })
            setIsSpinner(false)
            navigate("/")
            window.location.reload()
            return;
            
          }
          else{
            dispatch({
              type: 'USER_LOGIN',
              payload: response.data.profile
            })
            navigate("/")
            window.location.reload()
            setIsSpinner(false)


          }




        }, (error) => {
          setShow(true)
          console.log(error.response);
          setError(error.response.data.message)
          setIsSpinner(false)

          
          
        });
    



  }

  const responseSuccessGoogle = (res) =>{
    console.log(res)

  }

  const responseErrorGoogle = (res) =>{
 
  }


 

    return (

        <div className='login-main-div'>
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

            <div className='logIn-sub-div'>
                <h3>Login to Your account</h3>
                <form onSubmit={loginHandler} className = "loginForm">
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
                      <Button variant="primary" size="lg" active type="submit">
                          Log In
                      </Button>
                   </form>
                   <h6 style={{textAlign:"center", color:"white", paddingTop:"10px"}}>OR</h6>

                    <GoogleLogin
                      clientId="145925509834-ja233hj73en3c7j5o7ngf0j1s2fuve9e.apps.googleusercontent.com"
                      buttonText="Login With Google"
                      onSuccess={responseSuccessGoogle}
                      onFailure={responseErrorGoogle}
                      cookiePolicy={'single_host_origin'}  
                      className = "googleLogin"             
                    />
           

                <br />
                <a href="/signup" style={{color:"white", fontSize:"14px"}}>Didn't have an account? Register.</a> <br />
                <a href="/forget-password" style={{color:"white", fontSize:"14px"}}>Forget Password?</a>
             
                
                

            </div>
          
        </div>
      );


}


export default Login;
