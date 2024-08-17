const modalReducer = (state, action) => {
    switch (action.type) {
        case 'ALERT':
            return {
                ...state,
                modalType: action.payload.modalType,
                modalText: action.payload.modalText,
                isModalShow: true,
            }
        case 'CLOSE_ALERT':
            return {
                isModalShow: false,
            }
        case 'SUCCESS':
            return {
                ...state,
                modalType: action.payload.modalType,
                modalText: action.payload.modalText,
                isModalShow: true,
            }
        default:
            return state
    }
}

export default modalReducer