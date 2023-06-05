import React,{ useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import PaymentForm from './CreditCard';
import { FaRupeeSign } from "react-icons/fa";
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';


function Profile(){
    const param = useParams();
    let user = JSON.parse(localStorage.getItem("user"));
    let [userbal,setUserBal] = useState([]);
    let [checkPassdate,setCheckPassdate] = useState(false);
    let [len,setLen] = useState(0); 
    let navigate = useNavigate();
    let [x,setx] = useState(100);
    let [y,sety] = useState(40);
    
    const data = {
        labels: ['Send', 'Recieved'],
        datasets: [
          {
            data: [x, y],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
          },
        ],
      };

    useEffect(()=>{
        setTimeout(async ()=>{
            let result=await fetch(`http://localhost:8000/checkPassdate/${user._id}`,{
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        });
            result = await result.json();
            if(result.result===true){
            
                setCheckPassdate(true);
            }else{
                setCheckPassdate(false);
            }
        },1000);
        getDetail();
       },[]);

       async function getDetail(){
        let result=await fetch(`http://localhost:8000/getDetails/${user._id}`,{
            headers: {
                authorization:`bearer ${JSON.parse(localStorage.getItem("token"))}`
            }
        });
        result = await result.json();
        if(result){
            setUserBal(result);
            let size = result.date.length;
            setLen(size);
            let sum1=0,sum2=0;
            result.send.forEach(function(item){
                sum1+=Number(item);
            });
            console.log(sum1);
            result.received.forEach(function(item){
                sum2+=Number(item);
            });
            console.log(sum2);

            setx(sum1);
            sety(sum2);
            console.log(checkPassdate);
            if(checkPassdate){
                alert("Please Change your Password");
                navigate("/changePassword");
            }
        }else{
            navigate("/");
        }
        
        console.log(result);
       }

    return (
    <div className="profile">
        <section className="profilepart1">
            <div>
                <img 
                src={require("../human.jpg")}
                alt="profile"
                className="profilePic"
                />
            </div>
            <div className='usergrey'>
                <p>{user.name.toUpperCase()}</p>
                <p>{user.email}</p>
                <p>{user.mob}</p>
            </div>
            <div>
                {/* <img 
                    src={require("../credit.png")}
                    className='cardImg'
                /> */}
                <PaymentForm />
            </div>
        </section>
        <section className='profilepart2'>
            <div >
                <div className='part2container '>
                    <div className='balance hoverblue'>
                        <p className='balgrey'>Balance</p>
                        <p className='balSmb'><span >{FaRupeeSign()}</span>{userbal.balance}</p>
                    </div>
                    <div className='graph hovergreen'>
                        <p>Expenditure</p>

                        <Doughnut data={data} />

                    </div>
                </div>
            </div>
            <div className="history ">
                <div className='sticky'>
                    <p className='historygrey'>History</p>
                    <table>
                        <ul>
                            <li>Date</li>
                            <li>Send</li>
                            <li>Recieved</li>
                        </ul>
                    </table>
                </div>
                <div className='histroyOverflow'>
                    {
                        len>0? userbal.date.map(function(item,index){
                            if(index<100){
                            return (
                                <table>
                                    <ul key={item._id}>
                                        <li>{item}</li>
                                        <li>{userbal.send[index]}</li>
                                        <li>{userbal.received[index]}</li>
                                
                                    </ul>
                                </table>
                            );
                            }
                            {/* return <h1 className="click">Click here </h1>; */}
                        }).reverse()
                        :
                        <div>
                        <h1>No data found</h1>
                        </div>
                    }
                </div>
                    
            </div>
        </section>
    </div>)
}

export default  Profile;