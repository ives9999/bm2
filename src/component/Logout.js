import Cookies from "universal-cookie";

export function Logout() {
    const cookies = new Cookies();
    cookies.remove("token", {
        domain: process.env.REACT_APP_DOMAIN,
        path: '/',
    })
}