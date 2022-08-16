const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5500", "https://elitebarcode.ngrok.io"]
    }
})

// Websocket Roadmap
// 1. Establish Server with server name
// 2. Setup Session
// 3. Save Data?
//  3.1 iOS -> Localstorage
//  3.2 Web -> Localstorage
//  3.3 Server -> list????
// 4. Export to CSV Function

const establishedServers = [];



io.on("connection", async function(socket){
    console.log(socket.id);

    socket.on("establishServer", async (serverName) => {
        console.log("[+] Establish server with server name " + String(serverName).toString());
        // establishedServers.push(serverName);
        // console.log(establishedServers);
        if(!establishedServers.includes(serverName)){
            socket.join(serverName);
            // establishedServers.push(serverName);
            await new Promise(resolve => setTimeout(resolve, 5000));
            io.emit("server-created", "server-created-200");
        } else {
            io.emit("server-create-failed", `${serverName} already exists in the database`);
        }
    })

    socket.on("joinServer", (serverName) => {
        if(establishedServers.includes(serverName)){
            socket.join(serverName);
            io.emit("server-joined", "server-joined-200");
        } else {
            io.emit("server-join-error", "server-not-found");
        }
    })

    socket.on("serialNumber", (serialNumber) => {
        console.log("[+] Recieved serial number from ios device - " + String(serialNumber).toString())
        io.emit("serial-number-recieved", String(serialNumber).toString())
    })
})