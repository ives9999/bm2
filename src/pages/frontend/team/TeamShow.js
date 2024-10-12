import { React, useState, useEffect } from "react";
import Breadcrumb from '../../../component/Breadcrumb'
import { getOneAPI } from "../../../context/team/TeamAction";
import {useParams, Link, useNavigate} from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import ImageGallery from 'react-image-gallery';
import {PrimaryLabel} from "../../../component/MyLabel";
import Zones from "../../../component/Zones";
import ProductSearch from "../../../component/product/ProductSearch";
import { FaFacebookSquare, FaYoutube, FaLine, FaLink, FaMobileAlt, FaUser, FaMapMarkerAlt, FaMale, FaFemale } from "react-icons/fa";
import { TfiEmail } from "react-icons/tfi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { MdAccessTimeFilled } from "react-icons/md";
import { IsEmptyField } from "../../../functions";

const Team = () => {
    const {token} = useParams();
    const [data, setData] = useState({})
    const initBreadcrumb = [
        { name: '球隊', href: '/team', current: false },
    ];
    const [breadcrumbs, setBreadcrumbs] = useState(initBreadcrumb)
    const [gallery, setGallery] = useState([]);

    const perpage = process.env.REACT_APP_PERPAGE;
    const navigate = useNavigate();
    const keywordFilter = (e, keyword) => {
        e.preventDefault();
        navigate('/arena?page=1&perpage='+perpage+'&k='+keyword)
    }


    const getOne = async (token, scenario) => {
        let data = await getOneAPI(token, scenario);
        data = data.data;
        return data;
    }

    useEffect(() => {
        // console.info(token);
        getOne(token, 'read').then((data) => {
            console.info(data);
            setData(data);

            const images = [];
            data.images.forEach((item) => {
                images.push({original: item.path, thumbnail: item.path});
            });
            setGallery(images);
            //console.info(data.attrs);

            setBreadcrumbs(() => {
                return [...initBreadcrumb, { name: data.name, href: '', current: true }]
            })
        });
    }, [])

    if (Object.keys(data).length === 0) { return <div className='text-MyWhite'>loading...</div>}
    else {
    return (
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
            </main>
            
            {/* 全部內容跟旁邊的類別 */}
            <div className="flex flex-col lg:flex-row relative z-20 justify-between px-4 mx-auto max-w-screen-xl bg-gray-900 rounded">
                {/* 全部內容 */}
                <article className="xl:w-[828px] w-full max-w-none format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                    <div className="mt-6 flex flex-col justify-between mb-4 lg:py-4 lg:mb-0 mx-1.5">
                        <ProductSearch able="team" filter={keywordFilter} />
                    </div>

                    {/* 標題圖片跟詳細內容 */}
                    <div className="flex flex-col py-6 border-t dark:border-gray-700">
                        <div className="flex flex-col md:flex-row pb-6 border-b dark:border-gray-700">
                            {/* 標題跟圖片 */}
                            <div className="">
                                {/* 標題 */}
                                <h1 className="mb-4 max-w-2xl text-2xl dark:text-rabbit-50 font-extrabold leading-none text-gray-900 sm:text-3xl lg:text-4xl">{data.name}</h1>
                                {/* 價格 */}
                                <div className='flex'>
                                    <h2 className='flex mb-4 text-2xl text-Warning-600 font-medium me-2py-2.5'>
                                        {/* {data && data.prices && data.prices.length > 0
                                            ? "NT$：" + formattedWithSeparator(data.prices[0].price_member) + "元"
                                            : ''
                                        } */}
                                    </h2>
                                </div>
                                {/* 屬性 */}
                                <ul className='mb-4 text-MyWhite'>
                                    <li key='city' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <div>縣市：</div>
                                        <Link to={data.arena.city_id}>{data.arena.city_name}</Link>
                                    </li>
                                    <li key='area' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <div>區域：</div>
                                        <Link to={data.arena.area_id}>{data.arena.area_name}</Link>
                                    </li>
                                    <li key='road' className='flex items-center mb-4'>
                                        <FaMapMarkerAlt className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>住址：{data.arena.city_name}{data.arena.area_name}{data.arena.zip}{data.arena.road}</span>
                                    </li>
                                    <li key='arena' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>球館：</span><a href={`/arena/show/${data.arena.token}`} target='_blank' rel='noreferrer'>{data.arena.name}</a>
                                    </li>
                                    <li key='date' className='flex items-center mb-4'>
                                        <BsFillCalendarDateFill className='h-4 w-4 text-Primary-400 mr-4' />
                                        <div className='flex flex-row items-center'>打球日期：
                                            {data.weekdays.chineses.map((item, idx) => (
                                                <PrimaryLabel key={'weekday_'+idx} active={true}>{item}</PrimaryLabel>
                                            ))}
                                        </div>
                                    </li>
                                    <li key='time' className='flex items-center mb-4'>
                                        <MdAccessTimeFilled className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>打球時間：{data.play_start} ~ {data.play_end}</span>
                                    </li>
                                    <li key='block' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>場地：<IsEmptyField value={data.block} unit={'塊'} /></span>
                                    </li>
                                    <li key='ball' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>用球：<IsEmptyField value={data.ball} /></span>
                                    </li>
                                    <li key='degree' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <div className='flex flex-row items-center'>球隊程度：
                                            {data.degree_text.map((item, idx) => (
                                                <PrimaryLabel key={'degress_'+idx} active={true}>{item}</PrimaryLabel>
                                            ))}
                                        </div>
                                    </li>
                                    <li key='leader' className='flex items-center mb-4'>
                                        <FaUser className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>隊長：<IsEmptyField value={data.leader} /></span>
                                    </li>
                                    <li key='mobile' className='flex items-center mb-4'>
                                        <FaMobileAlt className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>聯絡電話：<IsEmptyField value={data.mobile} /></span>
                                    </li>
                                    <li key='email' className='flex items-center mb-4'>
                                        <TfiEmail className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>Email：<IsEmptyField value={data.email} /></span>
                                    </li>
                                    <li key='fb' className='flex items-center mb-4'>
                                        <FaFacebookSquare className='h-4 w-4 text-Success-400 mr-4' />
                                        <a href={data.fb} target='_blank' className='' rel='noreferrer'>FB：{data.fb}</a>
                                    </li>
                                    <li key='youtube' className='flex items-center mb-4'>
                                        <FaYoutube className='h-4 w-4 text-Warning-600 mr-4' />
                                        <a href={data.youtube} target='_blank' className='' rel='noreferrer'>youtube：{data.youtube}</a>
                                    </li>
                                    <li key='line' className='flex items-center mb-4'>
                                        <FaLine className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>line：{data.line}</span>
                                    </li>
                                    <li key='website' className='flex items-center mb-4'>
                                        <FaLink className='h-4 w-4 text-Primary-400 mr-4' />
                                        <a href={data.website} target='_blank' rel='noreferrer' className=''>網站：{data.website}</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="">
                                {/* 圖片 */}
                                <div className="w-full xl:w-[400px]">
                                    {data.images && data.images.length > 0
                                        ? <ImageGallery items={gallery} />
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='my-4 py-8 border-b border-gray-700'>
                            <h1 className='text-MyWhite text-xl font-semibold mb-4'>臨打資訊</h1>
                            <div className='text-PrimaryText'>
                                <ul className='mb-4 text-MyWhite'>
                                    <li key='temp_status' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <div className='flex flex-row items-center'>
                                            <div>臨打狀態：</div>
                                            <PrimaryLabel active={data.temp_status === 'online'}>{data.temp_status_text}</PrimaryLabel>
                                        </div>
                                    </li>
                                    <li key='people_limit' className='flex items-center mb-4'>
                                        <FaCheckCircle className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>臨打人數：<IsEmptyField value={data.people_limit} unit='位' /></span>
                                    </li>
                                    <li key='temp_fee_M' className='flex items-center mb-4'>
                                        <FaMale className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>臨打費用(男)：<IsEmptyField value={data.temp_fee_M} unit='元' /></span>
                                    </li>
                                    <li key='temp_fee_F' className='flex items-center mb-4'>
                                        <FaFemale className='h-4 w-4 text-Primary-400 mr-4' />
                                        <span className=''>臨打費用(女)：<IsEmptyField value={data.temp_fee_F} unit='元' /></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='my-4 pt-6'>
                            <h1 className='text-MyWhite text-xl font-semibold mb-4'>詳細說明</h1>
                            <div className='text-PrimaryText text-xl'>
                                {data.content}
                            </div>
                        </div>
                    </div>
                </article>
                <aside className="xl:block" aria-labelledby="sidebar-label">
                    <div className="xl:w-[336px] sticky top-6">
                        <h3 id="sidebar-label" className="sr-only">側邊欄</h3>
                        <Zones able="arena" zones={data.citys} perpage={perpage} />
                    </div>
                </aside>
            </div>
        </div>
    )
    }
}

export default Team;
