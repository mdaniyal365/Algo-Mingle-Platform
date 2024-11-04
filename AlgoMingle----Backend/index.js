const app = require("./app");
require("dotenv").config();
const axios = require("axios");
const { Server } = require("socket.io");
const io = new Server(5001, {
  cors: true,
});
const roomIdToSocketsMap = new Map();
const socketIdToRoomMap = new Map();
const tempDataForCdoingMapUsingRoomId = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected ", socket.id);

  socket.on("interview_init", (payload) => {
    const { roomId , name } = payload;
    //console.log("Got a init request from " , user);
    if(roomIdToSocketsMap.has(roomId) && roomIdToSocketsMap.get(roomId).length === 2){
        io.to(socket.id).emit("401-restricted" , {message : "At max only two members can join in interview"});
    }else{
        if (!roomIdToSocketsMap.has(roomId)) {
            roomIdToSocketsMap.set(roomId, []);
        }
        roomIdToSocketsMap.get(roomId).push(socket.id);
        socketIdToRoomMap.set(socket.id, roomId);
        io.to(roomId).emit("user:joined", { message: "User has joined" , id : socket.id });
        socket.join(roomId);
        console.log("New User joined the Room", roomIdToSocketsMap);
        if(roomIdToSocketsMap.get(roomId).length === 2){
            io.to(roomIdToSocketsMap.get(roomId)[0]).emit("start_the_connection_process" , {oponentSocketId : roomIdToSocketsMap.get(roomId)[1] , name});
        }
    }
    
  });

  socket.on("loadCodingArea" , ({from , roomId , language , code}) => {
    console.log("loadCodingArea"  + from  + " " + roomId + " " + language + " " + code);
      if(tempDataForCdoingMapUsingRoomId.has(roomId)){
        io.to(from).emit("editorSync" , {
          language : tempDataForCdoingMapUsingRoomId.get(roomId).language,
          code : tempDataForCdoingMapUsingRoomId.get(roomId).code
        })
        io.to(from).emit("textSync", tempDataForCdoingMapUsingRoomId.get(roomId).text);
      }else{
        tempDataForCdoingMapUsingRoomId.set(roomId , {
          language,
          code,
          
        })
      }
  })

  socket.on("run_code:frontend" , async (payload) => {
    console.log("...." , payload.code);
    const options = {
      method: 'POST',
      url: 'https://online-code-compiler.p.rapidapi.com/v1/',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'dfe33a5c73msh4ef4a986a311d16p1c8564jsn2202c55be28c',
        'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
      },
      data: {
        language: payload.language === "python" ? "python3" : payload.language,
        version: 'latest',
        code: payload.code,
        input: null
      }
    };

    try {
      const response = await axios.request(options);
      //console.log(response.data);
      io.to(payload.roomId).emit("code_output" , {output : response.data.output})
    } catch (error) {
      io.to(payload.roomId).emit("code_output" , {output : "Compiler Error"})
    }
  })


  socket.on("editorSync" , (payload) => {
    console.log(payload);
    const roomId = socketIdToRoomMap.get(payload.to);
    tempDataForCdoingMapUsingRoomId.set(roomId , {
      ... tempDataForCdoingMapUsingRoomId.get(roomId),
      language : payload.language,
      code : payload.code
     })
    io.to(payload.to).emit("editorSync" , payload);
  })

  socket.on("textSync" , ({to , text}) => {
    console.log("Text Recieved from  " + to + " " + text);
    const roomId = socketIdToRoomMap.get(to);
    tempDataForCdoingMapUsingRoomId.set(roomId , {
      ... tempDataForCdoingMapUsingRoomId.get(roomId),
      text
     })
    io.to(to).emit("textSync" , text);
  })

  socket.on("incomming_call" , ({to , offer}) => {
    //console.log("Call Recieved from " , to);
    io.to(to).emit("incomming_call" , {from : socket.id , offer});
  })

  socket.on("call:accepted" , ({to , ans}) => {
    io.to(to).emit("call:accepted" , {from : socket.id , ans});
  })

  socket.on("peer:nego:needed", ({ to, offer }) => {
    //console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed_server", { from: socket.id, offer });
  });

  socket.on("share-data" , (payload) => {
    const {roomId} = payload;
    io.to(roomId).emit("share_streams" , {});
  })

  socket.on("peer:nego:done", ({ to, ans }) => {
    //console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final_server", { from: socket.id, ans });
  });


  socket.on("disconnect", () => {
    if (socketIdToRoomMap.has(socket.id)) {
      const roomId = socketIdToRoomMap.get(socket.id);
      if (roomIdToSocketsMap.has(roomId)) {
        const temp = roomIdToSocketsMap.get(roomId);
        console.log("Disconnected user socket id" , socket.id);
        console.log("This is the array " , temp);
        const newArray = temp.filter((ele) => 
          ele != socket.id
        );
        io.to(roomId).emit("user:disconnected" , {});
        console.log("This is the final Array" , newArray);
        roomIdToSocketsMap.set(roomId, newArray);
        socketIdToRoomMap.delete(socket.id);
      }
    }
    console.log("User disconnected ", roomIdToSocketsMap);
  });

  socket.on("call:accepted" , ({to , ans}) => {
    //console.log("Call is accepted bro");
    io.to(to).emit("server:call_accepted",{from : socket.id , ans});
  })

  socket.on("user:call" , ({to , offer}) => {
    //console.log("Got a Call bro .... lawde " , to);
    io.to(to).emit("incommming:call" , {from : socket.id , offer});
  })

  socket.on("send_stream_please" , ({to}) => {
    io.to(to).emit("send_streams_server" , {from : socket.id});
  })
});


app.listen(5000, () => {
  console.log(`Server is Running at 5000 and WS on 5001`);
});
