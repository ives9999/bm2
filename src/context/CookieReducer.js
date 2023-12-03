import Cookies from "universal-cookie";

const cookies = new Cookies()

const CookieReducer = (state, action) => {
    switch (action.type) {
        case 'GET_TOKEN':
            const token = cookies.get('token')
            state.token = token
            return {...state}
        case 'GET_PAGE':
            const page = cookies.get('page')
            state.page = page
            return {...state}
        case 'SET_PAGE':
            cookies.set('page', action.payload.value, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
            return {...state}
        case 'LOGIN':
            cookies.set('token', action.payload.token, {
                domain: process.env.REACT_APP_DOMAIN,
                expire: 60*60*24*30*365*10,
                path: '/',
                secure: 0,
            })
            return {...state}
        case 'LOGOUT':
            cookies.remove("token", {
                domain: process.env.REACT_APP_DOMAIN,
                path: '/',
            })
            return {...state}
        default:
            return state
    }
}
export default CookieReducer