import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebase, auth1 } from "./firebase";
import Verify from "./Verify";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addcard, setAddCard] = useState("");
  const [pan, setPan] = useState("");
  const [mob, setMob] = useState("");
  const [dob, setDob] = useState("");
  const [error, setErr] = useState(false);
  const [emailerr, setEmailerr] = useState(false);
  const [moberr, setMoberr] = useState(false);
  const [passerr, setPasserr] = useState(false);
  const [confirmPasserr, setConfirmPasserr] = useState(false);
  const [adderr, setAddrerr] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [show, setshow] = useState(false);
  const [otp, setotp] = useState("");
  const [final, setfinal] = useState("");
  const [proilePass, setProfilePass] = useState("");
  const navigate = useNavigate();
  const [mynumber, setnumber] = useState("");
  const [user] = useAuthState(auth1);

  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  var phoneno = /^\d{1,10}$/;
  var passFormat =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  var aadexpr = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{3}$/;
  var panregex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  function Name(event) {
    setName(event.target.value);
  }

  function Email(event) {
    setEmail(event.target.value);
    if (mailformat.test(email) === false) {
      console.log("ernet");
      setEmailerr(true);
    } else {
      setEmailerr(false);
    }
  }

  function Password(event) {
    setPassword(event.target.value);
    if (passFormat.test(password) === false) {
      console.log("ernet");
      setPasserr(true);
    } else {
      setPasserr(false);
    }
  }
  function AddCard(event) {
    setAddCard(event.target.value);
    if (aadexpr.test(addcard) === false) {
      console.log("ernet");
      setAddrerr(true);
    } else {
      setAddrerr(false);
    }
  }
  function Pan(event) {
    setPan(event.target.value);
  }
  function Mob(event) {
    setMob(event.target.value);
  }
  function Dob(event) {
    setDob(event.target.value);
    const enteredDate = new Date(event.target.value);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - enteredDate.getFullYear();
    console.log(typeof(age))

    if (age < 18) {
      setErr(true);
    } else {
      setErr(false);
      setDob(event.target.value);
    }
  }

  function ConfirmPass(event) {
    setConfirmPass(event.target.value);
  }

  function ProfilePass(event) {
    setProfilePass(event.target.value);
  }

  const ValidateOtp = () => {
    if (otp === null || final === null) return;
    final
      .confirm(otp)
      .then((result) => {
        // success
        navigate("/");
      })
      .catch((err) => {
        alert("Wrong code");
      });
  };

  async function submit() {
    if (
      !name ||
      !email ||
      !password ||
      !confirmPass ||
      !mob ||
      !pan ||
      !addcard
    ) {
      setErr(true);
      alert("No field should be empty");
      return false;
    }

    if (password !== confirmPass) {
      setConfirmPasserr(true);
      return false;
    }

    let result = await fetch("http://localhost:8000/register", {
      method: "post",
      body: JSON.stringify({
        name,
        email,
        password,
        addcard,
        pan,
        mob,
        dob,
        proilePass,
      }),
      headers: { "Content-Type": "application/json" },
    });
    result = await result.json();
    console.warn(result);

    localStorage.setItem("user", JSON.stringify(result.result));
    localStorage.setItem("token", JSON.stringify(result.auth));
    console.log(user);
    console.log("");
    // setnumber("+91"+mob);
    console.log(mob);

    let num = "+91" + mob;
    if (num === "" || num.length < 10) return;
    console.log(num);
    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-container");
    auth1
      .signInWithPhoneNumber(num, verify)
      .then((result) => {
        setfinal(result);
        alert("code sent");
        setshow(true);
      })
      .catch((err) => {
        alert(err);
        window.location.reload();
      });
  }

  return (
    <div className="register">
      <div style={{ display: !show ? "block" : "none" }}>
        <h1>Registered</h1>

        <section className="gridSignUp">
          <div>
            <div className="flexSignup">
              <label>Name: </label>
              <input
                className="inputBox"
                type="text"
                name="name"
                placeholder="Full Name"
                value={name}
                onChange={Name}
              />
            </div>
            {error && !name && <span className="error">Enter valid name</span>}
          </div>
          <div>
            <div className="flexSignup">
              <label>Aadhar No.: </label>
              <input
                className="inputBox"
                type="text"
                name="adh"
                placeholder="Aadhar No"
                value={addcard}
                onChange={AddCard}
              />
            </div>
            {adderr && <span className="error">Enter valid Addahar No.</span>}
            {error && !addcard && (
              <span className="error">Enter valid Addahar No.</span>
            )}
          </div>
          <div>
            <div className="flexSignup">
              <label>Email: </label>
              <input
                className="inputBox"
                type="email"
                name="email"
                placeholder="Your Email"
                value={email}
                onChange={Email}
              />
            </div>
            {emailerr && <span className="error">Enter valid Email</span>}
            {error && !email && (
              <span className="error">Enter valid Email</span>
            )}
          </div>

          <div>
            <div className="flexSignup">
              <label>Pan No.: </label>
              <input
                className="inputBox"
                type="text"
                name="pan"
                placeholder="Pan No"
                value={pan}
                onChange={Pan}
              />
            </div>
            {error && !pan && <span className="error">Enter valid Pan</span>}
          </div>
          <div>
            <div className="flexSignup">
              <label>Phone No.: </label>
              <input
                className="inputBox"
                type="text"
                name="number"
                placeholder="phone"
                value={mob}
                onChange={Mob}
              />
            </div>
            {moberr && <span className="error">Enter valid Mobile No.</span>}
            {error && !mob && (
              <span className="error">Enter valid Mobile No.</span>
            )}
          </div>

          <div>
            <div className="flexSignup">
              <label>DOB: </label>
              <input
                className="inputBox"
                type="date"
                name="number"
                placeholder="phone"
                value={dob}
                onChange={Dob}
              />
            </div>
            {error && <span className="error">Age should be greater than 18</span>}
          </div>

          <div>
            <div className="flexSignup">
              <label>Password</label>
              <input
                type="password"
                className="inputBox"
                placeholder="Password"
                value={password}
                onChange={Password}
              />
            </div>
            {error && !password && (
              <span className="error">Enter valid Password</span>
            )}
            {passerr && <span className="error">Enter valid Password</span>}
          </div>

          <div>
            <div className="flexSignup">
              <label>Confirm Password</label>
              <input
                type="password"
                className="inputBox"
                placeholder="Password"
                value={confirmPass}
                onChange={ConfirmPass}
              />
            </div>
            {error && !confirmPass && (
              <span className="error">Enter valid Password</span>
            )}
            {confirmPasserr && <span className="error">Check Password</span>}
          </div>
          <div>
            <div className="flexSignup">
              <label>Profile Password</label>
              <input
                type="password"
                className="inputBox"
                placeholder="Profile Password"
                value={proilePass}
                onChange={ProfilePass}
              />
            </div>
            {error && !confirmPass && (
              <span className="error">Enter valid Password</span>
            )}
            {confirmPasserr && <span className="error">Check Password</span>}
          </div>
        </section>
        <button className="button" onClick={submit}>
          Sign Up
        </button>
        <div id="recaptcha-container"></div>
      </div>
      <div style={{ display: show ? "block" : "none" }}>
        <input
          type="text"
          placeholder={"Enter your OTP"}
          onChange={(e) => {
            setotp(e.target.value);
          }}
        ></input>
        <br />
        <br />
        <button onClick={ValidateOtp}>Verify</button>
      </div>
    </div>
  );
}

export default Signup;
