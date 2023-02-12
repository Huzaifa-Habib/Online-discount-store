import './adminScreen.css';
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











let baseUrl = ""
if (window.location.href.split(":")[0] === "http") {
  baseUrl = "http://localhost:3000";
  
}


function AdminScreen() {
  axios.defaults.withCredentials = true

  const [data,setData] =useState ("") 
  const [allData,setAllData] =useState ([]) 
  const [editTweet,setEditTweet] =useState ("") 
  const [editId,setEditId] =useState (null) 
  const [searchId,setSearchId] =useState (null) 
  const [searchData,setSearchData] =useState ("") 
  const [loadTweet, setLoadTweet] = useState(false)
  const [isSpinner, setIsSpinner] = useState(null)
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const lastRef = useRef(null);
  let navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);
  const [productImageUpload,setProductImageUpload] =useState (null) 
  const [eof, setEof] = useState(false)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [productName,setProductName] =useState (null) 
  const [productCategory,setProductCategory] =useState (null)
  const [productDesc,setProductDesc] =useState (null) 
  const [productUnit,setProductUnit] =useState (null) 
  const [productPrice,setProductPrice] =useState (null) 

  // console.log("state", state)

  // if (isSpinner === true) {
  //   document.querySelector(".spinner-div").style.display = "block"
    
  // }
  // if (isSpinner === false) {
  //   document.querySelector(".spinner-div").style.display = "none"
  // }



  const productSubmitHandler =(event) =>{
    event.preventDefault()
      let imageRef = ref(storage,`Store Items/${productImageUpload?.name + v4()}`);

      uploadBytes(imageRef, productImageUpload).then((snapshot) =>{
        console.log("Firebase Storage",snapshot)
  
        getDownloadURL(snapshot.ref)
        .then((url) =>{
          console.log("ImageURL", url)
          axios.post(`${state?.baseUrl}/api/v1/item`, {
            name: productName,
            productImage: url,
            description:productDesc,
            price:productPrice,
            unit:productUnit,
            category:productCategory

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
              console.log("Product Posting Error",error);
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

  const allProductsHandler= async ()=>{
        try {
            const response = await axios.get(`${state?.baseUrl}/api/v1/items`)
            console.log("Products",response.data)
             setAllData(response.data.data)
        
        } catch (error) {
            console.log("error in getting all tweets", error);
        }
  }

  
  useEffect(() => {
    allProductsHandler()
  },[loadTweet])

  const getProductHandlerOnId = () =>{
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
      {/* <div className='spinner-div'>
        <div className='spinner'>
        <Spinner animation="grow" variant="danger" />
        </div>
      </div> */}
      <div className='subDiv'>
        <div className='navBar'>
          <div className='userInfo'>
            <div className='userInfo'>
             <img src={(state?.user?.profileImage !== "")? state?.user?.profileImage : "https://img.icons8.com/color/1x/administrator-male.png"} height = "50" width="50"/>
             <span>{state?.user?.firstName} {state?.user?.lastName}</span>
             <p>Admin</p>

            </div>
  
          </div>

          <div className='addProductIcon'>
            <img src="https://img.icons8.com/external-tal-revivo-filled-tal-revivo/256/external-horizontal-separated-bars-representing-hamburger-menu-layout-grid-filled-tal-revivo.png"
             alt="" height="20" width="20" onClick={handleShow}/>

          </div>
          <div className='settings'>
            <a href="/adminAccount" className='adminSettings' title='Settings'><img src="https://img.icons8.com/ios/1x/settings--v2.png" alt="" height={30} width={30} /></a>

          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={ productSubmitHandler} className = "addProductForm">
                <input type="file" onChange={(e) => {
                 setProductImageUpload(e.target.files[0])
                }} required accept='image/png'  />
                <input type="text" placeholder='Item Name' 
                onChange={(e) => {
                  setProductName(e.target.value)
                 }} required />

                <input type="text" placeholder='Select Category' 
                onChange={(e) => {
                  setProductCategory(e.target.value)
                 }} required />


                <textarea name="" id="" cols="40" rows="5" placeholder='Describe this Item' required
                onChange={(e) => {
                  setProductDesc(e.target.value)
                 }}
                ></textarea>
                <div className='unitName'>
                  <p>Unit Name </p>
                  <input type="text" placeholder='Pcs. / Kg/ dozen' maxLength="5" required
                  onChange={(e) => {
                    setProductUnit(e.target.value)
                   }}/>
                </div>

                <div className='unitPrice'>
                  <p>Unit Price </p>
                  <input type="number" placeholder='Rs.0.00' required maxLength="4"
                     onChange={(e) => {
                      setProductPrice(e.target.value)
                     }}/> 
                </div>

                <Button variant="primary" onClick={handleClose} type = "submit">
                Add Product
              </Button>
              </form>

            </Modal.Body>
            <Modal.Footer>

            
            </Modal.Footer>
          </Modal>


        </div>

          <h5 className='productHead'>All Products</h5>
        <div className='productDisplayDiv'>
          {

            (allData.length !== 0)?
              <>
                { allData.map((eachProduct,i) => (  
                  <div className='product' key={i}>

                  <img className='item-img' src={eachProduct.image} alt="product img" />
                  <div>
                  <span style={{fontSize:'1em',color:"#239400", textTransform:"capitalize"}}
                  >{eachProduct.name}</span>
                  <br />
                  <span style={{fontSize:'0.8em',color:"#444444", textTransform:"capitalize"}}
                  >1. {eachProduct.unitName}</span>
    
                  </div>
                  <p style={{fontSize:'0.9em',color:"#444444",marginLeft:"auto",paddingRight:'5px'}}
                  >Rs.{eachProduct.unitPrice}</p>
                </div>


                  
                  
        
            ))}

        </>


  :
  <h3>No Products</h3>

    

}
          
          
          
        </div>
      </div>
      
    </div>
    
  );
}

export default AdminScreen;