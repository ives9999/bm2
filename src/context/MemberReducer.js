const memberReducer = (state, action) => {
    switch (action.type) {
        case "GET_ONE":
            const data = action.payload
            const isLogin = (data.token !== null && data.token !== undefined && data.token.trim().length > 0) ? true : false
            const a = {
                ...state,
                memberData: data,
                isLogin: isLogin,
            }
            return {
            ...state,
            memberData: data,
            isLogin: isLogin,
        }
        case "GET":
            return state
        default:
            return state
    }
}

export default memberReducer