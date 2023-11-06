import Home from './pages/Home';
import Test from './pages/Test';
import Team from './pages/team/Team';
import TeamShow from './pages/team/TeamShow';
import Arena from './pages/arena/Arena';
import Member from './pages/member/Index';
import Login from './pages/member/Login';
import Register from './pages/member/Register';
import Avatar from './pages/member/Avatar';
import ChangePassword from './pages/member/ChangePassword';

import { Routes, Route, BrowserRouter } from 'react-router-dom';

const App = () => {
    return (
        <>
        <BrowserRouter>
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
        </Routes>
        </BrowserRouter>
        </>
    );
}

export default App;