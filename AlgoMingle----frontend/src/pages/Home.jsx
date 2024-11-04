import React from "react";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { enableLoading } from "../store/slices/loadingSlice";
import { useNavigate } from "react-router";
const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  return (
    <div className="w-full flex phone:flex-col tablet:flex-row bg-[url('/wal/wal1.png')] ">
      <div className="flex-1 flex flex-col justify-center h-[400px] phone:my-10 tablet:my-0 ">
        <h2 className="text-[25px] font-bold font-primaryFont ml-[100px] ">
          Want to give Mock Interviews ?
        </h2>
        <h3 className="text-[20px] font-extralight ml-[100px]">
          with people around the world having same interest in DSA
        </h3>
        <Button onClick={(e)=>{
          
            navigate("/mock-interview-with-friend");
            
        }} value={"Schedule a Mock Interview Now"} className={"max-w-[300px] mt-[10px] ml-[100px]"}/>
      </div>
      <div className="flex-1  justify-center flex h-[400px]">
        <img src="./banner1.png" alt="" className="m-8" />
      </div>
    </div>
  );
};

export default Home;
