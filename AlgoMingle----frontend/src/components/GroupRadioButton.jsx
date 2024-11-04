import React, { useEffect, useState } from 'react'

const GroupRadioButton = ({first , second , third , setFirst , setSecond , setThird}) => {
    

    useEffect(()=>{
        console.log(first + " " + second + " " + third);
    },[first , second , third])
  return (
    
 
    <div class="flex  justify-center mt-2 text-sm ">
      <label class="cursor-pointer mx-1">
        <input type="radio" class="peer sr-only" name="pricing" 
        checked={first}
        onChange={(e)=>{
            if(e.target.checked){
                setFirst(true);
                setSecond(false);
                setThird(false);
            }
        }} />
        <div class=" max-w-xl  rounded-md bg-[#FBCB6B] p-2 text-gray-700 ring-2 ring-transparent transition-all hover:shadow peer-checked:bg-[#563F15] peer-checked:text-white peer-checked:font-bold peer-checked:font-lumanosimo peer-checked:ring-[#524e46] peer-checked:ring-offset-2">
          <div class="flex  justify-center items-center gap-1">
            <p>Video Interaction</p>
          </div>
        </div>
      </label>
      <label class="cursor-pointer mx-1">
        <input type="radio" class="peer sr-only" name="pricing" checked={second}
            onChange={(e) => {
                if(e.target.checked){
                    setFirst(false);
                    setSecond(true);
                    setThird(false);
                }
            }}
        />
        <div class=" max-w-xl  rounded-md bg-[#FBCB6B] p-2 text-gray-700 ring-2 ring-transparent transition-all hover:shadow peer-checked:bg-[#563F15] peer-checked:text-white peer-checked:font-bold peer-checked:font-lumanosimo peer-checked:ring-[#563F15] peer-checked:ring-offset-2">
          <div class="flex  justify-center items-center gap-1">
            <p>Code it</p>
          </div>
        </div>
      </label>
      <label class="cursor-pointer mx-1">
        <input type="radio" class="peer sr-only" name="pricing"checked={third} 
            onChange={(e)=>{
                if(e.target.checked){
                    setFirst(false);
                    setSecond(false);
                    setThird(true);
                }
            }}
        />
        {/* <div class=" max-w-xl  rounded-md bg-[#FBCB6B] p-2 text-gray-700 ring-2 ring-transparent transition-all hover:shadow peer-checked:bg-[#563F15] peer-checked:text-white peer-checked:font-bold peer-checked:font-lumanosimo peer-checked:ring-[#563F15] peer-checked:ring-offset-2">
          <div class="flex  justify-center items-center gap-1">
            <p>Whiteboard</p>
          </div>
        </div> */}
      </label>
      
    </div>
  


  )
}

export default GroupRadioButton