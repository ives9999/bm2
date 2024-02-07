import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Frontend from './pages/frontend/Frontend';
// import AdminRoute from './pages/admin/AdminRoute';
import Admin from './pages/admin/Admin';
import Loading from './component/Loading'
import {AllModal} from "./component/Modal";
import { ToastContainer } from 'react-toastify';
import Home from './pages/frontend/Home';
import Team from './pages/frontend/team/Team';
import Login from './pages/frontend/member/Login';

import {Layout as FrontendLayout} from './pages/frontend/Layout';
import {Layout as AdminLayout} from './pages/admin/Layout';
import Index from './pages/admin/Index';
import RequireAuth from './component/RequireAuth';


const App = () => {
    return (
        <BrowserRouter>
            <BMProvider>
                <Routes>
                    <Route path='/' element={<FrontendLayout />}>
                        <Route index element={<Home />} />
                        <Route path="team" element={ <Team /> } />
                        <Route path="/member/login" element={ <Login /> } />
                        {/* <Route path='*' element={<NoMatch />} /> */}
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path='/admin' element={<AdminLayout />}>
                            <Route index element={ <Index /> } />
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