import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Loading from './component/Loading'
import {AllModal} from "./component/Modal";
import { ToastContainer } from 'react-toastify';
import Home from './pages/frontend/Home';
import Team from './pages/frontend/team/Team';
import TeamShow from './pages/frontend/team/TeamShow';
import Arena from './pages/frontend/arena/Arena';
import ArenaShow from './pages/frontend/arena/ArenaShow';
import Product from './pages/frontend/product/Product';
import ProductShow from './pages/frontend/product/ProductShow';
import Login from './pages/frontend/member/Login';
import Test from './pages/Test';
import Invoice from './pages/invoice';
import Member from './pages/frontend/member/Index';
import Register from './pages/frontend/member/Register';
import Avatar from './pages/frontend/member/Avatar';
import ChangePassword from './pages/frontend/member/ChangePassword';
import ForgetPassword from './pages/frontend/member/ForgetPassword';
import SetPassword from './pages/frontend/member/SetPassword';
import ValidatePage from './pages/frontend/member/ValidatePage';
import DoValidate from './pages/frontend/member/DoValidate';
import MoreData from './pages/frontend/member/MoreData';
import ContactData from "./pages/frontend/member/ContactData";
import ListTeam from './pages/frontend/member/ListTeam';
import EditTeam from './pages/frontend/member/EditTeam';
import ListArena from './pages/frontend/member/ListArena';
import EditArena from './pages/frontend/member/EditArena';
import Cart from './pages/frontend/member/Cart';
import Checkout from './pages/frontend/member/Checkout';
import Order from './pages/frontend/member/Order';
import OrderShow from "./pages/frontend/member/OrderShow";
import {Error as OrderError} from "./pages/frontend/order/error";

import {Layout as FrontendLayout} from './pages/frontend/Layout';
import {Layout as AdminLayout} from './pages/admin/Layout';
import Index from './pages/admin/Index';
import ReadMember from './pages/admin/member/Read'
import ReadProduct from './pages/admin/product/Read'
import UpdateProduct from './pages/admin/product/Update';
import UpdateMember from './pages/admin/member/Update';
import ReadBrand from './pages/admin/brand/Read';
import UpdateBrand from './pages/admin/brand/Update';
import ReadCart from './pages/admin/cart/Read';
import ReadOrder from './pages/admin/order/Read'
import UpdateOrder from './pages/admin/order/Update';
import ReadCat from './pages/admin/cat/Read';
import UpdateCat from './pages/admin/cat/Update';
import {Cart as MemberCart} from './pages/admin/member/Cart';
import {Order as MemberOrder} from './pages/admin/member/Order';
import {Member as MemberPage} from './pages/admin/pos/member/Member';
import {Sync as MemberSyncPage} from './pages/admin/pos/member/Sync';
import ProductCat from './pages/admin/pos/product/ProductCat';
import {Product as ProductPage} from './pages/admin/pos/product/Product';
import {Order as OrderPage} from './pages/admin/pos/order/Order';
import {OrderByNumber as OrderByNumberPage} from './pages/admin/pos/order/OrderByNumber';
import GatewayMethod from './pages/admin/pos/order/GatewayMethod';
import Cashier from './pages/admin/pos/member/Cashier';

import {Layout as PosLayout} from './pages/pos/Layout';
import {Index as PosIndex} from './pages/pos/Index';
import {Sale} from './pages/pos/Sale';
import RequireAuth from './component/RequireAuth';
import RequireLogin from './component/RequireLogin';
import SetPasswordForStore from './pages/frontend/member/SetPasswordForStore';

const App = () => {
    return (
        <BrowserRouter>
            <BMProvider>
                <Routes>
                    <Route path='/invoice' element={<Invoice />} />
                    <Route path='/' element={<FrontendLayout />}>
                        <Route index element={<Home />} />
                        <Route path="team" element={ <Team /> } />
                        <Route path="/team/show" element={ <TeamShow /> } >
                            <Route path=":token" element={ <TeamShow /> } />
                        </Route>
                        <Route path="/arena" element={ <Arena /> } />
                        <Route path="/arena/show" element={ <ArenaShow /> }>
                            <Route path=":token" element={ <ArenaShow /> } />
                        </Route>
                        <Route path="/product" element={ <Product /> } />
                        <Route path="/product/show" element={ <ProductShow /> }> 
                            <Route path=":token" element={ <ProductShow /> } />
                        </Route>
                        <Route path="/test" element={ <Test /> } />
                        <Route path="/member" element={ <Member /> } />
                        <Route path="/member/login" element={ <Login /> } />
                        <Route path="/member/register" element={ <Register /> } />
                        <Route path='/member/setPasswordForStore' element={ <SetPasswordForStore /> } />
                        <Route path="/member/doValidate" element={ <DoValidate /> } />
                        <Route element={<RequireLogin />}>
                            <Route path="/member/avatar" element={ <Avatar /> } />
                            <Route path="/member/changePassword" element={ <ChangePassword /> } />
                            <Route path="/member/forgetPassword" element={ <ForgetPassword /> } />
                            <Route path="/member/setPassword" element={ <SetPassword /> } />
                            <Route path="/member/validate/:type" element={ <ValidatePage /> } />
                            <Route path="/member/moreData" element={ <MoreData /> } />
                            <Route path="/member/contactData" element={ <ContactData /> } />
                            <Route path="/member/team" element={ <ListTeam /> } />
                            <Route path="/member/team/edit" element={ <EditTeam /> }>
                                <Route index element={ <EditTeam />} />
                                <Route path=":token" element={ <EditTeam /> } />
                            </Route>
                            <Route path="/member/arena" element={ <ListArena /> } />
                            <Route path="/member/arena/edit" element={ <EditArena /> }>
                                <Route index element={ <EditArena />} />
                                <Route path=":token" element={ <EditArena /> } />
                            </Route>   
                            <Route path="/member/cart" element={ <Cart /> } />
                            <Route path="/member/checkout" element={ <Checkout /> }>
                                <Route path=":token" element={<Checkout />} />
                            </Route>
                            <Route path="/member/order" element={ <Order /> } />
                            <Route path="/member/order/show" element={ <OrderShow /> }>
                                <Route path=":token" element={ <OrderShow /> } />
                            </Route>

                            <Route path="/order/error" element={ <OrderError /> } />
                        </Route>
                        {/* <Route path='*' element={<NoMatch />} /> */}
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path='/admin' element={<AdminLayout />}>
                            <Route index element={ <Index /> } />
                            <Route path="member" element={ <ReadMember /> } />
                            <Route path="member/update" element={ <UpdateMember /> }>
                            <Route index element={ <UpdateMember />} />
                                <Route path=":token" element={ <UpdateMember /> } />
                            </Route>
                            <Route path="member/cart" element={ <MemberCart /> }>
                            <Route index element={ <MemberCart />} />
                                <Route path=":token" element={ <MemberCart /> } />
                            </Route>
                            <Route path="member/order" element={ <MemberOrder /> } />
                            <Route path="product" element={ <ReadProduct /> } />
                            <Route path="product/update" element={ <UpdateProduct /> }>
                            <Route index element={ <UpdateProduct />} />
                                <Route path=":token" element={ <UpdateProduct /> } />
                            </Route>
                            <Route path="cart" element={ <ReadCart /> } />
                            <Route path="order" element={ <ReadOrder /> } />
                            <Route path="order/update" element={ <UpdateOrder /> }>
                            <Route index element={ <UpdateOrder />} />
                                <Route path=":token" element={ <UpdateOrder /> } />
                            </Route>
                            <Route path="brand" element={ <ReadBrand /> } />
                            <Route path="brand/update" element={ <UpdateBrand /> }>
                            <Route index element={ <UpdateBrand />} />
                                <Route path=":token" element={ <UpdateBrand /> } />
                            </Route>
                            <Route path="cat" element={ <ReadCat /> } >
                                <Route index element={<ReadCat />} />
                                <Route path=":token" element={<ReadCat />} />
                            </Route>
                            <Route path="cat/update" element={ <UpdateCat /> }>
                            <Route index element={ <UpdateCat />} />
                                <Route path=":token" element={ <UpdateCat /> } />
                            </Route>
                            <Route path="pos/member" element={ <MemberPage /> } />
                            <Route path="pos/memberSync" element={ <MemberSyncPage /> } />
                            <Route path="pos/productCat" element={ <ProductCat /> } />
                            <Route path="pos/product" element={ <ProductPage /> } />
                            <Route path="pos/order" element={ <OrderPage /> } />
                            <Route path="pos/orderByNumber" element={ <OrderByNumberPage /> } />
                            <Route path="pos/gatewayMethod" element={ <GatewayMethod /> } />
                            <Route path="pos/cashier" element={ <Cashier /> } />
                        </Route>
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path='/pos' element={<PosLayout />}>
                            <Route index element={ <PosIndex /> } />
                            <Route path="sale" element={ <Sale /> } />
                        </Route>
                    </Route>
                </Routes>
            <Loading />
            <AllModal />
            <ToastContainer theme="colored" />
            </BMProvider>
        </BrowserRouter>
    )
}

export default App;