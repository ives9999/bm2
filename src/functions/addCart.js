import AddCart from "../api/AddCart";
import {toLogin} from "../context/to";

export async function addCart(auth, setIsLoading, product_token, setToggleModalShow, warning, setAlertModal) {
    if ('id' in auth && auth.id > 0) {
        //console.info(auth);
        setIsLoading(true);
        const res = await AddCart(auth.accessToken, product_token);
        if (typeof res === 'object') {
            setToggleModalShow((prev)=>(!prev));
        } else if (typeof res === 'string') {
            warning(res);
        }
        setIsLoading(false);
    } else {
        setAlertModal({
            modalType: 'warning',
            modalTitle: '警告',
            modalText: "請先登入",
            isModalShow: true,
            isShowOKButton: true,
            isShowCancelButton: true,
            onOK: toLogin
        });
    }
}