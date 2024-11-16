import {Button} from 'flowbite-react'
import {FiEdit, FiTrash2, FiShoppingBag} from "react-icons/fi";
import {FaShoppingCart} from "react-icons/fa";

export function PrimaryButton({type = 'button', children, className, onClick}) {
    const originalClassName = 'rounded-lg bg-gradient-to-r from-Primary-300 to-Primary-400 px-6 py-3 text-center text-sm font-medium text-Primary-950 shadow-lg shadow-Primary-500/50 hover:bg-gradient-to-r hover:from-Primary-200 hover:to-Primary-300 focus:outline-none focus:ring-4 focus:ring-Primary-800';
    const newClassName = (className) ? className + ' ' + originalClassName : originalClassName;

    return (
        <button
            type={type}
            className={newClassName}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export function SecondaryButton({type = 'button', children, className, onClick}) {
    const originalClassName = 'relative inline-flex items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-MyWhite rounded-lg group bg-gradient-to-br from-Primary-300 to-Primary-400 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-MyBlack focus:ring-4 focus:outline-none focus:ring-blue-800';
    const newClassName = (className) ? className + ' ' + originalClassName : originalClassName;

    const spanClassName =
        className +
        ' relative px-5 py-2.5 transition-all ease-in duration-75 bg-MyWhite dark:bg-PrimaryBlock-950 rounded-md group-hover:bg-opacity-0'
    return (
        <button type={type} className={newClassName} onClick={onClick}>
            <span className={spanClassName}>
            {children}
            </span>
        </button>
    )
}

export function PrimaryOutlineButton({type = 'button', children, className, onClick}) {
    const originalClassName = 'p-0.5 border border-Primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 text-Primary-300 hover:bg-Primary-700 hover:border-Primary-700 hover:text-Primary-100'
    const newClassName = (className !== undefined) ?
        originalClassName + ' ' + className :
        originalClassName

    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export function DeleteOutlineButton({type, children, className, onClick}) {
    const originalClassName = 'p-0.5 border border-Warning-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 text-Warning-400 hover:bg-Warning-700 hover:border-Warning-700 hover:text-Warning-100'
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName

    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export function OKButton({type, children, className, onClick}) {
    const originalClassName = 'group flex items-center justify-center p-0.5 text-center font-medium relative focus:z-10 focus:outline-none text-MyBlack bg-cyan-700 border border-transparent enabled:hover:bg-cyan-800 focus:ring-cyan-300 dark:bg-Primary-400 dark:enabled:hover:bg-Primary-500 dark:focus:Primary-500 rounded-lg focus:ring-2'
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName
    return (
        <button
            type="button"
            className={`${newClassName}`}
            onClick={onClick}
        >
            <span
                className="flex items-center transition-all duration-200 rounded-md text-sm px-4 py-2">{children}</span>
        </button>
    )
}


export function CancelButton({children, className, onClick}) {
    const originalClassName = 'p-0.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName

    return (
        <button
            type="button"
            className={`${newClassName}`}
            onClick={onClick}
        >
            <span
                className="flex items-center justify-center transition-all duration-200 rounded-md text-sm px-4 py-2">{children}</span>
        </button>
        // <Button type="button" className={`${newClassName}`} onClick={onClick}>{children}</Button>
    )
}

export function DeleteButton({type, children, className, onClick, disabled = false}) {
    let originalClassName = 'inline-flex items-center gap-x-1.5 rounded-md bg-Warning-400 px-3.5 py-1.5 text-sm font-semibold text-MyBlack shadow-sm'
    originalClassName += (disabled) ? ' disabled:opacity-35' : ' hover:bg-Warning-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Warning-600';
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName

    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
            disabled={disabled}
        >
            <FiTrash2 className="-ml-0.5 h-5 w-5"/>
            {children}
        </button>
    )
}

export function EditButton({type, children, className, onClick}) {
    const originalClassName = 'inline-flex items-center gap-x-1.5 rounded-md bg-Primary-400 px-3.5 py-1.5 text-sm font-semibold text-MyBlack shadow-sm hover:bg-Primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary-600'
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName

    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            <FiEdit className="-ml-0.5 h-5 w-5"/>
            {children}
        </button>
    )
}

export function ShoppingCartButton({type, children, className, onClick}) {
    const originalClassName = 'inline-flex items-center gap-x-1.5 rounded-md bg-Primary-100 px-3.5 py-1.5 text-sm font-semibold text-MyBlack shadow-sm hover:bg-Primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary-600'
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName

    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            <FaShoppingCart className="-ml-0.5 h-5 w-5"/>
            {children}
        </button>
    )
}

export function OrderButton({type, children, className, onClick}) {
    const originalClassName = 'inline-flex items-center gap-x-1.5 rounded-md bg-Primary-100 px-3.5 py-1.5 text-sm font-semibold text-MyBlack shadow-sm hover:bg-Primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary-600'
    const newClassName = (className !== undefined) ?
        className + ' ' + originalClassName :
        originalClassName

    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            <FiShoppingBag className="-ml-0.5 h-5 w-5"/>
            {children}
        </button>
    )
}
