import { PropTypes } from 'prop-types'
import React from 'react'

function Button({
    children,
    extraClassName,
    version,
    type,
    isDisable,
    onClick,
}) {
    const newClassName = extraClassName + " mb-2 me-2 w-full rounded-lg bg-gradient-to-r from-PrimaryStart to-PrimaryEnd px-5 py-2.5 text-center text-sm font-medium text-gray-900 shadow-lg shadow-lime-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-lime-800"
    
    return (
        <button
        type={type}
        disabled={isDisable}
        className={`
            ${newClassName}
        `}
        onClick={onClick}
        >
        {children}
        </button>
    )
}

Button.defaultProps = {
  version: 'primary',
  type: 'button',
  isDisable: false,
}

Button.propTypes = {
  children: PropTypes.string,
  version: PropTypes.string,
  type: PropTypes.string,
  isDisable: PropTypes.bool,
}
export default Button
