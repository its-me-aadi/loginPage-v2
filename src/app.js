const express= require("express");
const bodyParser=require("body-parser");
const mongoose= require("mongoose");
const _ = require("lodash");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static('public'));

const DB='mongodb+srv://itsadityasharma7124:Jaishreeram123@cluster0.rgyn6el.mongodb.net/loginPage-v2?retryWrites=true&w=majority'

mongoose.set('strictQuery',false);
mongoose.connect(DB,function(err){
    if(!err){
        console.log("succcessfully connected");
    }
    else{
        console.log(err);
    }
});

const loginCredentialsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:[6,console.log("chota username")]
    },
    mail:{
        type:String,
        required:true,
        min:[6,console.log("nakli mail")]
    },
    password:{
        type:String,
        required:true,
        min:[6,"small password"]
    }
});

const loginCredentials=mongoose.model('loginCredentials',loginCredentialsSchema);

app.get("/",function(req,res){
    res.render("index");

});

app.post("/",function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    let foundEmail=0;
    console.log(req.body.email);
    console.log(req.body.password);
    loginCredentials.find({},function(err,lists){
        if(!err){
            lists.forEach(function(list){
                    if(list.mail==email){
                        console.log(list);
                        foundEmail=1;
                        if(list.password==password){
                            console.log("user found");
                            res.redirect("/home")
                        }
                        else{
                            console.log("incorrect password");
                            res.redirect("/");
                        }
                    }
            });
            if(foundEmail==0){
                console.log("email not registered with us please signup first");
                res.redirect("/");
            }
            
        }
            else{
                console.log("chla ja");
                console.log(err);
            }
    });
});
app.get("/sign-up",function(req,res){  
    res.render("signup");
});

app.post("/sign-up",function(req,res){
    const newUserName=req.body.newUserName;
    const newmail=req.body.newEmail;
    const newpassword=req.body.newpassword;
    const confirmPassword=req.body.confirmPassword;
    const foundEmail=0;
    loginCredentials.findOne({mail:newmail},function(err,lists){
        if(!err){
            // lists.forEach(function(list){
                    if(lists){
                        console.log("email already in use");
                        console.log(lists);
                    //     foundEmail=1;
                        res.redirect("/");
                    }
                    else{
                        if(newpassword.length!=0 && newUserName.length!=0 && newmail.length!=0 ){
                            if(newpassword==confirmPassword){
                                const newUserDetails= new loginCredentials({
                                name:newUserName,
                                mail:newmail,
                                password:newpassword
                                });
                                newUserDetails.save();
                                console.log("new user detected");
                                res.redirect("/");
                        }
                    else if(newpassword!=confirmPassword){
                                console.log("incorrect password");
                                res.redirect("/sign-up");
                            }
                    else if(newpassword.length!=0 || newUserName.length!=0 || newmail.length!=0){
                        if(newpassword.length==0 || confirmPassword.length==0){
                                console.log("password daal");
                            }
                        else if(newUserName.length==0){
                                console.log("name daal");
                        }
                        else{
                                console.log("email daal");
                        }
                        }
                    }
                    }
                }
                else{
                    console.log(err);
                    }
        });
            
    });
            
    
app.get("/home",function(req,res){
    res.send("chutiya banaya tumko");
});

app.listen(3000,function(){
    console.log("server started at 3000");
});