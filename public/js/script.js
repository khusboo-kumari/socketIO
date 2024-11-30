//  Initialise socket.io , because of this connection request goes to backend 

const socket = io() ;   
console.log("check krr haa check krr ") ; 

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) =>{
        const {latitude, longitude} = position.coords ; 
        socket.emit("send-location", {latitude, longitude}) ; 
        console.log("Emitting location:", { latitude, longitude });

        
    },(error)=>{
        console.log(error) ; 
    },{
        //  for map, better accuracy and all  
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0 // doesnt pick cache data 
    }
)
} 

const map = L.map("map").setView([0,0], 16) ; // 10 level Zoom 


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Its Dytto"
}).addTo(map);


const markers = {} ; 

socket.on("recieve-location", (data)=>{
    console.log("Received location:", data);
    const {id, latitude, longitude} = data ; 
    // map.setView([latitude, longitude], 18) ; // means move 16 points  
    map.setView([latitude, longitude]) ; // means move 16 points  

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]) ;
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map) ; 
    }
})


socket.on("user-disconnected", (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id]) ;
        delete  markers[id] ; 
    }
})