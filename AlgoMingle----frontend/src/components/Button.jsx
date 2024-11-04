import React from 'react'

const Button =  ({className,value, ...props} , ref) => {
  return (
    <button ref={ref} className={`py-2 px-4 bg-[#ED5B2D] transition-all duration-200  rounded-md text-white font-semibold border-white border shadow-lg hover:bg-[#D55128] ${className}`} {...props}>
        <p>{value}</p>
    </button>
  )
}

export default React.forwardRef(Button);