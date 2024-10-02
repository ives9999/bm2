import {useEffect, useState, useContext} from 'react'
import BMContext from "../../context/BMContext";
import {useNavigate} from "react-router-dom";
import { getHome } from '../../context/home/HomeAction';
import {Grid, ProductHomeGrid} from '../../component/Grid';
import AddCart from "../../api/AddCart";
import {toLogin} from "../../context/to";
import {BlueModal} from "../../component/Modal";
import {PrimaryButton, PrimaryOutlineButton, SecondaryButton} from "../../component/MyButton";

const Home = () => {
    const {auth, setIsLoading, warning, setAlertModal, isLoading} = useContext(BMContext);
    // const [teams, setTeams] = useState([]);
    // const [arenas, setArenas] = useState([]);
    const [products, setProducts] = useState({});

    const [toggleModalShow, setToggleModalShow] = useState(false);
    const navigate = useNavigate();

    const parts = [
        {key: 'hot', title: '暢銷商品'},
        {key: 'second_racket', title: '最新二手拍'},
        {key: 'racket', title: '最新球拍'},
    ]

    useEffect(() => {
        const fetch = async () => {
            const data = await getHome();
            console.info(data.data);
            data.data['hot'].map(item => {
                console.info(item);
                return '';
            })
            // data is {team: team, arena: arena}
            // team and arena is {status: 200, data: [{}, {}, {}]}
            // setTeams(data.team.data);
            // setArenas(data.arena.data);
            setProducts(data.data);
        }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addCart = async (token) => {
        if ('id' in auth && auth.id > 0) {
            //console.info(auth);
            setIsLoading(true);
            const res = await AddCart(auth.accessToken, token);
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

    const goCart = () => {
        navigate('/member/cart');
    }

    const goCheckout = () => {
        navigate('/member/checkout');
    }
    if (isLoading) return <div className='text-MyWhite'>Loading...</div>
    else { return (
        <>
        <div className="mx-auto max-w-screen-xl">
            <main className="isolate">
                <div className="row mt-70">
                    <section className="">
                        <div className="py-8 lg:py-16">
                            {parts.map(part => (
                                <div key={part.key}>
                                    <div className="mx-auto max-w-screen-sm text-left mb-8 lg:mb-12 lg:ml-2">
                                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-MyWhite">{part.title}</h2>
                                    </div>
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                        {products[part.key].map(product => (
                                        <ProductHomeGrid
                                            key={product.token}
                                            able="product"
                                            featured={product.path}
                                            name={product.name}
                                            token={product.token}
                                            cat_name={product.cat_name}
                                            cat_token={product.cat_token}
                                            sellPrice={product.sellPrice}
                                            price_nonmember={product.price_nonmember}
                                            created_at={product.created_at}
                                            addCart={addCart}
                                        />
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {/*<div className="mt-24 mx-auto max-w-screen-sm text-left mb-8 lg:mb-12 lg:ml-2">*/}
                            {/*    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-MyWhite">最新登錄球隊</h2>*/}
                            {/*</div>*/}
                            {/*<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">*/}
                            {/*    {teams.map(team =>    */}
                            {/*    <Grid */}
                            {/*        key={team.token}*/}
                            {/*        able="team"*/}
                            {/*        featured={team.path}*/}
                            {/*        name={team.name} */}
                            {/*        token={team.token}*/}
                            {/*        arena_name={team.arena_name} */}
                            {/*        arena_token={team.arena_token}*/}
                            {/*        city_id={team.city_id} */}
                            {/*        city_name={team.city_name}*/}
                            {/*        area_id={team.area_id} */}
                            {/*        area_name={team.area_name}*/}
                            {/*        nickname={team.nickname}*/}
                            {/*        avatar={process.env.REACT_APP_ASSETS_DOMAIN + team.avatar}*/}
                            {/*        member_token={team.member_token}*/}
                            {/*        created_at={team.created_at}*/}
                            {/*    />*/}
                            {/*    )}*/}
                            {/*</div>*/}
                            {/*<div className="mt-24 mx-auto max-w-screen-sm text-left mb-8 lg:mb-12 lg:ml-2">*/}
                            {/*    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">最新登錄球館</h2>*/}
                            {/*</div>*/}
                            {/*<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">*/}
                            {/*    {arenas.map(arena =>    */}
                            {/*    <Grid */}
                            {/*        key={arena.token}*/}
                            {/*        able="arena"*/}
                            {/*        featured={arena.path}*/}
                            {/*        name={arena.name} */}
                            {/*        token={arena.token}*/}
                            {/*        // arena_name={team.arena_name} */}
                            {/*        // arena_token={team.arena_token}*/}
                            {/*        city_id={arena.city_id} */}
                            {/*        city_name={arena.city_name}*/}
                            {/*        area_id={arena.area_id} */}
                            {/*        area_name={arena.area_name}*/}
                            {/*        nickname={arena.nickname}*/}
                            {/*        avatar={process.env.REACT_APP_ASSETS_DOMAIN + arena.avatar}*/}
                            {/*        member_token={arena.member_token}*/}
                            {/*        created_at={arena.created_at}*/}
                            {/*/>*/}
                            {/*    )}*/}
                            {/*</div>*/}
                        </div> 
                    </section>
                    {/*<ul>*/}
                    {/*    {teams.map(team => */}
                    {/*        <li key={team.id}>{team.name}</li>*/}
                    {/*    )}*/}
                    {/*</ul>*/}
                    {/* <HomeTeam2 />
                    <HomeArena /> */}
                </div>
            </main>
        </div>
            {toggleModalShow ?
                <BlueModal isModalShow={toggleModalShow}>
                    <BlueModal.Header setIsModalShow={setToggleModalShow}>購物車</BlueModal.Header>
                    <BlueModal.Body>成功加入購物車</BlueModal.Body>
                    <BlueModal.Footer>
                        <PrimaryButton onClick={() => setToggleModalShow(false)}>關閉</PrimaryButton>
                        <SecondaryButton onClick={goCart}>前往購物車</SecondaryButton>
                        <PrimaryOutlineButton onClick={goCheckout}>結帳</PrimaryOutlineButton>
                    </BlueModal.Footer>
                </BlueModal>
                : ''}
        </>
    )}
}

export default Home;