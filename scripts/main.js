import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

if(window.location.pathname == "/" || window.location.pathname == "index.html"){
    var formHandler = document.querySelector(".formHandler");
    var serverNameFieldHandler = document.querySelector(".serverID");

    formHandler.onsubmit = function(submitHandler){
        console.log("submit event listener callback")
        submitHandler.preventDefault();
        
        if(serverNameFieldHandler.value != "" || serverNameFieldHandler.value != undefined){
            // Redirect to the client folder with URL parameters
            var clientPath = `${window.location.protocol}//${window.location.host}/client/`
            var clientURL = new URL(clientPath);
            clientURL.searchParams.set("serverName", serverNameFieldHandler.value);
            console.log(clientURL.toString());
            window.location.replace(clientURL)
        } else {
            alert("ServerID Cannot Be Empty Or NULL")
            return false;
        }
        
    }
} else {
    var websocketConnection = {
        "transports": ["websocket"]
    }
    
    
    
    // $(document).ready(function(){
    //     $(".submitButton").click(function(){
    //         const socket = io("http://localhost:3000", websocketConnection);
    //     })
    // })
    var serverName = window.location.search.split("=")[1];

    const socket = io("http://localhost:3000", websocketConnection);
    
    socket.on("connect", function(){
        console.log(`Connected to server with ID ${socket.id}`)
        socket.emit("establishServer", String(serverName).toString(), (response) => {
            console.log("Message send to the server");
        })
    })

    socket.on("server-created", (response) => {
        console.log("[+] Server established successfully on the server side");
    })

    socket.on("server-create-failed", (errorMessage) => {
        alert(errorMessage)
    })
    socket.on("serial-number-recieved", (serialNumber) => {
        console.log("Serial Number Recieved: " + String(serialNumber).toString());
        appendTableData(String(serialNumber).toString());
    })

    
}


function appendTableData(serialNumberParam){
    var tableHandler = document.querySelector(".tableHandler");
    var row = tableHandler.insertRow(-1);

    // var manufacturerField = document.querySelector(".manufacturerField").value;
    // var modelField = document.querySelector(".modelField").value;
    // var fundingSourceField = document.querySelector(".fundSourceField").value;

    var manufacturerField = (document.querySelector(".manufacturerField").value == "") ? "N/A" : document.querySelector(".manufacturerField").value;
    var modelField = (document.querySelector(".modelField").value == "") ? "N/A" : document.querySelector(".modelField").value;
    var fundingSourceField = (document.querySelector(".fundSourceField").value == "") ? "N/A" : document.querySelector(".fundSourceField").value;

    // Table Properties
    var serialNumber = row.insertCell(-1);
    var manufacturer = row.insertCell(-1);
    var model = row.insertCell(-1);
    var fundingSource = row.insertCell(-1);

    serialNumber.innerHTML = String(serialNumberParam).toString();
    manufacturer.innerHTML = manufacturerField;
    model.innerHTML = modelField;
    fundingSource.innerHTML = fundingSourceField;
    
}

