import React from "react";
import Cookies from "universal-cookie";

const { useState, useEffect } = React;

const IsLogIn2 = () => {
    const [member, setMember] = useState({nickname: "", role: ""})

    function GuestGreeting(props) {
        return <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
    }

    function MemberGreeting(props) {
        return <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login1">{member.nickname}</a>
    }

    function Greeting(props) {
        if (member.nickname !== "") {
            return <MemberGreeting />
        } else {
            return <GuestGreeting />
        }
    }

    useEffect(() => {

        const cookies = new Cookies();
        var token = cookies.get("token")
        const url = process.env.REACT_APP_API + "/member/postIsLogIn"
        const params = {token: token}

        const fetchIsLogIn = () => {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(params),
                headers: { 'Content-Type': 'application/json'},
            })
            .then (response => response.json())
            .then (data => {
                //console.info(data)
                setMember({nickname: data.row.nickname, role: data.row.role})
            })
            .catch (err => {})
        };

        fetchIsLogIn()

    }, []);

    return (
        <>
            <Greeting />
            {/* <Greeting nickname={member.nickname} /> */}
        </>
    )
}

export { IsLogIn2 };