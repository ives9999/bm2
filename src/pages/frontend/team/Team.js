import { React, useState, useEffect, useContext } from "react";
import BMContext from '../../../context/BMContext'
import Breadcrumb from '../../../layout/Breadcrumb'
import { UserIcon } from '@heroicons/react/24/outline'
import {Link, useNavigate} from 'react-router-dom';
import { getReadAPI } from "../../../context/team/TeamAction";
import {Pagination, getPageParams} from '../../../component/Pagination'

const breadcrumbs = [
    { name: '球隊', href: '/team', current: true },
]


const Team = () => {
    const {setIsLoading, setAlertModal} = useContext(BMContext)

    const [ rows, setRows ] = useState([]);
    const [meta, setMeta] = useState(null);

    const navigate = useNavigate();
    const toTeam = (token) => {
        navigate("/team/" + token);
    }

    // State to keep track of the scroll position
    const [scroll, setScroll] = useState(0);
    // Effect hook to add a scroll event listener

    useEffect(() => {
        const getData = async () => {
            const data = await getReadAPI()
            console.info(data);
            if (data.status === 200) {
                setRows(data.data.rows)

                var meta = data.data._meta
                const pageParams = getPageParams(meta)
                meta = {...meta, ...pageParams}
                setMeta(meta)

            } else {
                var msgs1 = ""
                for (let i = 0; i < data["message"].length; i++) {
                    const msg = data["message"][i].message
                    msgs1 += msg + "\n"
                }
                if (msgs1.length > 0) {
                    setAlertModal({
                        modalType: 'alert',
                        modalText: msgs1,
                        isModalShow: true,
                        isShowOKButton: true,
                        isShowCancelButton: false,
                    })
                }
            }
        }

        setIsLoading(true)
        getData()
        setIsLoading(false)

        // Callback function to handle the scroll event
        const handleScroll = () => {
            //dump(window.scrollY)
            // Check if the current scroll position is greater than 100 pixels
            const scrollCheck = window.scrollY > 100;
            if ((window.innerHeight + Math.round(window.scrollY)) >= document.body.offsetHeight) {
                //dump("scroll to bottom")
            }

            // Update the 'scroll' state only if the scroll position has changed
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        };

        // Add the 'handleScroll' function as a scroll event listener
        document.addEventListener("scroll", handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
    }, [])

    return (
        <>
        <div className="mx-auto max-w-7xl">
            <main className="isolate">
                <Breadcrumb items={breadcrumbs}/>
                <div className="mt-6 grid grid-cols-12">
                    <div className="col-span-12 lg:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10 xl:gap-x-8">
                            {rows.length > 0
                                ? rows.map((row) => (
                                <div key={row.id} className="bg-blockColor rounded-md border border-borderColor">
                                    <div className="group relative">
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none lg:h-80">
                                            <Link to={"/team/show?token=" + row.token}>
                                            <img
                                                src={row.featured}
                                                alt={row.name}
                                                className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                            />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="mt-4 justify-between">
                                        <div className="mb-6 flex flex-row justify-between">
                                            {row.arena
                                                ?<div className=""><Link className="text-tagColor text-sm hover:text-focusBlue" to={"/arena/" + (row.arena.token) ? row.arena.token : ''}>{row.arena.name}</Link></div>
                                                :''
                                            }
                                            <div className="">
                                                <div className="text-tagColor text-sm hover:text-focusBlue flex">
                                                    <UserIcon className="h-5 w-5 align-middle" aria-hidden="true" />
                                                    <div className="">{row.pv} 次</div>
                                                </div>
                                            </div>
                                        </div>
                                        <Link to={"/team/" + row.id} className="text-textTitleColor text-textTitleSize hover:text-focusBlue focus:text-focusBlue">{row.name}</Link>
                                        <div className="mt-8 mb-6 flex flex-row justify-between">
                                            <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue flex flex-row">
                                                <Link className="" to={"/member/" + row.member["id"]}><img className="w-12 h-12 rounded-full" src={row.member["avatar"]} alt={row.member["nickname"]} /></Link>
                                                <div className="-mt-2">
                                                    <Link to={"/member/" + row.member["token"]} className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.member["nickname"]}</Link>
                                                    <div className="text-base text-tagColor hover:text-focusBlue focus:text-focusBlue ms-2">{row.member["created_at"]}</div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="rounded-md bg-background px-5 py-1 text-sm font-semibold text-primaryText shadow-sm hover:text-Primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    toTeam(row.id)
                                                }}
                                            >
                                                更多...
                                            </button>
                                        </div>
                                    </div>
                                </div>))
                                : ''
                            }
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-3 bg-blockColor ms-8 rounded-md border border-borderColor">
                        
                    </div> 
                </div>
            </main>
        </div>
        </>
    );
}

export default Team;
