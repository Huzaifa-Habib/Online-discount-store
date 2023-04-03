import "./login.css"
import { useState,useEffect,useContext } from 'react';
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { GlobalContext } from '../../context/context';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {BiUser} from "react-icons/bi"
import {MdEmail} from "react-icons/md"
import {FcGoogle} from "react-icons/fc"
import {AiFillLock,AiOutlineCloseCircle} from "react-icons/ai"
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
// import { io } from "socket.io-client";
// import { getAuth,signInWithPopup,GoogleAuthProvider } from "firebase/auth";
// import {auth} from "../../firebase"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import { GoogleLogin } from '@react-oauth/google';


function Login() {
  axios.defaults.withCredentials = true
    const [email,setEmail] =useState ("") 
    const [password,setPassword] =useState ("") 
    let navigate = useNavigate();
    let { state, dispatch } = useContext(GlobalContext);
    const [error, setError] = useState("");
    const [show, setShow] = useState(null);
    const [isSpinner, setIsSpinner] = useState(null)
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState([]);


    
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
          setIsSpinner(false)

          console.log(error.response);
          setError(error.response.data.message)

        });
  }

  // const googleloginHandler = () =>{
  //   const provider = new GoogleAuthProvider();
  //   // provider.setCustomParameters({
  //   //     'login_hint': 'user@example.com'
  //   //   });
  //   const auth = getAuth()
  //   signInWithPopup(auth, provider)
  //           .then ((result)  => {
  //             // This gives you a Google Access Token. You can use it to access the Google API.
  //             const credential = GoogleAuthProvider.credentialFromResult(result);
  //             const token = credential.accessToken;
  //             // The signed-in user info.
  //             const googleUser = result.user;
  //             console.log(googleUser)

  //             axios.post(`${state.baseUrl}/api/v1/googleUserSignup`, {
  //               fullName: googleUser.displayName,   
  //               email:googleUser.email,
  //               googleId:googleUser.uid,
  //               profileImage:(googleUser.photoURL !== "")?googleUser.photoURL:""
  //             })

  //               .then((response) => {
  //                 console.log(response);
  //                 setIsSpinner(false)
  //                 dispatch({
  //                   type: 'GOOGLE_USER_LOGIN',
  //                   payload: response.data.profile
  //                 })
  //                 navigate("/")
                  

  //               }, (error) => {
  //                   console.log(error);
  //                   setIsSpinner(false)

  //               });

  //             // ...
  //           }).catch((error) => {
  //               // Handle Errors here.
  //               const errorMessage = error.message;
  //               // The email of the user's account used.
  //               const email = error.customData.email;
  //               // The AuthCredential type that was used.
  //               const credential = GoogleAuthProvider.credentialFromError(error);
  //               console.log("Google Error ", errorMessage )

  //           });
  // }
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
});

useEffect(
    () => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                        withCredentials:true
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
);


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
                   {/* <button style={{display:"flex", background:"white", padding:"10px", borderRadius:"5px", fontWeight:"700",marginLeft:"auto", marginRight:"auto"}} onClick={googleloginHandler}><FcGoogle style={{fontSize:"20px", marginRight:"10px", marginTop:"1px"}}/> Sign In With Google</button> */}
                   {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
                   <button onClick={() => login()}>Sign in with Google 🚀 </button>



           

                <br />
                <a href="/signup" style={{color:"white", fontSize:"14px"}}>Didn't have an account? Register.</a> <br />
                <a href="/forget-password" style={{color:"white", fontSize:"14px"}}>Forget Password?</a>
             
                
                

            </div>
          
        </div>
      );


}


export default Login;
