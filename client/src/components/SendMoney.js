import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import { firebase, auth1 } from './firebase';

function SendMoney(){
    const navigate =  useNavigate("");
    // const [userbal,setUserBal] = useState(0);
    const [amount,setAmount] = useState("");
    const [bal,setbal] = useState(0);
    const [password,setPassword] = useState("");
    const [show, setshow] = useState(false);
    const [otp, setotp] = useState('');
    const [final, setfinal] = useState('');
    const param = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(param.id);
    // let bal = 0;

    useEffect(()=>{
        checkbal();
       },[]);

   function Amount(event){
    setAmount(event.target.value);
   }
   function Password(event){
    setPassword(event.target.value);
   }

   function verify(mob){
        let num = "+91"+mob;
        if (num === "" || num.length < 10) return;

        let verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        auth1.signInWithPhoneNumber(num,verify).then((result) => {
            setfinal(result);
            alert("code sent")
            setshow(true);
        })
            .catch((err) => {
                alert(err);
                window.location.reload()
            });
    }

    const ValidateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            // success
            alert("Transaction successful");
            navigate("/");
        }).catch((err) => {
            alert("Wrong code");
        })
    }

    async function checkbal(){
        let result1=await fetch(`http://localhost:8000/getDetails/${user._id}`,{
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        });
        result1 = await result1.json();
        if(result1){
            setbal(result1.balance);
            console.log("Ritesh:::",bal);
        }
    }
    async function submit(){

        // if(user.)
        if(user.profilePassword===password){
            if(Number(bal)>=Number(amount) && Number(amount)>=0){
                let accountNo = param.id;
                let result=await fetch(`http://localhost:8000/sendAmount/${user._id}`,{
                    method: "post",
                    body:JSON.stringify({accountNo,amount,password}),
                    headers:{
                        'Content-Type': 'application/json',
                        authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
                    }
                });
                result = await result.json();
                // console.warn(result);
                // console.log(user.mob);
                verify(user.mob);
            }else{
                alert("Your Account Balance is Low");
                navigate("/");
            }
        }else{
            alert("Please enter Correct password");
            navigate("/");
        }
        
    }

    return (
        <div className="product">
            <div style={{ display: !show ? "block" : "none" }}>
                <h1>Send Money</h1>
                <input type="text" 
                    className='inputBox'
                    placeholder="Enter Amount" 
                    value={amount}
                    onChange={Amount}
                />
                <input type="password" 
                    className='inputBox'
                    placeholder="Enter Your Profile Password" 
                    value={password}
                    onChange={Password}
                />
                

                <button className="button" onClick={submit}>Send</button>
                <div id="recaptcha-container"></div>
            </div>
            <div style={{ display: show ? "block" : "none" }}>
                    <input type="text" placeholder={"Enter your OTP"}
						onChange={(e) => { setotp(e.target.value) }}></input>
					<br /><br />
					<button onClick={ValidateOtp}>Verify</button>
            </div>

        </div>
    );
}

export default SendMoney;