import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Frontend from './pages/frontend/Frontend';
import AdminRoute from './pages/admin/AdminRoute';
import Admin from './pages/admin/Admin';
import Loading from './component/Loading'
import {AllModal} from "./component/Modal";
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <BrowserRouter>
            <BMProvider>
                <Routes>
                    <Route path='/*' element={<Frontend/>} />
                    {/* <Route path='/admin/*' element={<AdminRoute />}> */}
                        <Route path='/admin/*' element={<Admin/>} />
                    {/* </Route> */}
                </Routes>
            <Loading />
            <AllModal />
            <ToastContainer theme="colored" />
            </BMProvider>
        </BrowserRouter>
    )
}

export default App;