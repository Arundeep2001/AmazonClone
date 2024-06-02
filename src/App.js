import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Home from './Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Checkout from './Checkout';
import Login from './Login';
import React, { useEffect } from 'react';
import { auth } from './firebase'
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements} from '@stripe/react-stripe-js';
import Orders from './Orders';


const promise = loadStripe("pk_test_51NZWXwSFBwiTvzetMdscb6XyiGWGPbsDaQBEfha4iylEEOVE54Hb4sK3vjk0vZP59Y25ZiXqPnqrAqDueYIVMIbf007PkBedpS");

function App() {
  
  const [{},dispatch] = useStateValue();


  // This useEffect() only runs once when the app component loads. It is a type of listener. Whenever app loads it listens.
  useEffect(()=>{
      auth.onAuthStateChanged(authUser=>{
        console.log("The user is ",authUser);


        if(authUser){
          // The user has just loggged in or the user was loggid in .
  
          dispatch({
            type:'SET_USER',
            user: authUser
          });
        }else{
          // The user is logged out.
          
          dispatch({
            type:"SET_USER",
            user:null,
          })
        }
      });

    },[]);

  return (
    <BrowserRouter>
      <div className="App">
        
        <Routes>
          <Route element={<><Header/><Home/></>}  path="/">
          </Route>
          <Route element={<><Header/><Orders/></>}  path="/orders">
          </Route>
          <Route element={<><Header/><Checkout/></>} path="/checkout">
          </Route>
          <Route element={<Login/>} path='/login' >
          </Route>
          <Route element={<><Header/><Elements stripe={promise}><Payment/></Elements></>} path='/payment'>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
