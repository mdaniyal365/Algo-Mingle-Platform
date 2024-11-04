import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import Button from "../../components/Button";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import interviewService from "../../services/InterviewService";
import SmallHeader from "../../components/SmallHeader";
import { baseUrl } from "../../utils/codeEditorInititor";

const Lobby = () => {
  
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  useEffect(()=>{
    checkInterviewId();
  },[roomId])

  const navigate = useNavigate();
  const [audioOn, setAudioOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [isCameraOn, setCameraOn] = useState(false);
  const [myStream, setMyStream] = useState(null);
  const [notFirstRender, setNotFirstRender] = useState(false);

  const socket = useSocket();

  const isLoggedIn = useSelector((state) => state.user.userData);

  
 

  const checkInterviewId = async () => {
    const result = await interviewService.checkInterviewId(roomId);
    if(typeof result === 'string'){
      toast.error("You are not allowed to enter this interview",{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
      navigate("/");
    }
  }

  const messageRecievedFromServer = (data) => {
      toast.success(data,{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      })
  }




  

  useEffect(() => {
    
    if (notFirstRender) {
      closeAudio();
      closeVideo();
      SwitchOnAudioOrVideo(audioOn, videoOn);
    }
    setNotFirstRender(true);
    return () => {};
  }, [audioOn, videoOn]);

  const initalizeStream = async (audioVal, videoVal) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioVal,
        video: videoVal,
      });
      setMyStream(stream);
    } catch (error) {
      if (audioVal || videoVal) {
        toast.error("Please Allow Camera and Mic access",{
          style: {
              borderRadius: '10px',
              background: '#563F15',
              color: '#FFCE6D',
          },
        });
        closeAudio();
        closeVideo();
        setAudioOn(false);
        setVideoOn(false);
      }
    }
  };

  const SwitchOnAudioOrVideo = (audioVal, videoVal) => {
    setMyStream(null);
    initalizeStream(audioVal, videoVal);
  };
  const closeAudio = () => {
    if (myStream !== null) {
      myStream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.stop();
        }
      });
    }
  };
  const closeVideo = () => {
    if (myStream != null) {
      myStream.getTracks().forEach((track) => {
        if (track.kind === "video") {
          track.stop();
        }
      });
    }
  };

  return (
    <>
      <SmallHeader heading = {"Interview Lobby"} />
      <div className="w-full h-screen bg-[url('/wal/wal1.png')] flex  justify-center ">
        <div className="w-[1100px] h-[500px] mt-[50px] border-2 border-[#FFCE6D] flex bg-white rounded-xl shadow">
          <div className="w-[53%] p-4 flex flex-col justify-center overflow-hidden items-center">
            <div
              className={`w-full ${
                !(!myStream || (myStream && !videoOn && audioOn)) && "hidden"
              } transition-all duration-500  rounded-[20px] h-[80%] flex justify-center  items-center border-4 bg-[#2c2c2c]`}
            >
              <p className="  text-lg font-bold font-lumanosimo relative  text-white">
                Camera is Off
              </p>
            </div>

            <ReactPlayer
              className={`border-2 ${
                (!myStream || (myStream && !videoOn && audioOn)) && "hidden"
              } transition-all duration-500    rounded-[20px]`}
              playing
              height={"80%"}
              url={myStream}
              width={"100%"}
            />

            <div className="w-full h-10  flex mt-4 justify-around items-center">
              <label for="toggle" class="flex  cursor-pointer overflow-hidden">
                <input
                  type="checkbox"
                  id="toggle"
                  class="sr-only peer"
                  checked={videoOn}
                  onChange={(e) => {
                    setVideoOn((prev) => !prev);
                  }}
                />
                <div class="block relative bg-[#563F15] w-10 h-6 p-1 rounded-full before:absolute before:bg-white before:w-4 before:h-4 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-5 peer-checked:before:bg-[#FFCE6D]"></div>
                <p className="ml-2 font-semibold">Camera</p>
              </label>

              <label for="toggle2" class="flex  cursor-pointer">
                <p className="mr-2 font-semibold">Audio</p>
                <input
                  type="checkbox"
                  id="toggle2"
                  class="sr-only peer"
                  checked={audioOn}
                  onChange={(e) => {
                    setAudioOn(!audioOn);
                  }}
                />
                <div class="block relative bg-[#563F15] w-10 h-6 p-1 rounded-full before:absolute before:bg-white before:w-4 before:h-4 before:p-1 before:rounded-full before:transition-all before:duration-500 before:left-1 peer-checked:before:left-5 peer-checked:before:bg-[#FFCE6D]"></div>
              </label>
            </div>
          </div>
          <div className="w-[47%]  flex flex-col justify-center items-center">
            <p className="text-xl font-lumanosimo font-semibold">Hi {isLoggedIn?.name},</p>
            <p className="text-center font-extralight mx-4 ">
              Copy the below link and share it with your friend to join him/her
              the interview session
            </p>

            <p className="bg-[#FFCE6D] p-2 mt-4 border-2  transition-all duration-500 hover:bg-[#4DB6AC] hover:text-white border-[#563F15] rounded-md ">
              Interview Room is Empty
            </p>
            <div
              className=" cursor-pointer w-[400px] rounded-[50px] bg-[#FFCE6D] h-[50px] border-4 border-[#563F15] mt-5 flex justify-center items-center overflow-hidden"
              onClick={(e) => {
                toast.success("Link Copied to your clipboard",{
                  style: {
                      borderRadius: '10px',
                      background: '#563F15',
                      color: '#FFCE6D',
                  },
                });
                navigator.clipboard.writeText(`${baseUrl}interview/lobby?roomId=${roomId}`);
              }}
            >
              <p className=" font-poppins text-md font-bold text-[#563F15] ">
                https://algomingle.hayatsoftwares.com/interv..
              </p>
            </div>
            <Button className={"mt-6"} value={"Start Interview Session"} onClick={(e)=>{
              navigate(`/interview/session/${roomId}?camera=${videoOn}&mic=${audioOn}`)
            }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
