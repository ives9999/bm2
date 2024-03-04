import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Loading from './component/Loading'
import {AllModal} from "./component/Modal";
import { ToastContainer } from 'react-toastify';
import Home from './pages/frontend/Home';
import Team from './pages/frontend/team/Team';
import TeamShow from './pages/frontend/team/TeamShow';
import Arena from './pages/frontend/arena/Arena';
//import ArenaShow from './pages/frontend/arena/ArenaShow';
import Product from './pages/frontend/product/Product';
import ProductShow from './pages/frontend/product/ProductShow';
import Login from './pages/frontend/member/Login';
import Test from './pages/Test';
import Member from './pages/frontend/member/Index';
import Register from './pages/frontend/member/Register';
import Avatar from './pages/frontend/member/Avatar';
import ChangePassword from './pages/frontend/member/ChangePassword';
import ForgetPassword from './pages/frontend/member/ForgetPassword';
import SetPassword from './pages/frontend/member/SetPassword';
import ValidatePage from './pages/frontend/member/ValidatePage';
import DoValidate from './pages/frontend/member/DoValidate';
import MoreData from './pages/frontend/member/MoreData';
import ListTeam from './pages/frontend/member/ListTeam';
import EditTeam from './pages/frontend/member/EditTeam';
import ListArena from './pages/frontend/member/ListArena';
import EditArena from './pages/frontend/member/EditArena';

import {Layout as FrontendLayout} from './pages/frontend/Layout';
import {Layout as AdminLayout} from './pages/admin/Layout';
import Index from './pages/admin/Index';
import ReadMember from './pages/admin/member/Read'
import ReadProduct from './pages/admin/product/Read'
import UpdateProduct from './pages/admin/product/Update';
import ReadBrand from './pages/admin/brand/Read';
import UpdateBrand from './pages/admin/brand/Update';

import RequireAuth from './component/RequireAuth';


const App = () => {
    return (
        <BrowserRouter>
            <BMProvider>
                <Routes>
                    <Route path='/' element={<FrontendLayout />}>
                        <Route index element={<Home />} />
                        <Route path="team" element={ <Team /> } />
                        <Route path="member/login" element={ <Login /> } />
                        <Route path="/team/show" element={ <TeamShow /> } />
                        <Route path="/arena" element={ <Arena /> } />
                        <Route path="/product" element={ <Product /> } />
                        <Route path="/product/show" element={ <ProductShow /> }> 
                            <Route path=":token" element={ <ProductShow /> } />
                        </Route>
                        <Route path="/test" element={ <Test /> } />
                        <Route path="/member" element={ <Member /> } />
                        <Route path="/member/login" element={ <Login /> } />
                        <Route path="/member/register" element={ <Register /> } />
                        <Route path="/member/avatar" element={ <Avatar /> } />
                        <Route path="/member/changePassword" element={ <ChangePassword /> } />
                        <Route path="/member/forgetPassword" element={ <ForgetPassword /> } />
                        <Route path="/member/setPassword" element={ <SetPassword /> } />
                        <Route path="/member/validate/:type" element={ <ValidatePage /> } />
                        <Route path="/member/doValidate" element={ <DoValidate /> } />
                        <Route path="/member/moreData" element={ <MoreData /> } />
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
                        {/* <Route path='*' element={<NoMatch />} /> */}
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path='/admin' element={<AdminLayout />}>
                            <Route index element={ <Index /> } />
                            <Route path="member" element={ <ReadMember /> } />
                            <Route path="product" element={ <ReadProduct /> } />
                            <Route path="product/update" element={ <UpdateProduct /> }>
                            <Route index element={ <UpdateProduct />} />
                                <Route path=":token" element={ <UpdateProduct /> } />
                            </Route>
                            <Route path="brand" element={ <ReadBrand /> } />
                            <Route path="brand/update" element={ <UpdateBrand /> }>
                            <Route index element={ <UpdateBrand />} />
                                <Route path=":token" element={ <UpdateBrand /> } />
                            </Route>
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