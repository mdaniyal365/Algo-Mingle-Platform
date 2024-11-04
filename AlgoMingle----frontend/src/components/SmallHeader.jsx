import React from 'react'

const SmallHeader = ({heading = "Interview Lobby" , height = "80px"}) => {
  return (
    <div className={`w-full h-[${height}] border bg-[#F5F3F0] flex justify-center items-center shadow-orange-300 shadow-md`}>
        <div className="absolute h-20 w-full flex">
          <div className="w-2/6  h-full flex justify-center items-center">
            <img src="/logos/logo13.png" className="h-[100%]" alt="" />
            <img src="/logos/logo14.png" className="h-[100%]" alt="" />
          </div>
          <div className="w-4/6"></div>
        </div>
        <p className="text-[20px] font-lumanosimo font-bold">{heading}</p>
      </div>
  )
}

export default SmallHeader