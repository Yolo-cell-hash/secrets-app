const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const { body } = require('express-validator');
const mongoose = require('mongoose');
const { stringify } = require('querystring');

const app = express();
app.use(express.json());
app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

  mongoose.connect("mongodb+srv://admin:Special26@cluster0.7a0pm.mongodb.net/secretsDB", {useNewUrlParser: true});

  const secretSchema = new mongoose.Schema( {
    secret : String,
    name: String
    });

  const Secret = new mongoose.model("Secret", secretSchema);

  const secret1 = new Secret({
    secret: "You can read other people's secrets here!",
    name : 'Mike'

  });

 const secret2 = new Secret({
    secret: "You can post a secret annonymusly!",
    name : 'John'
  });

  const defaultSecrets=[secret1, secret2];





app.get('/', function(req,res){
  res.sendFile( __dirname + "/index.html");

 // res.render("confessions", { post : secrets});
});

app.get('/goHome',function(req,res){
  res.sendFile(__dirname + '/index.html');
})

app.get('/login', function(req,res){
  res.sendFile(__dirname  + '/login.html')
})

app.get('/confessions', function(req,res){
  //  res.render("confessions", { post : secrets, entryname:names});

   Secret.find({},function(err, foundSecrets){

    if(foundSecrets.length===0){
      Secret.insertMany(defaultSecrets, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Task completed succeesfully !")
        }
      });
    res.redirect('/confessions')
    }
    else{
      res.render("confessions", { post : foundSecrets, name: foundSecrets });
    }
   })
});

app.post("/", function(req,res){
  var post = req.body.secret;
  var entryname = req.body.username;

  if(post.length===0){
    post= "Null"; 
  }

  if(entryname.length===0){
    entryname="Annonymus";
  }

  const conf = new Secret({
    secret: post,
    name : entryname
   });
   conf.save();

    res.redirect('/confessions');

    res.sendFile(__dirname + '/success.html');

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function(){
  console.log("Server ativated at port successfully");
});
