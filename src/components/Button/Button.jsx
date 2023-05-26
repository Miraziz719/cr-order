import React from "react";
import Button from "../Button/Button"

const Button = (props) => {
  return (
    <button {...props} className={'button ' + props.className}>

    </button>
  )
}

export default Button;