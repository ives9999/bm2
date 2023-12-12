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
    return (
        <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-MenuBG rounded-md group-hover:bg-opacity-0">
            {children}
            </span>
        </button>
        // <Button outline gradientDuoTone="tealToLime"
        //     onClick={onClick}
        // >
        // {children}
        // </Button>
    )
}
