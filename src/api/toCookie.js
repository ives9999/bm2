import Cookies from "universal-cookie";

const cookies = new Cookies()

const toCookie = (type, payload) => {
    switch (type) {
        case 'GET_TOKEN':
            const token = cookies.get('token')
            return token
        case 'GET_PAGE':
            const page = cookies.get('page')
            return page
        case 'SET_PAGE':
            cookies.set('page', payload.value, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
            return cookies
        case 'LOGIN':
            cookies.set('token', payload.token, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
            return cookies
        case 'LOGOUT':
            cookies.remove("token", {
                domain: process.env.REACT_APP_DOMAIN,
                path: '/',
            })
            return cookies
        default:
            return cookies
    }
}
export default toCookie