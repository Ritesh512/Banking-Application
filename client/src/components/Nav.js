import React from 'react';
import { Link,useNavigate } from 'react-router-dom';

function Nav(){
    const auth = localStorage.getItem('user');
    const navigate= useNavigate();
    function logout(){
        localStorage.clear();
        navigate("/Signup");
    }
    return (
        <div>
        <img 
            src={require("../logo.png")}
            alt="logo"
            className="logo"
        />
            { auth?<ul className='nav-ul'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/addBeneficiary">Add Beneficiary</Link></li>
                <li><Link to="/sendMoney">Send Money</Link></li>
                <li className="logout"><Link onClick={logout} to="/SignUp">Logout ({JSON.parse(auth).name})</Link></li>
                
            </ul>
            :
            <ul className='nav-ul nav-right'>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/Signup">Signup</Link></li>
            </ul>}
        </div>
    );
}

export default Nav;