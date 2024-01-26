import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Frontend from './pages/frontend/Frontend';
import AdminRoute from './pages/admin/AdminRoute';
import Admin from './pages/admin/Admin';
import Loading from './component/Loading'
import {AllModal} from "./component/Modal";
import { ToastContainer } from 'react-toastify';

const App = () => {
    return (
        <BMProvider>
            <Router>
                <Routes>
                    <Route path='/*' element={<Frontend/>} />
                    {/* <Route path='/admin/*' element={<AdminRoute />}> */}
                        <Route path='/admin/*' element={<Admin/>} />
                    {/* </Route> */}
                </Routes>
            </Router>
            <Loading />
            <AllModal />
            <ToastContainer theme="colored" />
        </BMProvider>
    )
}

export default App;