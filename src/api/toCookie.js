import Cookies from "universal-cookie";

const cookies = new Cookies()

const toCookie = (type, payload) => {
    switch (type) {
        case 'GET_TOKEN':
            var token = cookies.get('token')
            if (token === null || token === undefined) {
                token = ""
            }
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
            // console.info(process.env.REACT_APP_DOMAIN)
            // console.info(payload.token)
            cookies.set('token', payload.token, {
                //domain: 'api.sportpassword.localhost',
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