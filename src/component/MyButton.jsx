import { Button } from 'flowbite-react'
import { FiEdit, FiTrash2 } from "react-icons/fi";

export function PrimaryButton({ type, children, extraClassName, onClick }) {
  const newClassName =
    extraClassName +
    ' rounded-lg bg-gradient-to-r from-PrimaryStart to-PrimaryEnd px-5 text-center text-sm font-medium text-gray-900 shadow-lg shadow-lime-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-lime-800'

  return (
    <Button
      type={type}
      className={`${newClassName}`}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export function SecondaryButton({ type, children, extraClassName, onClick }) {
    const newClassName =
    extraClassName +
    ' relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-MyWhite rounded-lg group bg-gradient-to-br from-PrimaryStart to-PrimaryEnd group-hover:from-purple-600 group-hover:to-blue-500 hover:text-MyBlack focus:ring-4 focus:outline-none focus:ring-blue-800'

    const spanClassName = 
    extraClassName + 
    ' relative px-5 py-2.5 transition-all ease-in duration-75 bg-MyWhite dark:bg-PrimaryBlock-950 rounded-md group-hover:bg-opacity-0'
    return (
        <button type={type} className={`${newClassName}`} onClick={onClick}>
            <span className={`${spanClassName}`}>
            {children}
            </span>
        </button>
    )
}

export function OutlineButton({type, children, extraClassName, onClick}) {
    const newClassName =
    extraClassName +
    ' border border-primary ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 border-Primary-300 text-MyWhite hover:text-MyBlack hover:bg-Primary-300'

    return (
        <Button type={type} className={`${newClassName}`} onClick={onClick}>{children}</Button>
    )
}


export function CancelButton({children, extraClassName, onClick}) {
    const newClassName =
    extraClassName +
    ' py-2.5 px-5 me-2 mb-2 text-sm font-medium rounded-lg border border-slate-300 focus:z-10 ring-4 focus:ring-gray-700 bg-gray-800 text-gray-400 hover:text-MyWhite hover:bg-gray-700'

    return (
        <Button type="button" className={`${newClassName}`} onClick={onClick}>{children}</Button>
    )
}

export function DeleteButton({ type, children, extraClassName, onClick }) {
    const originalClassName = 'inline-flex items-center gap-x-1.5 rounded-md bg-Warning-400 px-3.5 py-1.5 text-sm font-semibold text-MyBlack shadow-sm hover:bg-Warning-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Warning-600'
    const newClassName = (extraClassName !== undefined) ? 
      extraClassName + ' ' + originalClassName :
      originalClassName
  
    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            <FiTrash2 className="-ml-0.5 h-5 w-5" />
            {children}
        </button>
    )
}

export function EditButton({ type, children, extraClassName, onClick }) {
    const originalClassName = 'inline-flex items-center gap-x-1.5 rounded-md bg-Primary-400 px-3.5 py-1.5 text-sm font-semibold text-MyBlack shadow-sm hover:bg-Primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-Primary-600'
    const newClassName = (extraClassName !== undefined) ? 
      extraClassName + ' ' + originalClassName :
      originalClassName
  
    return (
        <button
            type={type}
            className={`${newClassName}`}
            onClick={onClick}
        >
            <FiEdit className="-ml-0.5 h-5 w-5" />
            {children}
        </button>
    )
}
