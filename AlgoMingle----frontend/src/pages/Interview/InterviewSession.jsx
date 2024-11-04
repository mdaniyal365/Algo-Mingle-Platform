import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import SmallHeader from "../../components/SmallHeader";
import IconSwitch from "../../components/IconSwitch";
import GroupRadioButton from "../../components/GroupRadioButton";
import ReactPlayer from "react-player";
import { SyncLoader } from "react-spinners";
import { useSocket } from "../../context/SocketProvider";
import peer from "../../services/peer";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Editor } from "@monaco-editor/react";
import { cStarterCode, cppStarterCode, javaStarterCode, pythonStarterCode, tsStarterCode } from "../../utils/codeEditorInititor";
import OutputDialog from "../../components/OutputDialog";
import axios from "axios";



const InterviewSession = () => {
  const [output , setOutput] = useState("");
  const [runButtonText , setRunButtonText] = useState("Run Code");
  const [languageStarterCode , setLanguageStarterCode] = useState(javaStarterCode)
  const [language , setLanguage] = useState("java");
  const socket = useSocket();
  const [text , setText] = useState("");
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const [videoInteractionBtn, setVideoInteractionBtn] = useState(true);
  const [codeItBtn, setCodeItBtn] = useState(false);
  const [canvasBtn, setCanvasBtn] = useState(false);
  const [remoteStream, setRemoteStream] = useState();
  const [remoteSocketId, setRemoteSocketId] = useState();
  const [myStream, setMyStream] = useState();
  const [showOutput , setShowOutput] = useState(false);
  const editorRef = useRef();
  const user = useSelector((state) => state.user);
  let token = null;


  async function runCode(){
    if(runButtonText === "Executing..."){
      toast.error("Executing already in process...");
      return;
    }
    setRunButtonText("Executing...");
    console.log("Requested ...");
    console.log("Current Code is " , languageStarterCode);
    socket.emit("run_code:frontend", { code : languageStarterCode , language: language , roomId });
  }


  useEffect(() => {
    console.log(language + " ");
  },[language])

  useEffect(() => {
    //console.log("This is working ...");
    if (user.userData === null || user.userData === undefined) {
      toast.error("You are not logged in",{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
      navigate("/");
    } else {
      sendStartInterviewSignalToServer();
    }
  }, []);

  const openCameraAndMic = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    console.log("Camera value is changed ", camera);
  }, [camera]);

  const sendStartInterviewSignalToServer = useCallback(async () => {
    socket.emit("interview_init", { roomId, name: user?.userData?.name });
    
    openCameraAndMic();
    setTimeout(() => {
      socket.emit("loadCodingArea" , {from : socket.id , roomId , language , code : languageStarterCode})  
    }, 1000);
    
  }, [roomId, socket.id , language , languageStarterCode]);

  const startTheProcess = useCallback(
    async ({ oponentSocketId, name }) => {
      console.log(
        "Yup ! I have got reqest to start the connection",
        oponentSocketId
      );
      setRemoteSocketId(oponentSocketId);
      toast.success(`${name} has joined`,{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
      console.log("Oponent Socker id ", oponentSocketId);
      initiateTheCall(oponentSocketId);
    },
    [remoteSocketId]
  );

  const sendStreams = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: mic,
      video: camera,
    });

    console.log("Trying to send the streams ", stream);
    setMyStream(stream);
    for (const track of stream.getTracks()) {
      peer.peer.addTrack(track, stream);
    }
  }, [myStream, mic, camera]);

  useEffect(() => {
    if (myStream !== null && myStream !== undefined) {
      let videoTrack = myStream
        .getTracks()
        .find((track) => track.kind === "video");
      let audioTrack = myStream
        .getTracks()
        .find((track) => track.kind === "audio");
      if (!camera) {
        videoTrack.enabled = false;
      } else {
        videoTrack.enabled = true;
      }
      if (!mic) {
        audioTrack.enabled = false;
      } else {
        audioTrack.enabled = true;
      }
    }
  }, [camera, mic]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteSteam = ev.streams;
      console.log("Got tracks ");
      setRemoteStream(remoteSteam[0]);
    });
  }, []);

  const initiateTheCall = useCallback(async (oponentSocketId) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: oponentSocketId, offer });
  }, []);

  const handleIncommingCall = useCallback(async ({ from, offer }) => {
    console.log("I am getting a call ...");
    setRemoteSocketId(from);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
    socket.emit("call:accepted", { to: from, ans });
    
  }, []);

  const handleCallAccepted = useCallback(
    async ({ from, ans }) => {
      console.log("Yes !!! Call is accepted");
      await peer.setLocalDescription(ans);
      //sendStreams();
      setTimeout(() => {
        sendStreams();
      }, 1000);
      setTimeout(() => {
        socket.emit("send_stream_please", { to: from });
      }, 2000);
    },
    [sendStreams]
  );

  const handleSendStreams = useCallback(() => {
    sendStreams();
  }, []);

  const handleNegoNeededServer = useCallback(async ({ from, offer }) => {
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done", { to: from, ans });
  }, []);

  const handleNegoDone = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleUserDisconnected = useCallback(async () => {
    setRemoteSocketId(null);
    setRemoteStream(null);
    //await peer.reInit();
  }, []);

  const handleUserJoined = useCallback(() => {
    // window.location.reload();
  }, []);

  const sendCodeData = useCallback((e , lang = language) => {
    console.log("Sending values with language as " + language);
    socket.emit("editorSync" , {to : remoteSocketId , language : lang , code : e})
  },[remoteSocketId , language])

  const handleUnableToAcess = useCallback(() => {
    toast.error("At max 2 persons can only join",{
      style: {
          borderRadius: '10px',
          background: '#563F15',
          color: '#FFCE6D',
      },
    });
    navigate("/");
  }, []);

  const handleIncommingCodeSync = useCallback(({language , code}) => {
    console.log("Code is comming " + language + " " + code)
    setLanguage(language);
    setLanguageStarterCode(code);
  },[])

  const textSync = useCallback((e) => {
    socket.emit("textSync" , {to : remoteSocketId , text : e.target.value})
  },[remoteSocketId])

  const handleIncommingTextSync = useCallback((text) => {
    console.log("Text Comming " , text);
    setText(text);
  },[])


  const handleInCommingOutput = ({output}) => {
    setRunButtonText("Run Code")
    setShowOutput(!showOutput);
    setOutput(output);
    
  }

  useEffect(() => {
    socket.on("start_the_connection_process", startTheProcess);
    socket.on("incommming:call", handleIncommingCall);
    socket.on("server:call_accepted", handleCallAccepted);
    socket.on("send_streams_server", handleSendStreams);
    socket.on("peer:nego:needed_server", handleNegoNeededServer);
    socket.on("peer:nego:final_server", handleNegoDone);
    socket.on("user:disconnected", handleUserDisconnected);
    socket.on("user:joined", handleUserJoined);
    socket.on("401-restricted", handleUnableToAcess);
    socket.on("editorSync" , handleIncommingCodeSync);
    socket.on("textSync" , handleIncommingTextSync);
    socket.on("code_output" , handleInCommingOutput);

    return () => {
      socket.off("code_output" , handleInCommingOutput);
      socket.off("textSync" , handleIncommingTextSync)
      socket.off("editorSync" , handleIncommingCodeSync)
      socket.off("start_the_connection_process", startTheProcess);
      socket.off("incommming:call", handleIncommingCall);
      socket.off("user:joined", handleUserJoined);
      socket.off("send_streams_server", handleSendStreams);
      socket.off("server:call_accepted", handleCallAccepted);
      socket.off("peer:nego:needed_server", handleNegoNeededServer);
      socket.off("peer:nego:final_server", handleNegoDone);
      socket.off("user:disconnected", handleUserDisconnected);
      socket.off("401-restricted", handleUnableToAcess);
    };
  }, [
    socket,
    startTheProcess,
    handleCallAccepted,
    handleIncommingCall,
    handleUserJoined,
  ]);

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  function closeOutput(){
    setShowOutput(false);
  }


  return (
    <>
      <div className="h-screen flex flex-col w-full">
        <SmallHeader heading="" height="70px" />
        <div className="h-[100%] flex-col flex  w-full bg-[url('/wal/wal1.png')]">
          <GroupRadioButton
            first={videoInteractionBtn}
            second={codeItBtn}
            third={canvasBtn}
            setFirst={setVideoInteractionBtn}
            setSecond={setCodeItBtn}
            setThird={setCanvasBtn}
          />
          {/* Starts here */}
          <div
            className={`${
              videoInteractionBtn ? "h-[100%]" : "h-[0px] hidden"
            }  overflow-hidden  py-2 max-h-[700px] mb-[70px] mt-[10px]  w-full flex justify-center items-end   transition-all duration-1000`}
          >
            <div
              className={`w-[700px] h-[100%] transition-all duration-1000 flex  justify-center items-center rounded-3xl  bg-[#2c2c2c]  
            ${videoInteractionBtn ? "ring-4" : ""}
             ring-[#563F15] overflow-hidden`}
            >
              {!remoteSocketId ? (
                <p className="text-white font-semibold">Video is unavailable</p>
              ) : remoteStream == null ? (
                <SyncLoader color="#FBCB6B" />
              ) : (
                <ReactPlayer
                  playing
                  height={"100%"}
                  width={"100%"}
                  url={remoteStream}
                />
              )}
            </div>
            <div
              className={`w-[200px] ml-4 h-[100%] max-h-[150px] border-2  flex justify-center items-center rounded-2xl  bg-[#2c2c2c] ${
                videoInteractionBtn ? "ring-1" : "border-none"
              } ring-[#563F15] overflow-hidden  `}
            >
              {!camera ? (
                <p className="text-white font-semibold">Camera is off</p>
              ) : myStream == null ? (
                <SyncLoader color="#FBCB6B" />
              ) : (
                <ReactPlayer
                  playing
                  height={"100%"}
                  width={"100%"}
                  url={myStream}
                  muted
                />
              )}
            </div>
          </div>
          {/* // Ends here : */}
          <div
            className={`${
              codeItBtn ? "h-[100%]" : "h-[0px] hidden"
            }  overflow-hidden  py-2 max-h-[700px] mb-[70px] mt-[10px]  w-full flex justify-center items-end   transition-all duration-1000`}
          >
            <div className=" w-[100%] h-[100%] flex  ">
              <div className="w-[50%] h-[100%]  p-2">
                <textarea  value={text} className=" outline-dashed h-[100%] w-[100%] bg-transparent"
                onChange={(e) => {
                  setText(e.target.value)
                  textSync(e);
                }} ></textarea>
              </div>
              <div className="w-[50%] h-[100%]  p-2">
                <select name="Language" value={language} onChange={(e) => {
                  const curValue = e.target.value;
                  if(curValue === "c"){
                    setLanguageStarterCode(cStarterCode);
                    setLanguage("c");
                    sendCodeData(cStarterCode , "c")
                  }else if(curValue === "cpp"){
                    setLanguageStarterCode(cppStarterCode);
                    setLanguage("cpp")
                    sendCodeData(cppStarterCode , "cpp")
                  }else if(curValue === "java"){
                    setLanguageStarterCode(javaStarterCode);
                    setLanguage("java")
                    sendCodeData(javaStarterCode , "java")
                  }else if(curValue === "python"){
                    setLanguage("python")
                    setLanguageStarterCode(pythonStarterCode);
                    sendCodeData(pythonStarterCode , "python")
                  }else{
                    
                    setLanguage("typescript");
                    setLanguageStarterCode(tsStarterCode);
                    sendCodeData(tsStarterCode , "typescript")
                  }
                }} id="language"  className=" rounded-md ring-2 ring-[#563F15]">
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="java" selected>Java JDK 8</option>
                  {/* <option value="typescript">TypeScript</option> */}
                  <option value="python">Python</option>
                </select>
              <Editor  height={"95%"} width={"100%"} language={language} value={languageStarterCode} ref={editorRef} onChange={(e) => {
                sendCodeData(e);
                setLanguageStarterCode(e);
                // setLanguageStarterCode()
              }} theme="" className="mt-2 rounded-md ring-4 ring-[#FFCE6D]" />
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
      <div className="fixed bottom-3 left-0 right-0 w-full flex justify-center items-center h-[50px] ">
        <div className="p-4 h-full rounded-xl bg-[#FFCE6D] shadow-[#563F15] shadow-sm hover:shadow-md hover:shadow-[#563F15]  duration-500 transition-all flex justify-center items-center">
          <IconSwitch
            enable={camera}
            className={"mx-2"}
            onClick={(e) => {
              console.log("frf");
              setCamera((prev) => !prev);
            }}
            onImage={"/interview/camera_on.png"}
            offImage={"/interview/camera_off.png"}
          />
          <IconSwitch
            enable={mic}
            className={"mx-2"}
            onClick={(e) => {
              console.log("frf");
              setMic((prev) => !prev);
            }}
            onImage={"/interview/mic_on.png"}
            offImage={"/interview/min_off.png"}
          />
        </div>

        <div className={`${!codeItBtn && "hidden"} ml-10 text-[#ED5B2D] font-bold p-4 h-full rounded-xl bg-[#FFCE6D] shadow-[#563F15] shadow-sm hover:shadow-md hover:shadow-[#563F15]  duration-500 transition-all flex justify-center items-center`} onClick={(e)=>{
          runCode();
        }}>
          {runButtonText}
        </div>
        
        
      </div>
      <div
        className={`${
          !videoInteractionBtn ? "h-[150px] ring-4" : "h-[0px]"
        } w-[200px]  transition-all mr-2 mt-2 rounded-md shadow-orange-500 shadow-lg duration-1000 ring-[#563F15] flex overflow-hidden justify-center items-center fixed top-0 right-0 bg-[#1e1e1e]  `}
      >
        {!remoteStream ? (
          <p className="text-white font-semibold">Camera is off</p>
        ) : myStream == null ? (
          <SyncLoader color="#FBCB6B" />
        ) : (
          <ReactPlayer
            playing
            height={"100%"}
            width={"100%"}
            url={remoteStream}
            muted
          />
        )}
      </div>
        {showOutput ? <OutputDialog closeBtn={closeOutput} output={output} /> : null}

    </>
  );
};

export default InterviewSession;
