import Layout from '../layout/Layout';
import { React, useState, useEffect } from "react";
import { dump } from "../functions"

const Test = () => {

    const [value, setValue] = useState("")
    const [count, setCount] = useState(-1)

    const [secret, setSecret] = useState({ value: "", countSecrets: 0 });
    

    useEffect(() => {
        // function a(s) {
        //     return {...s, countSecrets: s.countSecrets + 1}
        // }
        //const a = (s) => ({...s, countSecrets: s.countSecrets + 1})
        // setSecret(function(s)=>(
        //     return {
        //         ...s, countSecrets: s.countSecrets + 1
        //     })
        // )
        if (secret.value === "secret") {
            setSecret((s) => ({...s, countSecrets: s.countSecrets + 1}));
        }
        //setValue(1)
    }, [secret.value])
    const onChange = ({target}) => {
        // dump(target.value)
        //setValue(target.value)
        setSecret(s => ({ ...s, value: target.value}))
    }

    return (
        <>
        <div className="py-10 mx-auto max-w-7xl">
            <input className='text-red-500' type="text" value={secret.value} onChange={onChange} />
            <div className='text-Primary'>Number of Changes: {secret.countSecrets}</div>
        </div>
        </>
    );
}

export default Test;