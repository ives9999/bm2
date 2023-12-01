import { PropTypes } from 'prop-types'
import React from 'react'

function Button({ children, version, type, isDisable, onClick }) {
  return (
    <button type={type} disabled={isDisable} 
		className={`
		w-full text-gray-900 shadow-lg shadow-lime-500/50 bg-gradient-to-r from-PrimaryStart to-PrimaryEnd hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2
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
