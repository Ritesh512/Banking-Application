import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import { firebase, auth1 } from './firebase';


function Forgot(){

    const [account,setAccount] = useState();
    const [newPassword,setNewPassword] = useState();
    const [confirmnewPassword,setConfirmNewPassword] = useState();
    let user = JSON.parse(localStorage.getItem("user"));
    const [show, setshow] = useState(false);
    const [otp, setotp] = useState('');
    const [final, setfinal] = useState('');
    const navigate =  useNavigate("");


    function Account(event){
        setAccount(event.target.value);
    }
    function NewPassword(event){
        setNewPassword(event.target.value);
    }
    function ConfirmNewPassword(event){
        setConfirmNewPassword(event.target.value);
    }

    function verify(mob){
        let num = "+91"+mob;
        if (num === "" || num.length < 10) return;

		let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
		auth1.signInWithPhoneNumber(num,verify).then((result) => {
			setfinal(result);
			alert("code sent");
			setshow(true);
		})
			.catch((err) => {
				alert(err);
				window.location.reload();
			});
    }

    const ValidateOtp = () => {
		if (otp === null || final === null)
			return;
        
        
		final.confirm(otp).then((result) => {
			// success
            navigate("/");
		}).catch((err) => {
			alert("Wrong code");
            localStorage.clear();
            navigate("/login");
		})
	}

    async function handlePassword(){
        if(!account || !newPassword || !confirmnewPassword){
            alert("No field should be empty");
            return false;
        }
        if(newPassword !== confirmnewPassword){
            alert("New Password and Confirm New Password must match");
            return false;
        }
        let result=await fetch(`http://localhost:8000/checkUser`,{
            method: "post",
            body:JSON.stringify({account,newPassword}),
            headers:{
                'Content-Type': 'application/json',
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        });
        result = await result.json();
        if(result.result===true){
            verify();
        }else{
            alert("Wrong Password");
        }
        navigate("/");
        
    }


    return (
        <div className="changePasswod">
            <h1 >Forgot Password</h1>
            <input 
                type="text" 
                className='inputBox'
                placeholder="Account No" 
                value={account}
                onChange={Account}
             />
            <input 
                type="password" 
                className='inputBox'
                placeholder="New Password" 
                value={newPassword}
                onChange={NewPassword} 
            />
            <input 
                type="password" 
                className='inputBox'
                placeholder="Confirm New Password" 
                value={confirmnewPassword}
                onChange={ConfirmNewPassword} 
            />
            <button onClick={handlePassword}  className="button">Submit</button>
        </div>
    );
}

export default Forgot;