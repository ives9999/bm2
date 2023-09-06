import Home from './Home';
import Team from './pages/team/Team';
import Login from './pages/member/Login';
import Register from './pages/member/Register';

import { Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <>
        <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/team" element={ <Team /> } />
            <Route path="/member/login" element={ <Login /> } />
            <Route path="/member/register" element={ <Register /> } />
        </Routes>

        </>
    );
}

export default App;