import './App.css';
import {Route,Routes,Link,Navigate} from "react-router-dom"
import Home from "./components/home/home"
import Login from "./components/login/login"
import Signup from "./components/signup/signup"
import {useState,useEffect,useContext} from "react"
import axios from 'axios';
import { GlobalContext } from './context/context';
import 'bootstrap/dist/css/bootstrap.min.css';
import Spinner from 'react-bootstrap/Spinner';
import UpdatePassword from './components/update-pass/update';
import ForgetPass from './components/forget-pass/forget';
import ForgetPassWithSms from './components/forget-pass-with-sms/sms';
import AdminScreen from './components/admin/adminScreen';
import AdminAccount from './components/admin-account/admin';
import AddItem from './components/addItems/add';
import Cart from './components/cart/cart';
import UserAccount from './components/user_account/userAccount';
import OrderHandling from './components/order-handling/orderHandling';



axios.defaults.withCredentials = true

function App() {
  let { state, dispatch } = useContext(GlobalContext);
  console.log(state)

  useEffect(() => {

    const getProfile = async () => {
      try {
        let response = await axios.get(`${state.baseUrl}/api/v1/profile`, {
          withCredentials: true
        })
        console.log("Profile: ", response.data);
        if(response.data.email === "huzaifahabib098@gmail.com"){
          dispatch({
            type: 'ADMIN_LOGIN',
            payload: response.data
          })
          return
        }

        else{
          dispatch({
            type: 'USER_LOGIN',
            payload:response.data
          })
      

        }
 
      } catch (error) {
        console.log("axios error: ", error);
        dispatch({
          type: 'USER_LOGOUT'
        })
        dispatch({
          type: 'ADMIN_LOGOUT'
        })
      
      }



    }
    getProfile();

  }, [])

  useEffect(() => {

    const getGoogleUsersProfile = async () => {
      try {
        let response = await axios.get(`${state.baseUrl}/api/v1/googleUsersProfile`, {
          withCredentials: true
        })
        console.log("Profile: ", response.data);
        dispatch({
          type: 'GOOGLE_USER_LOGIN',
          payload:response.data
        })
     
 
      } catch (error) {
        console.log("axios error: ", error);
        dispatch({
          type: 'GOOGLE_USER_LOGOUT'
        })
        
      }

    }
    getGoogleUsersProfile();

  }, [])

  useEffect(() => {

    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      config.withCredentials = true;
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      if (error.response.status === 401) {
        dispatch({
          type: 'USER_LOGOUT'
        })
        dispatch({
          type: 'ADMIN_LOGOUT'
        })
      }
      return Promise.reject(error);
    });
  }, [])




  

  return (
    <div>
       {/* {(state.isLogin == false)?

         :
         null
        }   */}

         {
         (state?.isLogin === true || state?.isGoogleUserLogin === true)?
            <Routes>
              <Route path="/" element={<Home />} />   
              <Route path="/cart" element={<Cart />} />
              <Route path="/userAccount" element={<UserAccount/>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/update-password" element={<UpdatePassword />} />

            </Routes>   
          :
            null
        } 

        {
         (state?.isAdmin === true ) ?
            <Routes >
              <Route path="/" element={<AdminScreen />} />
              <Route path="/adminAccount" element={<AdminAccount />} />
              <Route path="/addItems" element={<AddItem />} />
              <Route path="/orderHandling" element={<OrderHandling />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Routes>   
          :
            null
        } 


        {    
         (state.isLogin === false && state.isAdmin === false && state?.isGoogleUserLogin === false) ?

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget-password" element={<ForgetPass />} />
              <Route path="*" element={<Login/>}/>
              <Route path="/forget-pass-with-sms" element={<ForgetPassWithSms />} />
            </Routes>   
          :
            null
        }  
         
       

         { 
         (state.isLogin === null && state?.isAdmin === null && state?.isGoogleUserLogin === null) ?
          <div className='loadingScreen'>
              <Spinner animation="border" variant="danger" />
                <p className='loadTxt'>Loading...</p>

          
            
          </div>
           
          :
            null
         } 

        




    </div>
      
  );
}

export default App;