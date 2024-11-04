import React, { useState } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { disableLoading, enableLoading } from "../store/slices/loadingSlice";
import interviewService from "../services/InterviewService";
import toast from "react-hot-toast";

const MockInterviewWithFriend = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state)=> state.user.token);

  const createInterviewSession = async () => {
    if(!token){
      toast.error("You need to first login",{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
      navigate("/login");
      return;
    }
    
    dispatch(enableLoading());
    const result = await interviewService.createInterviewSession(token);
    if (typeof result === 'string') {
      toast.error(result,{
        style: {
            borderRadius: '10px',
            background: '#563F15',
            color: '#FFCE6D',
        },
      });
    } else {
      navigate(`/interview/lobby?roomId=${result.interview_room_id}`);
    }
    dispatch(disableLoading());
  };

  return (
    <div className="w-full flex phone:flex-col tablet:flex-row bg-[url('/wal/wal1.png')] ">
      <div className="flex-1  justify-center flex h-[400px]">
        <img src="/banner3.png" alt="" className="m-8" />
      </div>
      <div className="flex-1 flex flex-col justify-center h-[400px] phone:my-10 tablet:my-0 ">
        <h2 className="text-[25px] font-bold font-primaryFont ml-[100px] ">
          Mock Interview now with your friend ?
        </h2>
        <h3 className="text-[20px] font-extralight ml-[100px]">
          Mock interviews are the best to practise problem solving
        </h3>
        <Button
          onClick={(e) => {
            createInterviewSession();
          }}
          value={"Prepare Interview Room"}
          className={"max-w-[250px] mt-[10px] ml-[100px]"}
        />
      </div>
    </div>
  );
};

export default MockInterviewWithFriend;
