import { Routes, Route } from 'react-router-dom';
import Header from '../../layout/Header'
import Footer from '../../layout/Footer'
import Home from './Home';
import 'react-toastify/dist/ReactToastify.css';
import Team from './team/Team';
import TeamShow from './team/TeamShow';
import Arena from './arena/Arena';
import Test from '../Test'
import Member from './member/Index'
import Login from './member/Login'
import Register from './member/Register'
import Avatar from './member/Avatar'
import ChangePassword from './member/ChangePassword'
import ForgetPassword from './member/ForgetPassword'
import SetPassword from './member/SetPassword'
import ValidatePage from './member/ValidatePage'
import DoValidate from './member/DoValidate'
import MoreData from './member/MoreData'
import ListTeam from './member/ListTeam'
import EditTeam from './member/EditTeam'
import ListArena from './member/ListArena'
import EditArena from './member/EditArena'

function Frontend() {
    return (
        <>
            <Header />
            <div className="max-h-full min-h-full bg-background">
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
            </div>
        </>
    )
}

export default Frontend
