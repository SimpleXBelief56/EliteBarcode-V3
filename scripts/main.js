import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

function wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    var status = document.querySelector(".loaderStatus");

    changeStatus("Connecting To Server");
    await wait(5000);

    const socket = io("https://elitebarcodeserver.ngrok.io", websocketConnection);

    socket.on("connect_error", function(){
        // Connection Failed
        $(".loader").animate({opacity: 0}, 400);
        changeStatus("Connection Failed");
        setTimeout(function(){
            window.location.href = "/"
        }, 1200);
        return;
    })
    
    socket.on("connect", function(){
        console.log(`Connected to server with ID ${socket.id}`)
        changeStatus("Establishing Container");
        socket.emit("establishServer", String(serverName).toString(), (response) => {
            console.log("Message send to the server");
        })
    })

    socket.on("server-created", async (response) => {
        console.log("[+] Server established successfully on the server side");
        changeStatus("Container Established");
        await wait(2500);
        changeStatus("Configuring Container");
        var containerName = document.querySelector(".containerName");
        containerName.innerHTML = getServerName();
        await wait(2500);
        changeStatus("Configuration Complete");
        await wait(2500);
        $(".loader").animate({opacity: 0}, 400).promise().done(function(){
            $(".loaderStatus").animate({opacity: 0}, 400).promise().done(function(){
                $(".loaderView").animate({opacity: 0}, 800).promise().done(function(){
                    document.querySelector(".loaderView").style.visibility = "hidden";
                });
            })
        })
        
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
    var tableHandler = document.querySelector(".dataSection");
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

    serialNumber.innerHTML = format(serialNumberParam);
    manufacturer.innerHTML = String(manufacturerField).toString().charAt(0).toUpperCase() + String(manufacturerField).toString().slice(1);
    model.innerHTML = modelField;
    fundingSource.innerHTML = fundingSourceField;
    
}

function format(serialNumber){
    var checkboxes = document.querySelectorAll("#flexSwitchCheckChecked");
    var removeEightCharacters = checkboxes[0].checked;
    var removeFirstCharacter = checkboxes[1].checked;

    if(removeEightCharacters){
        serialNumber = String(serialNumber).toString().substring(0, 7);   
    }
    if(removeFirstCharacter){
        serialNumber = String(serialNumber).toString().slice(1);
    }

    return serialNumber;
}

function getServerName(){
    var searchParams = window.location.search;
    var urlParams = new URLSearchParams(searchParams);
    return String(urlParams.get("serverName")).toString();
}

function exportToCSV(){
    TableExport(document.querySelector(".tableHandler"), {
        filename: "EliteBarcodeV2-Exports",
        sheetname: getServerName()
    })
}

function changeStatus(next){
    if(document.querySelector(".loaderStatus").innerHTML !== next){
        $(".loaderStatus").animate({opacity: 0}, 400).promise().done(function(){
            document.querySelector(".loaderStatus").innerHTML = next;
            $(".loaderStatus").animate({opacity: 1}, 400);
        })
    }
}

