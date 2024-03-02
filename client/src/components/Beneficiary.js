import React, { useEffect, useState } from "react";
import { IoArrowForwardCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

function Beneficiary() {
  const [details, setDetails] = useState([]);
  let [len, setLen] = useState(0);
  let user = JSON.parse(localStorage.getItem("user"));
  let navigate = useNavigate();

  useEffect(() => {
    getDetails();
  }, []);

  async function getDetails() {
    let result = await fetch(`/getBeneficiary/${user._id}`, {
      headers: {
        authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    });
    result = await result.json();
    if (result) {
      setDetails(result);
      let size = result.length;
      console.log(size);
      setLen(size);
    } else {
      navigate("/");
    }
  }

  async function handleClick(event) {
    let key = event.target.value;
    let id = user._id;
    console.log(key);
    if (key) {
      let result = await fetch(`/search/${key}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      result = await result.json();
      if (result) {
        setDetails(result);
      }
    } else {
      getDetails();
    }
  }

  return (
    <div className="List">
      <input
        className="search-input"
        placeholder="Search..."
        onChange={handleClick}
      />
      <ul>
        <li>Name</li>
        <li>Email</li>
        <li style={{ width: "300px;" }}>Account No</li>
        <li>Send</li>
      </ul>
      {len > 0 ? (
        details.map(function (item, index) {
          return (
            <ul key={item._id}>
              <li>{item.name}</li>
              <li>{item.email}</li>
              <li style={{ width: "300px;" }}>{item.account}</li>
              <li>
                <Link to={"/sendMoney/" + item.account}>
                  {IoArrowForwardCircle()}
                </Link>
              </li>
            </ul>
          );
        })
      ) : (
        <h1>No data found</h1>
      )}
    </div>
  );
}

export default Beneficiary;
