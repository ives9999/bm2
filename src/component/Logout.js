import Cookies from "universal-cookie";

export function Logout(cookies) {
    cookies.remove("token", {
        domain: process.env.REACT_APP_DOMAIN,
        path: '/',
    })
}