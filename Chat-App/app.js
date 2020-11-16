// REQUIRE MODULES
// ===============
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var cors = require("cors");
const hbs = require('hbs')
var socketio = require("socket.io");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require('path')

const viewsPath = path.join(__dirname, '/views')
// BASIC SETTINGS
// ==============
app.use("/", express.static(__dirname + "/views"));
app.set("view engine", "hbs");
app.set('views', viewsPath)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/chat-app-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    
})
var currentUser = "";
// WORKING WITH SOCKETS
var count = 0;
io.on("connection", (socket) => {
  
  console.log("NEW SOCKET CONNECTION");

  socket.emit("message", "WELCOME TO Vartalap");

  
  socket.broadcast.emit("message", "Someone has joined");

  socket.on("message", (message) => {
    io.emit("store", message);
  });


  socket.on("disconnect", () => {
    io.emit("message", "Someone has left the chat");
  });
  
});

var usersRoute = require('./routes/users');
app.use('/routes',usersRoute);

app.get("/", (req, res) => {
  res.render("home.hbs");
});

app.get("/chat", (req,res)=>{
  res.render("chat.hbs");
});

app.get('/signin', (req, res) => {
  res.render('signin.hbs')
})

app.get('/signup', (req, res) => {
  res.render('signup.hbs')
})



// LISTENING TO SERVER
// ===================
var port = process.env.PORT || 3000;
server.listen(3000, function () {
  console.log("SERVER RUNNING ON PORT " + port);
});
