const UseHr = ({
    color="border-menuTextWhite",
    mt="mt-10",
    mb="mb-6",
    isHidden=false,
}) => {
    return (
        <>
        <div className={`
            h-1
            border-t 
            ${color} 
            ${mt} 
            ${mb}

            ${isHidden ? "hidden" : "block"}
        `}
        ></div>
        </>
    )
}

export default UseHr