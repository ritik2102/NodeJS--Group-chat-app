const express=require("express");
const app=express();
const fs=require("fs");

const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

// login route
app.get("/login",(req,res,next)=>{

    // form redirects to the save user post
    res.send(
        '<form action="/" method="POST"><input type="text" name="username" placeholder="username"><button type="submit">Submit</button></form>'
    );
});

// home-page
app.get("/",(req,res,next)=>{
    let chats;
    fs.readFile('chats.txt','utf8',(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            chats=data;
        }
        // form redirects to the save chat post
        res.send(
            `<h2>${chats}</h2><br><form action="/chat-save" method="POST"><input type="text" name="chat" placeholder="enter chat"><button type="submit">Submit</button></form>`
        );
    });
    
})

// saves the user and redirects to the home route
app.post("/",(req,res,next)=>{
    const username=req.body.username;
    localStorage.setItem("username",username);
    res.redirect("/")
});

// saves the chat and redirects to the home route
app.post("/chat-save",(req,res,next)=>{
    const chat=req.body.chat;
    fs.appendFile('chats.txt',`${localStorage.getItem("username")} : ${chat}  ---- `,err=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
})

app.listen(3000);