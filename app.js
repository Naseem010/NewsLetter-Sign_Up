const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
})

app.post("/",function(req,res){
const firstName=req.body.fName;
const lastName=req.body.lName;
const email=req.body.email;
const data={   //(body parameter)
  members:[      //array of an object each represent an email_address and the subscroption status
  {
    email_address:email,
    status:"subscribed",
    merge_fields:{
      FNAME:firstName,
      LNAME:lastName,
    }
  }
]
};
const jsondata=JSON.stringify(data);
// https.get(url,function(){  //from this we are getting data from external sources but here i want to post data to external sources
//
// })
const url="https://us13.api.mailchimp.com/3.0/lists/11d8b18149";//it will save subscription data into list of list id 11d8b18149
const option={
  method:"POST",
  auth:"faheem:fd8cb1985d89d90eceac56e0c64d49f8-us13",
}
const request=https.request(url,option,function(response){ //it will request external server to store email data
if(response.statusCode===200){
  res.sendFile(__dirname+"/success.html");
}
else{
  res.sendFile(__dirname+"/failure.html");
}
  response.on("data",function(data){
    console.log(JSON.parse(data));
  });
});
request.write(jsondata);
request.end();
});

app.post("/failure",function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT ||3000,function(){
  console.log("server is running on port 3000");
});

//audience id  11d8b18149
//api key fd8cb1985d89d90eceac56e0c64d49f8-us13
