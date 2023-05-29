import React from "react";
import './Button.css'

const Button = (props) => {
  return (
    <div className="">
      <button {...props} className={'button ' + props.className}>
        -
      </button>
      <input type="number" />
      <button {...props} className={'button ' + props.className}>
        +
      </button>
    </div>
    
  )
}

export default Button;