import axios from "axios"
import {useState,useContext,useRef} from 'react';
import {useNavigate} from "react-router-dom"
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {MdEmail} from "react-icons/md"
import Button from 'react-bootstrap/Button';
import {AiFillLock,AiOutlineCloseCircle} from "react-icons/ai"
import { GlobalContext } from '../../context/context';
import "./forget.css"






function ForgetPass() {
    const [verifyEmail, setVerifyEmail] = useState(null)
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [otp, setOtp] = useState(null)
    const [newPass, setNewPass] = useState(null)
    let navigate = useNavigate();
    const [error, setError] = useState("");
    const [show, setShow] = useState(null);
    let { state, dispatch } = useContext(GlobalContext);


    
    if (show === true) {
      document.querySelector(".notificationView").style.display = "block"
    
     }

    if (show === false) {
        document.querySelector(".notificationView").style.display = "none"
      
    }




    const OtpRequestHandler = ((e)=>{
      e.preventDefault()
        axios.post(`${state.baseUrl}/api/v1/forget-password`, {
            email:verifyEmail,
          },{ withCredentials: true })

          .then((response) => {
            console.log(response.data.message);
            setIsOtpSent(true)
          }, (error) => {
            setShow(true)
            console.log(error.response);
            setError(error.response.data.message)
          });
      

       }) 

    const changePassHandler = ((e)=>{
      e.preventDefault()
      axios.post(`${state.baseUrl}/api/v1/forget-password-2`, {
          email:verifyEmail,
          otp:otp,
          newPassword:newPass
        },{ withCredentials: true })

        .then((response) => {
          console.log(response.data.message);
          navigate("/")

        }, (error) => {
            setShow(true)
            console.log(error.response);
            setError(error.response.data.message)

        });
     }) 



    return(
      
      
        <div className="forget-main-div">
          <div className='notificationView' >
            <div className="notification">
                <AiOutlineCloseCircle style={{marginLeft:"auto",cursor:"pointer",fontSize:"18px",position:"relative",top:"-10px",right:"-10px"} }onClick= {() => setShow(false)}/>
                <p className="notification-message">{error} </p>
            </div> 
          </div>
           <nav className='forget-nav'>
           <h3>Online Store</h3>
              <div style={{marginLeft:"auto"}}>
                <a href="/">Login</a>
              </div>     
            </nav>
          <div className="forget-sub-div">


          
         <h3>Update Your Password</h3>

          {(isOtpSent == false)?
          <form onSubmit={OtpRequestHandler}>
              <InputGroup className="mb-3" >
                <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                    <MdEmail style={{color:"white",fontSize:"25px"}}/>
                </InputGroup.Text>
                <Form.Control
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    onChange={(e) => {setVerifyEmail(e.target.value)}}
                    required
                    type="email"

                />
              </InputGroup>
              <Button variant="primary" type="submit" >Send OTP</Button>
          </form>
    
          :
          <div>
            <form onSubmit={changePassHandler}>
            <InputGroup className="mb-3" >
              <InputGroup.Text id="basic-addon1" style={{background:"none", border:"1px solid rgba(128, 128, 128, 0.39)",borderRight:"none"}}>
                  <AiFillLock style={{color:"white",fontSize:"25px"}}/>
              </InputGroup.Text>
              <Form.Control
                  placeholder="OTP"
                  aria-label="OTP"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {setOtp(e.target.value)}}
                  required
                  type="number"
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
                      onChange={(e) => {setNewPass(e.target.value)}}
                      required
                      type="password"   
                  />
              </InputGroup>
              <Button variant="primary" type="submit">Update</Button>

            </form>
            

          </div>
          }
           
           </div>

        </div>
     
    )

}

export default ForgetPass