const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
require("./dbConn/config");
const User = require('./dbConn/User');
const UserAmount = require('./dbConn/UserAmount');
const UserBeneficiary = require('./dbConn/UserBeneficiary');
const Jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());

const jwtKey = "restKeyRitesh";

app.post("/register",async function(req, res){
    
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hash,
        addcard:req.body.addcard,
        pan:req.body.pan,
        mob:req.body.mob,
        dob:req.body.dob,
        profilePassword:req.body.proilePass
    });

    let result = await user.save();
    result = result.toObject();
    
    // console.log(user.getTime());
    const createdAt = new Date(user.createdAt);
    console.log('Account created on:', createdAt.toLocaleDateString());

    delete result.password;
    let userAmount = new UserAmount({
        userId:result._id.toString(),
        balance:1000,
        date:[getDate()],
        received:[1000],
        send:[0]
    });
    let amount = await userAmount.save();
    // console.log(amount);

    let userBen = new UserBeneficiary({
        userId:result._id.toString(),
        detail:[]
    });
    let userb = await userBen.save();

    Jwt.sign({result},jwtKey,{expiresIn:"1h"},(err,token)=>{
        if(err) {
            console.log(err);
            res.send({result:"Something Went wrong!"});
        }
        res.send({result,auth:token}); 
    });
});

app.post("/login",async function(req, res){
    if(req.body.password && req.body.email){
        // console.log("Ritesh");
        let user = await User.findOne({email:req.body.email});
        // console.log(user.password);
        if(user){
            // console.log(bcrypt.compareSync(req.body.password, user.password));
            if(bcrypt.compareSync(req.body.password, user.password)){
                console.log("Click1");
                Jwt.sign({user},jwtKey,{expiresIn:"1h"},(err,token)=>{
                    if(err) {
                        res.send({result:"Something Went wrong!"});
                    }
                    user = user.toObject();
                    delete user.password;
                    // console.log("Click");
                    res.send({user,auth:token}); 
                });
            }else{
                console.log("Something went wrong");
                res.send({result:"Wrong Password"});
            }
        }else{
             console.log("Click");
            res.send({result:"No user Found"});
        }
    }else{
        res.send({result:"No user Found"});
    }
});

//not in use
app.post("/addAmount/:id", verifyToken ,async function(req,res){
    let id = req.params.id;
    let user = await UserAmount.findOne({userId:id});
    if(user){

        user.balance = Number(user.balance)+Number(req.body.amount);
        user.date.push(getDate());
        user.received.push(req.body.amount);
        user.send.push(0);
        let result = await user.save();
        result = result.toObject();
        console.log(result);
        res.send(result);   
       
    }else{
        res.send({result:"No user Found"});
    }
    
});

app.get("/getDetails/:id",verifyToken, async function(req, res){
    let id = req.params.id;
    let user = await UserAmount.findOne({userId:id});
    if(user){
        user = user.toObject();
        // console.log(user);
        
        res.send(user);   
       
    }else{
        res.send({result:"No user Found"});
    }
});



app.post("/sendAmount/:id",async function(req, res){
    let id=req.params.id;
    let accountNo=req.body.accountNo;
    let password = req.body.password;
    let ans=0;


    let sender = await UserAmount.findOne({userId:id});
    let user = await User.findOne({_id:id});
    console.log("profile Password",user.profilePassword);
    if(sender){
        if(user.profilePassword===password){
            if(sender.balance>=req.body.amount){
                sender.balance = Number(sender.balance)-Number(req.body.amount);
                sender.date.push(getDate());
                sender.received.push(0);
                sender.send.push(Number(req.body.amount));
                let result = await sender.save();
                result = result.toObject();
                // console.log(result);
                ans++;
                  
            }else{
                res.send({result:"Not Sufficient Balnace"});
            }
        }else{
            res.send({result:"Wrong Password"});
        }
    }else{
        res.send({result:"No user Found"});
    }

    let receiver = await UserAmount.findOne({userId:accountNo});
    if(receiver){
        receiver.balance = Number(receiver.balance)+Number(req.body.amount);
        receiver.date.push(getDate());
        receiver.received.push(Number(req.body.amount));
        receiver.send.push(0);
        let result = await receiver.save();
        result = result.toObject();
        // console.log(result);
        ans++;
        // res.send(result);   
    }else{
        res.send({result:"No user Found"});
    }

    if(ans===2){
        res.send({result:"SuccessFull"});
    }else{
        res.send({result:"Failed"});
    }
    
});

app.get("/verifyAccount/:id",verifyToken,async function(req, res) {
    // console.log(req.body);
    let id = req.params.id;
    if(id){
        let user = await UserAmount.findOne({userId:id});
        // console.log(user);
        if(user){
            user = user.toObject();
            // console.log(user);
            res.send({result:true});
        }else{
            console.log("User not found");
            res.send({result:false});
            
        }
    }
});

app.post("/addBeneficiary/:id",verifyToken,async function (req, res) {
    let id = req.params.id;
    let user = await UserBeneficiary.findOne({userId:id});
    if(user){
        const result = user.detail.find(({ account }) => account === req.body.account);
        // console.log("res:: ",result); 
        if(result!==undefined){
            res.send({result:false});
        }else{
            let result = await UserBeneficiary.findOneAndUpdate({userId:id},{ $push: { detail: req.body } } , {
                returnOriginal: false
              });
            result = result.toObject();
            res.send(result);
        }
        
    }

});

app.get("/getBeneficiary/:id",verifyToken,async function (req, res){
    let id = req.params.id;
    let user = await UserBeneficiary.findOne({userId:id});
    if(user){
        user = await user.toObject();
        res.send(user.detail);
    }else{
        res.send({result:false});
    }
});

app.get("/search/:key/:id",verifyToken,async function(req, res){
    let key = req.params.key;
    let id = req.params.id;
    let user = await UserBeneficiary.findOne({userId:id});
    // console.log(user);
    let result = user.detail.filter(function(elm){
        return elm.name.search(key)!==-1;
    })
    // console.log(result);
    user = await user.toObject();
    res.send(result);
});

app.post("/checkUser",async function(req, res) {
    let acc = req.body.account;
    // let password = req.body.newPassword;
    let user = await User.findOne({_id:acc}); 
    if(user){
        user = await user.toObject();
        res.send({result:true,user});
    }else{
        res.send({result:false});
    }
})

app.post("/changePassword/:id",verifyToken,async function(req, res) {
    const user = await User.findOne({_id:req.params.id});
    // console.log(user.password);
    if(user){
        user.createdAt=Date.now();
        let result = await user.save();
        // console.log(result);
    }
    if(bcrypt.compareSync(req.body.password, user.password)){
        const hash = bcrypt.hashSync(req.body.newPassword, saltRounds);
        const doc = await User.findOneAndUpdate({_id:req.params.id},
            {password:hash}, 
            {new: true}
        );
        // console.log(doc);
        res.send({result:true});
    }else{
        res.send({result:false});
    }
});

app.get("/checkPassdate/:id",async function(req,res){
    console.log(req.params.id);
    let days = 1;
    let user = await User.findOne({_id:req.params.id});
    const createdAt = new Date(user.createdAt);

    // console.log('Account created on:', createdAt.toLocaleDateString());
    // console.log(Date.now());
    // console.log((createdAt.getTime() + (30 * 24 * 60 * 60 * 1000))-Date.now());
    // console.log(createdAt.getTime() + (30 * 24 * 60 * 60 * 1000) );

    if(createdAt.getTime() + (days* 12 * 60 * 60 * 1000) <Date.now()){
        console.log("over");
        res.send({result:true});
    }else{
        console.log("Yet To over");
        res.send({result:false});
    }
});


function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if(token) {
        token = token.split(' ')[1];
        Jwt.verify(token,jwtKey,(err,valid)=>{
            if(err){
                res.status(401).send({result:"Please provide valid token"});
            }else{
                next();
            }
        });
    }else{
        res.status(403).send({result:"Please add token with header"});
    }
}

function getDate(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime;
}


app.listen(8000,function(req,res){
    console.log("Server listed on port 8000");
})