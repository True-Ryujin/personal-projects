const express = require("express");
const socket = require('socket.io');
const ejs = require("ejs");
const http = require('http');




const app = express();
const server = http.createServer(app);
const io = socket(server);
const mongo=require("mongoose");
const { timeStamp } = require("console");
mongo.connect("mongodb+srv://admin:cpCg3jY8MPnlV2Yl@cluster0.cyp1fs8.mongodb.net/iot?retryWrites=true&w=majority&appName=Cluster0/iot");

app.set('view engine', 'ejs');

app.use(express.static("public"));

const gas = new mongo.Schema({value:Number,timeStamp:Date},{ collection: 'gaz' });
const humidity = new mongo.Schema({value:Number,timeStamp:Date},{ collection: 'humidity' });
const temperature = new mongo.Schema({value:Number,timeStamp:Date},{ collection: 'temperature' });
const movement = new mongo.Schema({timeStamp:Date},{ collection: 'movement' });

const G = mongo.model('gaz', gas);
const H = mongo.model('humidity', humidity);
const T = mongo.model('temperature', temperature);
const M = mongo.model('movement', movement);



const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);



const userSchema = new mongo.Schema({username: String,email: String,password: String,});


const User = mongo.model('User', userSchema);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/signup', async (req, res) => {
  try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email, password });
      await newUser.save();
      res.redirect('/');
  } catch (err) {
      console.error(err);
      res.status(500).send("Error registering user.");
  }
});
app.post('/login',async(req,res)=>{
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.findOne({ email });
    if (user && password==user.password) {
      res.redirect("/dashboard");
    }
    else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
  }
});

app.get('/', (req, res) => {
  res.render('login');
});
app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get("/dashboard",async function(req,res){
  try {
    const Gdata = await G.findOne().sort({ timestamp: -1 }).lean();
    const Hdata = await H.findOne().sort({ timestamp: -1 }).lean();
    const Tdata = await T.findOne().sort({ timestamp: -1 }).lean();
    const Mdata = await M.findOne().sort({ timestamp: -1 }).lean();
    res.render("index",{G:Gdata,H:Hdata,T:Tdata,M:Mdata});
  } catch (err) {
    console.log(err);
    res.status(500).send("Error occurred while retrieving values");
  }  
})
app.get("/temperature",async function(req,res){
    try {
      const Tdata = await T.find({timestamp: {$gte: today,$lt: tomorrow}}).sort({ timestamp: 1 });
      res.render("temperature",{Tdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  app.get("/humidity",async function(req,res){
    try {
      const Hdata = await H.find({timestamp: {$gte: today,$lt: tomorrow}}).sort({ timestamp: 1 });
      res.render("humidity",{Hdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  app.get("/gas",async function(req,res){
    try {
      const Gdata = await G.find({timestamp: {$gte: today,$lt: tomorrow}}).sort({ timestamp: 1 });
      res.render("gas",{Gdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  app.get("/temperature_history",async function(req,res){
    try {
        const Tdata = await T.find().sort({ timestamp: -1 }).lean();
        res.render("temperature_history",{Tdata:Tdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  app.get("/humidity_history",async function(req,res){
    try {
      const Hdata = await H.find().sort({ timestamp: -1 }).lean();
        res.render("humidity_history",{Hdata:Hdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  app.get("/gas_history",async function(req,res){
    try {
      const Gdata = await G.find().sort({ timestamp: -1 }).lean();
        res.render("gas_history",{Gdata:Gdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  app.get("/movement_history",async function(req,res){
    try {
        const Mdata = await M.find().sort({ timestamp: -1 }).lean();
        res.render("movement_history",{Mdata:Mdata});
    } catch (err) {
      console.log(err);
      res.status(500).send("Error occurred while retrieving values");
    }  
  })
  

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
