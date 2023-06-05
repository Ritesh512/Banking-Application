import React,{ useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

function AddBenifi(){

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [account,setAccount] = useState("");
    let navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem("user"));

    function Name(event){
        setName(event.target.value);
    }

    function Email(event){
        setEmail(event.target.value);
    }

    function Account(event){
        setAccount(event.target.value);
    }

    async function verifyAccount(){
        console.log("click")
        let result=await fetch(`http://localhost:8000/verifyAccount/${account}`,{
            headers: {
                'Content-Type': 'application/json',
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        });
        result = await result.json();
        console.log(result);
        if(result.result){
            let res = await fetch(`http://localhost:8000/addBeneficiary/${user._id}`,{
                method:"post",
                body:JSON.stringify({name,email,account}),
                headers: {
                    'Content-Type': 'application/json',
                    authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
                }
            });
            res = await res.json();
            console.log("2nd",res);
            if(res.result===false){
                alert("User already added");
            }else{
                alert("User added successfully");
                navigate("/");
            }
        }else{
            alert("Invalid Account No.");
        }
    }

    return (
        <div className='benifici'>
            <h1>Add Beneficiary</h1>
            <input 
                type="text" 
                className='inputBox'
                placeholder="Name"
                value={name}
                onChange={Name} 
            />
            <input 
                type="email" 
                className='inputBox'
                placeholder="Email" 
                value={email}
                onChange={Email} 
            />
            <input 
                type="text" 
                className='inputBox'
                placeholder="Account No." 
                value={account}
                onChange={Account}
            />
            <button className="button" onClick={verifyAccount}>Add</button>
        </div>
    );
}

export default AddBenifi;