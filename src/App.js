import Header from './layout/Header';
import Footer from './layout/Footer';
import Home from './pages/Home';
import Test from './pages/Test';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Team from './pages/team/Team';
import TeamShow from './pages/team/TeamShow';
import Arena from './pages/arena/Arena';
import Member from './pages/member/Index';
import Login from './pages/member/Login';
import Register from './pages/member/Register';
import Avatar from './pages/member/Avatar';
import ValidatePage from './pages/member/ValidatePage';
import ChangePassword from './pages/member/ChangePassword';
import ForgetPassword from './pages/member/ForgetPassword';
import SetPassword from './pages/member/SetPassword';
import DoValidate from './pages/member/DoValidate';
import MoreData from './pages/member/MoreData';
import ListTeam from './pages/member/ListTeam';
import EditTeam from './pages/member/EditTeam';
import ListArena from './pages/member/ListArena';
import EditArena from './pages/member/EditArena';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { BMProvider } from './context/BMContext'
import Loading from './component/Loading'
import {AlertModal, SuccessModal} from "./component/Modal";

const App = () => {
    return (
        <BMProvider>
            <Router>
                <Loading />
                <div className="max-h-full min-h-full bg-background">
                <Header />
                <Routes>
                    <Route path="/" element={ <Home /> } />
                    <Route path="/team" element={ <Team /> } />
                    <Route path="/team/show" element={ <TeamShow /> } />
                    <Route path="/arena" element={ <Arena /> } />
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
                </Routes>
                <Footer />
                <AlertModal />
                <SuccessModal />
                <ToastContainer theme="colored" />
                </div>
            </Router>
        </BMProvider>
    );
}

export default App;