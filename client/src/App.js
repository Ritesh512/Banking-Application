import React, { useState } from 'react';
// import Header from './components/Header';
import Nav from "./components/Nav"
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import PrivateComponent from './components/privateComponenet';
import Profile from './components/profile';
import AddBenifi from './components/AddBenifi';
import Beneficiary from './components/Beneficiary';
import SendMoney from './components/SendMoney';
import ChangePassword from './components/ChangePassword';
import './App.css';
import './user.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';



function App() {
 
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
        <Route element={<PrivateComponent />}>
          <Route path="/" element={<Profile />}/>
          <Route path="/addBeneficiary" element={<AddBenifi />}/>
          <Route path="/sendMoney" element={<Beneficiary />}/>
          <Route path="/SendMoney/:id" element={<SendMoney />}/>
          <Route path="/logout" element={<h1>Logout</h1>}/>
        </Route>
          
          <Route path="/login" element={<Login />}/>
          <Route path="/Signup" element={<Signup />}/>
          <Route path="/changePassword" element={<ChangePassword />}/>
        </Routes>
      </BrowserRouter>
      <Footer />
      
    </div>
  );
}

export default App;
