import { Button } from 'flowbite-react';

function MyButton({
    type,
    children,
    extraClassName,
    onClick,
}) {
    const newClassName = extraClassName + " mb-2 me-2 w-full rounded-lg bg-gradient-to-r from-PrimaryStart to-PrimaryEnd px-5 text-center text-sm font-medium text-gray-900 shadow-lg shadow-lime-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-lime-800"
    
    return (
        <Button
            type={type}
            className={`
                ${newClassName}
            `}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}

export default MyButton
