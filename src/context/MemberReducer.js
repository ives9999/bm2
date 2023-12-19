const memberReducer = (state, action) => {
    switch (action.type) {
        case "GET_ONE":
            const data = action.payload
            const isLogin = (data.token !== null && data.token !== undefined && data.token.trim().length > 0) ? true : false
            return {
                ...state,
                memberData: data,
                isLogin: isLogin,
            }
        case "UPDATE":
            // console.info(state.memberData)
            // console.info(action.payload)
            const b = {...state.memberData, ...action.payload}
            // console.info(b)
            //console.info({...state, memberData: b})
            return {...state, memberData: b}
        case "GET":
            return state
        default:
            return state
    }
}

export default memberReducer