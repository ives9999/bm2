const memberReducer = (state, action) => {
    switch (action.type) {
        case "GET_ONE":
            const data = action.payload
            const isLogin = (data.token !== null && data.token !== undefined && data.token.trim().length > 0) ? true : false
            return {
                ...state,
                auth: data,
                isLogin: isLogin,
            }
        case "UPDATE":
            //console.info(state)
            //console.info(action.payload)
            const b = {...state.auth, ...action.payload}
            // console.info(b)
            //console.info({...state, memberData: b})
            return {...state, auth: b}
        case "GET":
            return state
        default:
            return state
    }
}

export default memberReducer