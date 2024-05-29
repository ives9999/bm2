import {useContext} from 'react'
import BMContext from '../../../../context/BMContext';
import { PrimaryButton } from '../../../../component/MyButton'
import { getAllMemberAPI } from '../../../../context/pos/PosAction';

export function Member() {
    const {auth, setIsLoading, setAlertModal} = useContext(BMContext)

    const getData = async (accessToken) => {
        const data = await getAllMemberAPI(accessToken);
        console.info(data);
    }
    const importMember = () => {
        setIsLoading(true);
        getData(auth.accessToken);
        setIsLoading(false);
    };

    return (
        <div className='ml-12'>
            <PrimaryButton type="button" className="w-full lg:w-60 mt-6" onClick={importMember}>開始匯入</PrimaryButton>
        </div>
    )
}
