import React from 'react'

const Input = ({type , label , className , value , ...props} , ref) => {
  return (
    <input type={type}
    placeholder={label}
    className={`border-2 pl-2 border-[#FFCE6D] focus:outline-none focus:border-[#ED5B2D] rounded-md h-10 ${className}`}
    {...props}

    />
  )
}

export default React.forwardRef(Input);