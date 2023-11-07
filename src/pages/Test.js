import Layout from '../layout/Layout';
import { React, useState, useEffect } from "react";
import { dump } from "../functions"

const Test = () => {

    const [value, setValue] = useState("")
    const [count, setCount] = useState(-1)

    const [secret, setSecret] = useState({ value: "", countSecrets: 0 });
    

    useEffect(() => {
        function a(s) {
            return {...s, countSecrets: s.countSecrets + 1}
        }
        //const a = (s) => ({...s, countSecrets: s.countSecrets + 1})
        setSecret(function(s)=>(
            return {
                ...s, countSecrets: s.countSecrets + 1
            })
        )
        //setSecret((s) => ({...s, countSecrets: s.countSecrets + 1}));
        setValue(1)
    }, [value])
    const onChange = ({target}) => {
        // dump(target.value)
        setValue(target.value)
    }

    return (
        <>
        <div className="py-10 mx-auto max-w-7xl">
            <input className='text-red-500' type="text" value={value} onChange={onChange} />
            <div className='text-myPrimary'>Number of Changes: {count}</div>
        </div>
        </>
    );
}

export default Test;