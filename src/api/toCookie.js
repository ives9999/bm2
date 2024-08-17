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
            console.info(payload.token)
            //document.cookie = `token=${payload.token};max-age=604800;domain=api.sportpassword.localhost`
            document.cookie = "TEST=1; expires=Tue, 14 Oct 2025 20:23:32 GMT; path=/ ;domain=api.sportpassword.localhost"
            console.info(document.cookie)
            // cookies.set('token', payload.token, {
            //     domain: 'api.sportpassword.localhost',
            //     //domain: process.env.REACT_APP_DOMAIN,
            //     expire: 60*60*24*30*365*10,
            //     path: '/',
            //     secure: 0,
            //})
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