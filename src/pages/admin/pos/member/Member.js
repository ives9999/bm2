import {useContext, useState} from 'react'
import BMContext from '../../../../context/BMContext';
import { PrimaryButton } from '../../../../component/MyButton'
import { getAllMemberAPI } from '../../../../context/pos/PosAction';
import { DateRange } from '../../../../component/form/DateSingle';
import { nowDate } from '../../../../functions/date';

export function Member() {
    const {auth, setIsLoading} = useContext(BMContext)

    const now = nowDate();//console.info(nowDate);
    // 要設定匯入時間的物件
    const [date, setDate] = useState({
        startDate: now,
        endDate: now,
    });

    const onDateChange = (newValue) => {
        //console.log("newValue:", newValue); 
        setDate(newValue); 
    }

    const getData = async (accessToken) => {
        const data = await getAllMemberAPI(accessToken, date.startDate, date.endDate);
        console.info(data);
    }
    const importMember = () => {
        setIsLoading(true);
        getData(auth.accessToken);
        setIsLoading(false);
    };

    return (
        <div className='mx-12 mt-4'>
            <DateRange label="選擇匯入日期" value={date} onChange={onDateChange} />
            <PrimaryButton type="button" className="w-full lg:w-60 mt-6" onClick={importMember}>開始匯入</PrimaryButton>
        </div>
    )
}
