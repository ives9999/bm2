import { Button } from 'flowbite-react'

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
    ' relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-MenuBG rounded-md group-hover:bg-opacity-0'
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
    ' text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-Primary dark:text-MyWhite dark:hover:text-MyBlack dark:hover:bg-Primary dark:focus:ring-Primary'

    return (
        <Button type={type} className={`${newClassName}`} onClick={onClick}>{children}</Button>
    )
}


export function CancelButton({children, extraClassName, onClick}) {
    const newClassName =
    extraClassName +
    ' py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'

    return (
        <Button type="button" className={`${newClassName}`} onClick={onClick}>{children}</Button>
    )
}
