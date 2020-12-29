const dotenv = require('dotenv');
const path = require('path');
var http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const port = normalizePort(process.env.PORT || "8089");
dotenv.config();
const app = express();
const router = express.Router();  

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,HEAD, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,token,Accept,Authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', false);
  // Pass to next layer of middleware
  next();
});


// serving the angular project build
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,  'client/build','index.html'));
});

// creating the server
var server = http.createServer(app);

// configuring socket to server
var io = require('socket.io').listen(server,{
	pingInterval:10000,
	pingTimeout:5000,
});

const socketController = require("./controller/socket.controller");

// user connecting to socket
io.sockets.on("connection",function(socket){
	// calling methods of socket operations in socket controller
	socketController.connect(socket,io);
});


server.listen(8089,function(){
	console.log("Server is started");
});


// normalizing the server port
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}