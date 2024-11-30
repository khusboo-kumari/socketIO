//  Run by npx nodemon app.js  

const express = require("express") ; 
const app = express() ; 
const path = require("path") ;

//   SOCKET IO runs on http server 
const http = require("http") ; 
const socketio = require("socket.io") ; 
const server = http.createServer(app) ; 
const io = socketio(server) ;  // Now, the server is running in socket.io 

//  Now lets set up the ejs and the public folder files as well . 
app.set("view engine", "ejs") ; 
app.set("views", path.join(__dirname, "views")) ; 
app.use(express.static(path.join(__dirname, "public"))) ; 

//  Now, we will create a socket connection and listen for events. 

io.on("connection", function(socket){
   console.log("connected see yei yaa ", socket.id) ; 
   socket.on("send-location", function(data){
      console.log("Broadcasting locationnnnnnn:", { id: socket.id, ...data });
      io.emit("recieve-location", {id:socket.id, ...data}) ;
   }) ;
   socket.on("disconnect", function(){
      io.emit("user-disconnect", socket.id) ; 
   })
})


app.get("/", function(req, res){ 
   // res.send("hallo") ;    
   res.render("index") ;
}) ; 

// app.listen(3000) ;    
// server.listen(3000) ; 
server.listen(3000, function () {
   console.log("Server is running on http://localhost:3000");
});

