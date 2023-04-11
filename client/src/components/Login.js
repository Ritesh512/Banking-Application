import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth';
import { firebase, auth1 } from './firebase';

function Login(){
    

    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [show, setshow] = useState(false);
    const [otp, setotp] = useState('');
    const [final, setfinal] = useState('');
    const navigate = useNavigate();
    

    useEffect(() => {
        const auth = localStorage.getItem("user");
        if(auth) {
            navigate('/');
        }
    },[]);

    function Email(event){
        setEmail(event.target.value);
    }

    function Password(event){
        setPassword(event.target.value);
    }

    async function handleLogin(){
        
        let result = await fetch("http://localhost:8000/login",{
            method:"post",
            body:JSON.stringify({email,password}),
            headers:{'Content-Type': 'application/json'}
        });
        result = await result.json();
        console.warn(result);
        if(result.auth){
            localStorage.setItem("user",JSON.stringify(result.user));
            localStorage.setItem("token",JSON.stringify(result.auth));
            let user = JSON.parse(localStorage.getItem("user"));
            console.log(user.mob);
            verify(user.mob);
        }else{
            alert("Please enter correct details");
        }
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
            navigate("/");
		}).catch((err) => {
			alert("Wrong code");
		})
	}

    return (
        <div className='login'> 
            <div style={{ display: !show ? "block" : "none" }}>
            <h1>Login</h1>
            <input 
                type="email" 
                className='inputBox'
                placeholder="Email" 
                value={email}
                onChange={Email}
             />
            <input 
                type="password" 
                className='inputBox'
                placeholder="Password" 
                value={password}
                onChange={Password} 
            />
            <button onClick={handleLogin} className="button">Login</button>
            <p className='forgotPassword'><Link to="/changePassword">Forgot Password</Link></p>
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

export default Login;