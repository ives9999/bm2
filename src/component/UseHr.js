const UseHr = ({
    color="border-menuTextWhite",
    mt="mt-10",
    mb="mb-6",
}) => {
    return (
        <>
        <div className={`
            h-1
            border-t 
            ${color} 
            ${mt} 
            ${mb}
        `}
        ></div>
        </>
    )
}

export default UseHr