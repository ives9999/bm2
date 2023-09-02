import React from "react";
import ReactDOM from "react-dom";

const { useState } = React;

const counter = () => {

    const [count, setCount] = useState(5)
    const handleClick = (type) => () => {
        setCount(type === "increment" ? count + 1: count -1)
    }

    return (
        <div>
            <div onClick={handleClick("increment")} />
            <div>{count}</div>
            <div onClick={handleClick("decrement")} />

        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<counter/>)