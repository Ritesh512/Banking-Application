import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';


function ChangePassword(){

    const [password,setPassword] = useState();
    const [newPassword,setNewPassword] = useState();
    const [confirmnewPassword,setConfirmNewPassword] = useState();
    let user = JSON.parse(localStorage.getItem("user"));
    const navigate =  useNavigate("");


    function Password(event){
        setPassword(event.target.value);
    }
    function NewPassword(event){
        setNewPassword(event.target.value);
    }
    function ConfirmNewPassword(event){
        setConfirmNewPassword(event.target.value);
    }

    async function handlePassword(){
        if(!password || !newPassword || !confirmnewPassword){
            alert("No field should be empty");
            return false;
        }
        if(newPassword !== confirmnewPassword){
            alert("New Password and Confirm New Password must match");
            return false;
        }
        let result=await fetch(`http://localhost:8000/changePassword/${user._id}`,{
            method: "post",
            body:JSON.stringify({password,newPassword}),
            headers:{
                'Content-Type': 'application/json',
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        });
        result = await result.json();
        if(result.result===true){
            alert("Password Updated Successfully");
        }else{
            alert("Wrong Password");
        }
        navigate("/");
        
    }


    return (
        <div className="changePasswod">
            <h1 >Change Password</h1>
            <input 
                type="password" 
                className='inputBox'
                placeholder="Old Password" 
                value={password}
                onChange={Password}
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

export default ChangePassword;