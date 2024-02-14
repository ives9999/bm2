import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Loading from './component/Loading'
import {AllModal} from "./component/Modal";
import { ToastContainer } from 'react-toastify';
import Home from './pages/frontend/Home';
import Team from './pages/frontend/team/Team';
import Login from './pages/frontend/member/Login';

import {Layout as FrontendLayout} from './pages/frontend/Layout';
import {Layout as AdminLayout} from './pages/admin/Layout';
import Index from './pages/admin/Index';
import ReadMember from './pages/admin/member/Read'
import ReadProduct from './pages/admin/product/Read'
import UpdateProduct from './pages/admin/product/Update';

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