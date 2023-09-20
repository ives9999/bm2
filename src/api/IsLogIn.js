import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import MenuHeader from "../component/tailwind/MenuHeader";

//const queryClient = new QueryClient();

// export function IsLogIn() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <IsLogIn1 />
//         </QueryClientProvider>
//     )
// }

const IsLogIn = () => {

    const [member, setMember] = useState({nickname: "", role: ""})

    const isAdmin = (() => {
        return member.role === "admin" ? true : false;
    })

    function GuestGreeting(props) {
        return <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
    }
    
    function MemberGreeting(props) {
        //const menuStyle = {
            //backgroundColor: "#FFF",
            //width: 'auto',
        //}
        return (
            <>
                <MenuHeader nickname={member.nickname} isAdmin={isAdmin} logout={logout} />
                
                {/* <Link className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="#" onClick={toggleMemberMenu}>{member.nickname}</Link>
                <div className={isMemberToggled ? "form-search p-20 d-block" : " form-search p-20 d-none"} style={menuStyle}>
                    <div className="popular-keywords text-start">
                        <Admin />
                        <div><a className="color-gray-600 mr-10 font-xs" href="/member">帳戶</a></div>
                        <div><Link className="color-gray-600 mr-10 font-xs" href="#" onClick={logout}>登出</Link></div>
                    </div>
                </div> */}
            </>
        )
    }

    function Greeting(props) {
        if (member.nickname !== "") {
            return <MemberGreeting />
        } else {
            return <GuestGreeting />
        }
    }

    const logout = () => {
        const cookies = new Cookies();
        cookies.remove("token", {
            domain: process.env.REACT_APP_DOMAIN,
            path: '/',
        })
        window.location.reload()
    }

    // const mutation = useMutation({
    //     mutation: (params) => {
    //         return axios.post(url, params)
    //     }
    // })

    useEffect( () => {
        const cookies = new Cookies();
        var token = cookies.get("token")
        const params = {token: token}
        const url = process.env.REACT_APP_API + "/member/postIsLogIn"
    
        const config = {
            method: "POST",
            Headers: {
                'Content-Type': 'application/json'
            }
        }
        
        axios.post(url, params, config)
        .then(response => {
            // console.info(response)
            if (response.data.success) {
                setMember({nickname: response.data.row.nickname, role: response.data.row.role})
            }
        })
}, [])
    
    return (
        <>
        <Greeting />
        </>
    )
}

export { IsLogIn }