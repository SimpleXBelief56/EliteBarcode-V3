const io = require("socket.io")(3000, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5500"]
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


io.on("connection", function(socket){
    console.log(socket.id);

    socket.on("establishServer", (serverName) => {
        console.log("[+] Establish server with server name " + String(serverName).toString());
        // establishedServers.push(serverName);
        // console.log(establishedServers);
        if(!establishedServers.includes(serverName)){
            io.emit("server-created", "server-created-200")
        } else {
            io.emit("server-create-failed", `${serverName} already exists in the database`);
        }
    })
})