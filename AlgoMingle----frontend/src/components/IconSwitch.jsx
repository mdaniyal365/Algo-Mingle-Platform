import React from "react";

const IconSwitch = ({ enable, onImage, offImage , className, ...props}, ref) => {
  return (
    <div
    
      ref={ref}
      className={`flex transition-all duration-500 justify-center items-center h-[40px] bg-white w-[40px] rounded-full shadow-sm hover:shadow-xl p-1 border ${className}`}
    {...props}>
      <img
        src={enable ? onImage : offImage}
        className=" transition-all duration-500"
      />
    </div>
  );
};
export default React.forwardRef(IconSwitch);
