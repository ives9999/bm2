import Layout from '../layout/Layout';
import { React, useState, useEffect } from "react";

const Test = () => {

    const [token, setToken] = useState(null)
    useEffect(() => {
        setToken("abc")
        console.info(token)
    }, [])

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
                <div className="row mt-70">
                </div>
            </main>
        </div>
        </Layout>
        </>
    );
}

export default Test;