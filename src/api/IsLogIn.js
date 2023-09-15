import { QueryClient, QueryClientProvider, useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "universal-cookie";
import axios from "axios";
import { useEffect, useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const MenuStyle = styled`
    background-color: #fff;
`;

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

    function GuestGreeting(props) {
        return <a className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="/member/login">登入</a>
    }

    // const [anchorEl, setAnchorEl] = useState(false);
    // const open = Boolean(anchorEl)
    // const handleMemberClick = (event) => {
    //     setAnchorEl(event.currentTarget)
    // }
    // const handleMemberClose = () => {
    //     setAnchorEl(false)
    // }

    // State to represent whether something is toggled or not
    const [isMemberToggled, setMemberToggled] = useState(false);

    // Function to toggle the value of 'isToggled'
    const toggleMemberMenu = () => setMemberToggled(!isMemberToggled);

    function Admin() {
        if (member.role === 'admin') {
            return <div><a className="color-gray-600 mr-10 font-xs" href="/admin">後台</a></div>
        } else {
            return ""
        }
    }
    function MemberGreeting(props) {
        const menuStyle = {
            //backgroundColor: "#FFF",
            width: 'auto',
        }
        return (
            <>
            <Link className="btn btn-linear d-none d-sm-inline-block hover-up hover-shadow" href="#" onClick={toggleMemberMenu}>{member.nickname}</Link>
                <div className={isMemberToggled ? "form-search p-20 d-block" : " form-search p-20 d-none"} style={menuStyle}>
                    <div className="popular-keywords text-start">
                        <Admin />
                        <div><a className="color-gray-600 mr-10 font-xs" href="/member">帳戶</a></div>
                        <div><Link className="color-gray-600 mr-10 font-xs" href="#" onClick={logout}>登出</Link></div>
                    </div>
                </div>
                {/* <Button
                    id="member-button"
                    aria-controls={open ? 'membeer-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMemberClick}
                >
                    {member.nickname}
                </Button>
                <Menu
                    id="member-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMemberClick}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem>會員資料</MenuItem>
                </Menu> */}
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